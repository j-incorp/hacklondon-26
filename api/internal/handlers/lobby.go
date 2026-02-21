package handlers

import (
	"hacklondon26/internal/game"
	"hacklondon26/internal/networking"
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

// JoinLobby upgrades the connection to a WebSocket and adds the player to the lobby.
// Expected route: GET /lobby/:code
func JoinLobby(c *gin.Context) {
	code := strings.ToUpper(c.Param("code"))

	// Check lobby code is a valid format
	if len(code) != 4 {
		slog.Debug("Invalid lobby code", "code", code)
		c.Status(http.StatusBadRequest)
		return
	}

	store.mu.Lock()
	lobby, exists := store.lobbies[code]
	store.mu.Unlock()
	if !exists {
		slog.Debug("Lobby not found", "code", code)
		c.Status(http.StatusNotFound)
		return
	}

	wsConn, err := networking.SimpleUpgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		slog.Error("Failed to upgrade to WebSocket", "error", err)
		c.Status(http.StatusInternalServerError)
		return
	}

	player := game.NewPlayer("Player", wsConn)
	if err := lobby.AddPlayer(player); err != nil {
		slog.Debug("Lobby is full", "code", code)
		player.Disconnect()
		return
	}

	c.Status(http.StatusOK)
}
