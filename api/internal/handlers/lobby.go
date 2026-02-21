package handlers

import (
	"hacklondon26/internal/game"
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
			l := &game.Lobby{}
			s.lobbies[code] = l
			return code
		}
	}
}

func (s *LobbyStore) Exists(code string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	_, ok := s.lobbies[code]
	return ok
}

// CreateLobby creates a new lobby and returns its 4-letter code.
func CreateLobby(c *gin.Context) {
	code := store.CreateLobby()
	c.JSON(http.StatusCreated, gin.H{"code": code})
}

// JoinLobby allows a user to join a lobby by providing the 4-letter code as a URL param.
// Expected route example: POST /lobbies/:code/join
func JoinLobby(c *gin.Context) {
	code := strings.ToUpper(c.Param("code"))

	// Check lobby code is a valid format
	if len(code) != 4 {
		c.Status(http.StatusBadRequest)
		return
	}

	if store.Exists(code) {
		c.JSON(http.StatusOK, gin.H{"code": code})
		return
	}

	// Lobby not found
	c.Status(http.StatusNotFound)
}
