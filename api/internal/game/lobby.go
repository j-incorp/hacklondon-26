package game

import (
	"log/slog"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

// Lobby manages the players in a game session and coordinates game lifecycle.
type Lobby struct {
	mu           sync.RWMutex
	players      []*Player
	gameState    GameState
	seekingBegan time.Time
	done         chan struct{} // closed when the lobby is finished, for cleanup
}

// NewLobby creates a lobby in the WaitingForPlayers state.
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

// AddPlayer adds a player to the lobby and starts their socket handler.
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

// GetPlayers returns a snapshot copy of the current player list.
func (l *Lobby) GetPlayers() []*Player {
	l.mu.RLock()
	defer l.mu.RUnlock()
	cp := make([]*Player, len(l.players))
	copy(cp, l.players)
	return cp
}

// LeaveLobby removes a player from the lobby by ID.
// When the last player leaves, the done channel is closed to trigger cleanup.
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

// StartGame transitions the lobby into the Hiding state and launches the game loop.
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

// ReconnectPlayer re-establishes a WebSocket connection for a disconnected player.
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
