package game

import (
	"encoding/json"
	"errors"
	"hacklondon26/internal/networking"
	"log/slog"
	"strconv"
	"sync"

	"github.com/gorilla/websocket"
)

const MaxPlayers = 2

var (
	ErrLobbyFull        = errors.New("lobby is full")
	ErrPlayerNotFound   = errors.New("player not found")
	ErrNotEnoughPlayers = errors.New("not enough players to start the game")
)

type GameState int

const (
	WaitingForPlayers GameState = iota
	Hiding
	Seeking
	Finished
)

type Lobby struct {
	mu        sync.RWMutex
	players   []*Player
	gameState GameState
	done      chan struct{} // closed when the lobby is finished, for cleanup
}

func NewLobby() *Lobby {
	return &Lobby{
		gameState: WaitingForPlayers,
		done:      make(chan struct{}),
	}
}

// Done returns a channel that is closed when the lobby is finished (all players left).
func (l *Lobby) Done() <-chan struct{} {
	return l.done
}

// GetGameState returns the current game state safely under a read-lock.
func (l *Lobby) GetGameState() GameState {
	l.mu.RLock()
	defer l.mu.RUnlock()
	return l.gameState
}

func (l *Lobby) AddPlayer(p *Player) error {
	l.mu.Lock()
	defer l.mu.Unlock()
	if len(l.players) < MaxPlayers {
		l.players = append(l.players, p)
		go l.handlePlayerSocket(p)
		return nil
	}
	return ErrLobbyFull
}

func (l *Lobby) GetPlayers() []*Player {
	l.mu.RLock()
	defer l.mu.RUnlock()
	cp := make([]*Player, len(l.players))
	copy(cp, l.players)
	return cp
}

func (l *Lobby) LeaveLobby(id string) error {
	l.mu.Lock()
	defer l.mu.Unlock()
	for i, player := range l.players {
		if player.Id == id {
			l.players = append(l.players[:i], l.players[i+1:]...)
			// Signal done for cleanup when no players remain
			if len(l.players) == 0 {
				select {
				case <-l.done:
				default:
					close(l.done)
				}
			}
			return nil
		}
	}
	return ErrPlayerNotFound
}

func (l *Lobby) StartGame() error {
	l.mu.Lock()
	defer l.mu.Unlock()
	if len(l.players) == MaxPlayers {
		slog.Info("Lobby is starting game")
		l.changeGameStateLocked(Hiding)
		go l.handleGameLoop()
		return nil
	}
	return ErrNotEnoughPlayers
}

func (l *Lobby) ReconnectPlayer(id string, wsConn *websocket.Conn) error {
	l.mu.Lock()
	defer l.mu.Unlock()
	for _, p := range l.players {
		if p.Id == id && !p.connected {
			slog.Debug("Player reconnecting to lobby", "playerId", id)
			p.PrepareReconnect(wsConn)
			go l.handlePlayerSocket(p)
			return nil
		}
	}
	return ErrPlayerNotFound
}

func (l *Lobby) handleGameLoop() {
	// Snapshot channel refs and IDs under lock to avoid repeated locking in the loop.
	l.mu.RLock()
	if len(l.players) < 2 {
		l.mu.RUnlock()
		return
	}
	p0Recv := l.players[0].Recv
	p0Id := l.players[0].Id
	p1Recv := l.players[1].Recv
	p1Id := l.players[1].Id
	l.mu.RUnlock()

	for {
		l.mu.RLock()
		state := l.gameState
		l.mu.RUnlock()
		if state == Finished {
			return
		}

		select {
		case msg, ok := <-p0Recv:
			if !ok {
				return
			}
			slog.Debug("Received message from player", "playerId", p0Id, "message", msg)
			l.HandlePlayerMessage(p0Id, msg)
		case msg, ok := <-p1Recv:
			if !ok {
				return
			}
			slog.Debug("Received message from player", "playerId", p1Id, "message", msg)
			l.HandlePlayerMessage(p1Id, msg)
		case <-l.done:
			return
		}
	}
}

func (l *Lobby) HandlePlayerMessage(playerId string, message []byte) {
	slog.Debug("Handling player message", "playerId", playerId, "message", string(message))
}

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

func (l *Lobby) changeGameState(state GameState) {
	l.mu.Lock()
	defer l.mu.Unlock()
	l.changeGameStateLocked(state)
}

// changeGameStateLocked broadcasts the state change and updates gameState.
// Caller must hold l.mu.Lock().
func (l *Lobby) changeGameStateLocked(state GameState) {
	msg, err := json.Marshal(networking.Message{Type: networking.MessageTypeGameStateChange, Data: strconv.Itoa(int(state))})
	if err != nil {
		slog.Error("Failed to marshal game state change", "error", err)
		return
	}
	l.broadcastLocked(msg)
	l.gameState = state
}

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

func (l *Lobby) handlePlayerSocket(player *Player) {
	// Send the player information about themselves
	pData, err := json.Marshal(player)
	if err != nil {
		slog.Error("Failed to marshal player data", "playerId", player.Id, "error", err)
		return
	}
	msg, err := json.Marshal(networking.Message{Type: networking.MessageTypePlayerInfo, Data: string(pData)})
	if err != nil {
		slog.Error("Failed to marshal player info message", "playerId", player.Id, "error", err)
		return
	}
	l.sendToPlayer(player.Id, msg)
	// Broadcast the global join event and lobby state
	msg, err = json.Marshal(networking.Message{Type: networking.MessageTypePlayerJoined, Data: player.Id})
	if err != nil {
		slog.Error("Failed to marshal player joined message", "playerId", player.Id, "error", err)
		return
	}
	l.broadcast(msg)
	l.sendPlayerList()
	// Start handlers for the player's sent and received messages
	go l.handlePlayerSocketRecv(player)
	go l.handlePlayerSocketSend(player)
}

func (l *Lobby) sendPlayerList() {
	l.mu.RLock()
	pList, err := json.Marshal(l.players)
	l.mu.RUnlock()
	if err != nil {
		slog.Error("Failed to marshal player list", "error", err)
		return
	}
	msg, err := json.Marshal(networking.Message{Type: networking.MessageTypePlayerListUpdate, Data: string(pList)})
	if err != nil {
		slog.Error("Failed to marshal player list message", "error", err)
		return
	}
	l.broadcast(msg)
}

// Loop to handle incoming player messages
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
