package game

import (
	"errors"
	"log/slog"
	"sync"

	"github.com/gorilla/websocket"
)

const MaxPlayers = 2

var (
	ErrLobbyFull      = errors.New("lobby is full")
	ErrPlayerNotFound = errors.New("player not found")
)

type Lobby struct {
	mu      sync.Mutex
	players []*Player
}

func NewLobby() *Lobby {
	return &Lobby{}
}

func (l *Lobby) AddPlayer(p *Player) error {
	l.mu.Lock()
	defer l.mu.Unlock()
	if len(l.players) < MaxPlayers {
		l.players = append(l.players, p)
		handlePlayerSocket(p)
		return nil
	}
	return ErrLobbyFull
}

func (l *Lobby) GetPlayers() []*Player {
	l.mu.Lock()
	defer l.mu.Unlock()
	return l.players
}

func (l *Lobby) LeaveLobby(id string) error {
	l.mu.Lock()
	defer l.mu.Unlock()
	for i, player := range l.players {
		if player.Id == id {
			l.players = append(l.players[:i], l.players[i+1:]...)
			return nil
		}
	}
	return ErrPlayerNotFound
}

func (l *Lobby) StartGame() {
	slog.Info("Lobby is starting game")
	l.handleGameLoop()
}

func (l *Lobby) handleGameLoop() {
	select {
	case msg := <-l.players[0].Recv:
		slog.Debug("Received message from player", "playerId", l.players[0].Id, "message", msg)
	case msg := <-l.players[1].Recv:
		slog.Debug("Received message from player", "playerId", l.players[1].Id, "message", msg)
	}
}

func (l *Lobby) sendToPlayer(id string, message string) error {
	l.mu.Lock()
	defer l.mu.Unlock()
	for _, player := range l.players {
		if player.Id == id {
			player.Send <- message
			return nil
		}
	}
	return ErrPlayerNotFound
}

func handlePlayerSocket(player *Player) {
	go handlePlayerSocketRecv(player)
	go handlePlayerSocketSend(player)
}

// Loop to handle incoming player messages
func handlePlayerSocketRecv(player *Player) {
	defer player.Disconnect()

	for {
		_, msg, err := player.Conn.ReadMessage()
		if err != nil {
			slog.Debug("Player websocket disconnected", "playerId", player.Id, "error", err)
			return
		}
		player.Recv <- string(msg)
	}
}

func handlePlayerSocketSend(player *Player) {
	defer player.Disconnect()

	for msg := range player.Send {
		err := player.Conn.WriteMessage(websocket.TextMessage, []byte(msg))
		if err != nil {
			slog.Warn("Failed to send message to player", "playerId", player.Id, "error", err)
			return
		}
	}
}
