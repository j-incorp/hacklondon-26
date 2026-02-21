package game

import (
	"encoding/json"
	"log/slog"
	"sync"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type Player struct {
	Id             string          `json:"id"`
	Name           string          `json:"name"`
	Role           PlayerRole      `json:"role"`
	Position       Position        `json:"position"`
	Conn           *websocket.Conn `json:"-"`
	Send           chan []byte     `json:"-"`
	Recv           chan []byte     `json:"-"`
	mu             sync.Mutex
	connected      bool
	stopCh         chan struct{}
	disconnectOnce sync.Once
}

type Position struct {
	Lat  float64 `json:"lat"`
	Long float64 `json:"long"`
}

type PlayerRole string

var (
	PlayerRoleHider  PlayerRole = "HIDER"
	PlayerRoleSeeker PlayerRole = "SEEKER"
)

func NewPlayer(name string, conn *websocket.Conn) *Player {
	return &Player{
		Id:        uuid.New().String(),
		Name:      name,
		Conn:      conn,
		Send:      make(chan []byte, 256),
		Recv:      make(chan []byte, 256),
		connected: true,
		stopCh:    make(chan struct{}),
	}
}

// SetRole assigns the player's role.
func (p *Player) SetRole(role PlayerRole) {
	p.mu.Lock()
	defer p.mu.Unlock()
	p.Role = role
}

// SetPosition updates the player's geographic position.
func (p *Player) SetPosition(pos Position) {
	p.mu.Lock()
	defer p.mu.Unlock()
	p.Position = pos
}

func (p *Player) Disconnect() {
	p.Conn.Close()
}

func (p *Player) DisconnectFrom(lobby *Lobby) {
	p.disconnectOnce.Do(func() {
		// Signal all goroutines for this session to stop.
		close(p.stopCh)

		if lobby.GetGameState() != WaitingForPlayers {
			// The player needs to be able to rejoin later if something goes wrong
			slog.Warn("Player lost connection during game", "playerId", p.Id)
			p.mu.Lock()
			p.connected = false
			p.mu.Unlock()
			p.Conn.Close()
			return
		}
		err := lobby.LeaveLobby(p.Id)
		if err != nil {
			slog.Error("Failed to remove player from lobby", "playerId", p.Id, "error", err)
		}
		msg, err := json.Marshal(OutgoingMessage{Type: MessageTypePlayerLeft, Data: PlayerLeftMessage{p.Id}})
		if err != nil {
			slog.Error("Failed to marshal player left message", "playerId", p.Id, "error", err)
			p.Disconnect()
			return
		}
		lobby.broadcast(msg)
		lobby.sendPlayerList()
		p.Disconnect()
	})
}

// PrepareReconnect resets the player's connection state so new goroutines
// can operate without racing with old ones.
func (p *Player) PrepareReconnect(conn *websocket.Conn) {
	p.mu.Lock()
	p.Conn = conn
	p.connected = true
	p.stopCh = make(chan struct{})
	p.disconnectOnce = sync.Once{}
	p.mu.Unlock()
}
