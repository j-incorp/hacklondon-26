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
			go s.watchLobby(code, l)
			return code
		}
	}
}

// watchLobby waits for a lobby to signal done and removes it from the store.
func (s *LobbyStore) watchLobby(code string, l *game.Lobby) {
	<-l.Done()
	s.mu.Lock()
	delete(s.lobbies, code)
	s.mu.Unlock()
	slog.Debug("Lobby cleaned up", "code", code)
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

	store.mu.RLock()
	lobby, exists := store.lobbies[code]
	store.mu.RUnlock()
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

func StartGame(c *gin.Context) {
	code := strings.ToUpper(c.Param("code"))

	// Check lobby code is a valid format
	if len(code) != 4 {
		slog.Debug("Invalid lobby code", "code", code)
		c.Status(http.StatusBadRequest)
		return
	}

	store.mu.RLock()
	lobby, exists := store.lobbies[code]
	store.mu.RUnlock()
	if !exists {
		slog.Debug("Lobby not found", "code", code)
		c.Status(http.StatusNotFound)
		return
	}

	err := lobby.StartGame()
	if err != nil {
		slog.Debug("Game is not ready to start", "code", code)
		c.Status(http.StatusConflict)
		return
	}

	c.Status(http.StatusOK)
}

func Reconnect(c *gin.Context) {
	code := strings.ToUpper(c.Param("code"))

	// Check lobby code is a valid format
	if len(code) != 4 {
		slog.Debug("Invalid lobby code", "code", code)
		c.Status(http.StatusBadRequest)
		return
	}

	store.mu.RLock()
	lobby, exists := store.lobbies[code]
	store.mu.RUnlock()
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

	err = lobby.ReconnectPlayer(c.Query("id"), wsConn)
	if err != nil {
		slog.Debug("Failed to reconnect player", "code", code, "error", err, "id", c.Query("id"))
		c.Status(http.StatusInternalServerError)
		wsConn.Close()
		return
	}

	c.Status(http.StatusOK)
}
