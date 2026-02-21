package handlers

import (
	"hacklondon26/internal/game"
	"log/slog"
	"math/rand"
	"sync"
)

var letters = []rune("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

// LobbyStore is a thread-safe in-memory store for active lobbies.
type LobbyStore struct {
	mu      sync.RWMutex
	lobbies map[string]*game.Lobby
}

var store = &LobbyStore{lobbies: make(map[string]*game.Lobby)}

func generateCode() string {
	b := make([]rune, 4)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

// CreateLobby creates a new empty lobby and returns its 4-letter code.
func (s *LobbyStore) CreateLobby() string {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Avoid collisions
	for {
		code := generateCode()
		if _, ok := s.lobbies[code]; !ok {
			l := game.NewLobby()
			s.lobbies[code] = l
			go s.watchLobby(code, l)
			return code
		}
	}
}

// GetLobby returns the lobby for the given code and whether it exists.
func (s *LobbyStore) GetLobby(code string) (*game.Lobby, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	l, ok := s.lobbies[code]
	return l, ok
}

// watchLobby waits for a lobby to signal done and removes it from the store.
func (s *LobbyStore) watchLobby(code string, l *game.Lobby) {
	<-l.Done()
	s.mu.Lock()
	delete(s.lobbies, code)
	s.mu.Unlock()
	slog.Debug("Lobby cleaned up", "code", code)
}
