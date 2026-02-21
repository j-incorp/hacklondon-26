package handlers

import (
	"hacklondon26/internal/game"
	"log/slog"
	"math/rand"
	"net/http"
	"strings"
	"sync"

	"github.com/gin-gonic/gin"
)

var letters = []rune("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

type LobbyStore struct {
	mu      sync.Mutex
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

// Create a new empty lobby and return its 4-letter code.
func (s *LobbyStore) CreateLobby() string {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Avoid collisions
	for {
		code := generateCode()
		if _, ok := s.lobbies[code]; !ok {
			l := game.NewLobby()
			s.lobbies[code] = l
			return code
		}
	}
}

// CreateLobby creates a new lobby and returns its 4-letter code.
func CreateLobby(c *gin.Context) {
	code := store.CreateLobby()
	slog.Debug("Lobby created", "code", code)
	c.JSON(http.StatusCreated, gin.H{"code": code})
}

// JoinLobby allows a user to join a lobby by providing the 4-letter code as a URL param.
// Expected route example: POST /lobbies/:code/join
func JoinLobby(c *gin.Context) {
	code := strings.ToUpper(c.Param("code"))

	// Check lobby code is a valid format
	if len(code) != 4 {
		slog.Debug("Invalid lobby code", "code", code)
		c.Status(http.StatusBadRequest)
		return
	}

	lobby, exists := store.lobbies[code]
	if !exists {
		slog.Debug("Lobby not found", "code", code)
		c.Status(http.StatusNotFound)
		return
	}

	if err := lobby.AddPlayer(game.NewPlayer("Player")); err != nil {
		slog.Debug("Lobby is full", "code", code)
		c.Status(http.StatusConflict)
		return
	}

	slog.Debug("Player joined lobby", "code", code, "name", "Player")
	c.Status(http.StatusOK)
}
