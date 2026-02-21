package game

import (
	"errors"
	"sync"
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
