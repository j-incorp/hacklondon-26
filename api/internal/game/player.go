package game

import (
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type Player struct {
	Id   string          `json:"id"`
	Name string          `json:"name"`
	Conn *websocket.Conn `json:"-"`
	Send chan string     `json:"-"`
	Recv chan string     `json:"-"`
}

func NewPlayer(name string, conn *websocket.Conn) *Player {
	return &Player{
		Id:   uuid.New().String(),
		Name: name,
		Conn: conn,
		Send: make(chan string, 256),
		Recv: make(chan string, 256),
	}
}

func (p *Player) Disconnect() {
	p.Conn.Close()
}
