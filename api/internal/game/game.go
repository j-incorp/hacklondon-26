package game

import (
	"encoding/json"
	"errors"
	"log/slog"
	"time"
)

const MaxPlayers = 2

// TODO: set to something reasonable for the game
const HidingTime = 5 * time.Second

var (
	ErrLobbyFull        = errors.New("lobby is full")
	ErrPlayerNotFound   = errors.New("player not found")
	ErrNotEnoughPlayers = errors.New("not enough players to start the game")
)

// GameState represents the current phase of a game.
type GameState string

const (
	WaitingForPlayers GameState = "WAITING_FOR_PLAYERS"
	Hiding            GameState = "HIDING"
	Seeking           GameState = "SEEKING"
	Finished          GameState = "FINISHED"
)

// handleGameLoop processes player messages until the game finishes or the lobby closes.
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
			l.HandlePlayerMessage(0, msg)
		case msg, ok := <-p1Recv:
			if !ok {
				return
			}
			slog.Debug("Received message from player", "playerId", p1Id, "message", msg)
			l.HandlePlayerMessage(1, msg)
		case <-l.done:
			return
		}
	}
}

// HandlePlayerMessage processes a message received from a player during the game.
func (l *Lobby) HandlePlayerMessage(player int, message []byte) {
	slog.Debug("Handling player message", "playerId", l.players[player].Id, "message", string(message))
	var msg IncomingMessage
	err := json.Unmarshal(message, &msg)
	if err != nil {
		slog.Error("Failed to unmarshal player message", "playerId", l.players[player].Id, "error", err)
		return
	}
	switch msg.Type {
	case MessageTypePlayerPosition:
		slog.Debug("Received player position update", "playerId", l.players[player].Id, "position", msg.Data)
		var pos Position
		err := json.Unmarshal(msg.Data, &pos)
		if err != nil {
			slog.Warn("Failed to unmarshal player position", "playerId", l.players[player].Id, "error", err)
			return
		}
		l.players[player].Position = pos
		// If the other player is the hider, send the position there too
		if l.players[1-player].Role == PlayerRoleHider {
			posMsg, err := json.Marshal(OutgoingMessage{Type: MessageTypePlayerPosition, Data: PlayerPositionMessage{pos.Lat, pos.Long}})
			if err != nil {
				slog.Error("Failed to marshal position message for other player", "playerId", l.players[player].Id, "error", err)
				return
			}
			err = l.sendToPlayer(l.players[1-player].Id, posMsg)
			if err != nil {
				slog.Error("Failed to send position message to other player", "playerId", l.players[player].Id, "error", err)
			}
		}
	default:
		slog.Warn("Received unknown message type from player", "playerId", l.players[player].Id, "messageType", msg.Type)
	}
}

// changeGameState transitions the game state and broadcasts the change.
func (l *Lobby) changeGameState(state GameState) {
	l.mu.Lock()
	defer l.mu.Unlock()
	l.changeGameStateLocked(state)
}

// changeGameStateLocked broadcasts the state change and updates gameState.
// Caller must hold l.mu.Lock().
func (l *Lobby) changeGameStateLocked(state GameState) {
	// Broadcast the new game state
	msg, err := json.Marshal(OutgoingMessage{Type: MessageTypeGameStateChange, Data: GameStateChangeMessage{State: string(state)}})
	if err != nil {
		slog.Error("Failed to marshal game state change", "error", err)
		return
	}
	l.broadcastLocked(msg)
	l.gameState = state
	// If the state has a setup function, call it
	switch state {
	case Hiding:
		go func() {
			slog.Debug("Beginning Hiding phase timer", "duration", HidingTime)
			time.Sleep(HidingTime)
			slog.Debug("Hiding timer has elapsed")
			l.changeGameState(Seeking)
		}()
	case Seeking:
		slog.Debug("Seeking phase started")
		l.seekingBegan = time.Now()
	case Finished:
		slog.Debug("Game finished", "seekingDuration", time.Since(l.seekingBegan))
	}
}
