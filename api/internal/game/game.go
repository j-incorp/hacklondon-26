package game

import (
	"encoding/json"
	"errors"
	"hacklondon26/internal/networking"
	"log/slog"
	"sync"

	"github.com/gorilla/websocket"
)

const MaxPlayers = 2

var (
	ErrLobbyFull        = errors.New("lobby is full")
	ErrPlayerNotFound   = errors.New("player not found")
	ErrNotEnoughPlayers = errors.New("not enough players to start the game")
)

type Lobby struct {
	mu      sync.RWMutex
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
		go l.handlePlayerSocket(p)
		return nil
	}
	return ErrLobbyFull
}

func (l *Lobby) GetPlayers() []*Player {
	l.mu.RLock()
	defer l.mu.RUnlock()
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

func (l *Lobby) StartGame() error {
	if len(l.players) == MaxPlayers {
		slog.Info("Lobby is starting game")
		msg, _ := json.Marshal(networking.Message{Type: networking.MessageTypeStartGame})
		l.broadcast(msg)
		l.handleGameLoop()
	} else {
		return ErrNotEnoughPlayers
	}

	return nil
}

func (l *Lobby) handleGameLoop() {
	select {
	case msg := <-l.players[0].Recv:
		slog.Debug("Received message from player", "playerId", l.players[0].Id, "message", msg)
		l.HandlePlayerMessage(l.players[0].Id, msg)
	case msg := <-l.players[1].Recv:
		slog.Debug("Received message from player", "playerId", l.players[1].Id, "message", msg)
		l.HandlePlayerMessage(l.players[1].Id, msg)
	}
}

func (l *Lobby) HandlePlayerMessage(playerId string, message []byte) {
	slog.Debug("Handling player message", "playerId", playerId, "message", string(message))
}

func (l *Lobby) sendToPlayer(id string, message []byte) error {
	l.mu.RLock()
	defer l.mu.RUnlock()
	for _, player := range l.players {
		if player.Id == id {
			player.Send <- message
			return nil
		}
	}
	return ErrPlayerNotFound
}

func (l *Lobby) broadcast(message []byte) {
	l.mu.RLock()
	defer l.mu.RUnlock()
	for _, player := range l.players {
		player.Send <- message
	}
}

func (l *Lobby) handlePlayerSocket(player *Player) {
	msg, _ := json.Marshal(networking.Message{Type: networking.MessageTypePlayerJoined, Data: player.Id})
	l.broadcast(msg)
	go l.handlePlayerSocketRecv(player)
	go l.handlePlayerSocketSend(player)
}

// Loop to handle incoming player messages
func (l *Lobby) handlePlayerSocketRecv(player *Player) {
	defer player.DisconnectFrom(l)

	for {
		_, msg, err := player.Conn.ReadMessage()
		if err != nil {
			slog.Debug("Player websocket disconnected", "playerId", player.Id, "error", err)
			return
		}
		player.Recv <- msg
	}
}

func (l *Lobby) handlePlayerSocketSend(player *Player) {
	defer player.DisconnectFrom(l)

	for msg := range player.Send {
		err := player.Conn.WriteMessage(websocket.TextMessage, msg)
		if err != nil {
			slog.Warn("Failed to send message to player", "playerId", player.Id, "error", err)
			return
		}
	}
}
