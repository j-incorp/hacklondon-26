package game

import (
	"encoding/json"
	"log/slog"

	"github.com/gorilla/websocket"
)

// handlePlayerSocket sends initial player/lobby info and starts the send/recv goroutines.
func (l *Lobby) handlePlayerSocket(player *Player, isRejoining bool) {
	// Send the player information about themselves
	msg, err := json.Marshal(OutgoingMessage{Type: MessageTypePlayerInfo, Data: PlayerInfoMessage{Id: player.Id, Name: player.Name}})
	if err != nil {
		slog.Error("Failed to marshal player info message", "playerId", player.Id, "error", err)
		return
	}
	l.sendToPlayer(player.Id, msg)

	// Broadcast the global join event and lobby state
	if !isRejoining {
		msg, err = json.Marshal(OutgoingMessage{Type: MessageTypePlayerJoined, Data: PlayerJoinedMessage{player.Id}})
		if err != nil {
			slog.Error("Failed to marshal player joined message", "playerId", player.Id, "error", err)
			return
		}
		l.broadcast(msg)
		l.sendPlayerList()
	}

	// Start handlers for the player's sent and received messages
	go l.handlePlayerSocketRecv(player)
	go l.handlePlayerSocketSend(player)
}

// handlePlayerSocketRecv reads messages from the player's websocket connection
// and forwards them to the player's Recv channel.
func (l *Lobby) handlePlayerSocketRecv(player *Player) {
	defer player.DisconnectFrom(l)

	// Capture the connection for this session so a reconnect replacing
	// player.Conn doesn't affect this goroutine.
	conn := player.Conn
	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			slog.Debug("Player websocket disconnected", "playerId", player.Id, "error", err)
			return
		}
		select {
		case player.Recv <- msg:
		case <-player.stopCh:
			return
		}
	}
}

// handlePlayerSocketSend reads messages from the player's Send channel
// and writes them to the websocket connection.
func (l *Lobby) handlePlayerSocketSend(player *Player) {
	defer player.DisconnectFrom(l)

	// Capture the connection and stop channel for this session so a
	// reconnect doesn't cause two goroutines to write to the same conn.
	conn := player.Conn
	stop := player.stopCh
	for {
		select {
		case msg, ok := <-player.Send:
			if !ok {
				return
			}
			if player.connected {
				err := conn.WriteMessage(websocket.TextMessage, msg)
				if err != nil {
					slog.Warn("Failed to send message to player", "playerId", player.Id, "error", err)
					return
				}
			} else {
				slog.Debug("Player is not connected, skipping send", "playerId", player.Id)
			}
		case <-stop:
			return
		}
	}
}

// sendToPlayer sends a message to a specific player by ID.
func (l *Lobby) sendToPlayer(id string, message []byte) error {
	l.mu.RLock()
	defer l.mu.RUnlock()
	return l.sendToPlayerLocked(id, message)
}

// sendToPlayerLocked sends a message to a specific player.
// Caller must hold at least l.mu.RLock().
func (l *Lobby) sendToPlayerLocked(id string, message []byte) error {
	for _, player := range l.players {
		if player.Id == id {
			select {
			case player.Send <- message:
			default:
				slog.Warn("Player send buffer full, dropping message", "playerId", player.Id)
			}
			return nil
		}
	}
	return ErrPlayerNotFound
}

// broadcast sends a message to all players in the lobby.
func (l *Lobby) broadcast(message []byte) {
	l.mu.RLock()
	defer l.mu.RUnlock()
	l.broadcastLocked(message)
}

// broadcastLocked sends a message to all players with non-blocking sends.
// Caller must hold at least l.mu.RLock().
func (l *Lobby) broadcastLocked(message []byte) {
	for _, player := range l.players {
		select {
		case player.Send <- message:
		default:
			slog.Warn("Player send buffer full, dropping message", "playerId", player.Id)
		}
	}
}

// sendPlayerList broadcasts the current player list to all players.
func (l *Lobby) sendPlayerList() {
	l.mu.RLock()
	defer l.mu.RUnlock()
	msg, err := json.Marshal(OutgoingMessage{Type: MessageTypePlayerListUpdate, Data: PlayerListUpdateMessage{Players: l.players}})
	if err != nil {
		slog.Error("Failed to marshal player list message", "error", err)
		return
	}
	l.broadcast(msg)
}
