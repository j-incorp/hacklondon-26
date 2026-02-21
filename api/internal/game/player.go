package game

import (
	"encoding/json"
	"hacklondon26/internal/networking"
	"log/slog"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type Player struct {
	Id   string          `json:"id"`
	Name string          `json:"name"`
	Conn *websocket.Conn `json:"-"`
	Send chan []byte     `json:"-"`
	Recv chan []byte     `json:"-"`
}

func NewPlayer(name string, conn *websocket.Conn) *Player {
	return &Player{
		Id:   uuid.New().String(),
		Name: name,
		Conn: conn,
		Send: make(chan []byte, 256),
		Recv: make(chan []byte, 256),
	}
}

func (p *Player) Disconnect() {
	p.Conn.Close()
}

func (p *Player) DisconnectFrom(lobby *Lobby) {
	err := lobby.LeaveLobby(p.Id)
	if err != nil {
		slog.Error("Failed to remove player from lobby", "playerId", p.Id, "error", err)
	}
	p.Disconnect()
	msg, _ := json.Marshal(networking.Message{Type: networking.MessageTypePlayerLeft, Data: p.Id})
	lobby.broadcast(msg)
}
