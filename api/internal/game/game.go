package game

import (
	"encoding/json"
	"errors"
	"log/slog"
	"strconv"
)

const MaxPlayers = 2

var (
	ErrLobbyFull        = errors.New("lobby is full")
	ErrPlayerNotFound   = errors.New("player not found")
	ErrNotEnoughPlayers = errors.New("not enough players to start the game")
)

// GameState represents the current phase of a game.
type GameState int

const (
	WaitingForPlayers GameState = iota
	Hiding
	Seeking
	Finished
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

// HandlePlayerMessage processes a message received from a player during the game.
func (l *Lobby) HandlePlayerMessage(playerId string, message []byte) {
	slog.Debug("Handling player message", "playerId", playerId, "message", string(message))
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
	msg, err := json.Marshal(Message{Type: MessageTypeGameStateChange, Data: strconv.Itoa(int(state))})
	if err != nil {
		slog.Error("Failed to marshal game state change", "error", err)
		return
	}
	l.broadcastLocked(msg)
	l.gameState = state
}
