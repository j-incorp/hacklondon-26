package handlers

import (
	"hacklondon26/internal/game"
	"hacklondon26/internal/networking"
	"log/slog"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// CreateLobby creates a new lobby and returns its 4-letter code.
func (s *Server) CreateLobby(c *gin.Context) {
	code := store.CreateLobby()
	slog.Debug("Lobby created", "code", code)
	c.JSON(http.StatusCreated, gin.H{"code": code})
}

// JoinLobby upgrades the connection to a WebSocket and adds the player to the lobby.
// Expected route: GET /lobby/:code
func (s *Server) JoinLobby(c *gin.Context) {
	code := strings.ToUpper(c.Param("code"))

	if len(code) != 4 {
		slog.Debug("Invalid lobby code", "code", code)
		c.Status(http.StatusBadRequest)
		return
	}

	lobby, exists := store.GetLobby(code)
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

	player := game.NewPlayer(c.Query("name"), wsConn)
	if err := lobby.AddPlayer(player); err != nil {
		slog.Debug("Lobby is full", "code", code)
		player.Disconnect()
		return
	}

	c.Status(http.StatusOK)
}

// StartGame transitions the lobby into the active game state.
func (s *Server) StartGame(c *gin.Context) {
	code := strings.ToUpper(c.Param("code"))

	if len(code) != 4 {
		slog.Debug("Invalid lobby code", "code", code)
		c.Status(http.StatusBadRequest)
		return
	}

	lobby, exists := store.GetLobby(code)
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

// Reconnect upgrades to a WebSocket and re-establishes a disconnected player's session.
func (s *Server) Reconnect(c *gin.Context) {
	code := strings.ToUpper(c.Param("code"))

	if len(code) != 4 {
		slog.Debug("Invalid lobby code", "code", code)
		c.Status(http.StatusBadRequest)
		return
	}

	lobby, exists := store.GetLobby(code)
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
