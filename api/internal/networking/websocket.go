package networking

import (
	"net/http"

	"github.com/gorilla/websocket"
)

var SimpleUpgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins for simplicity, consider restricting in production
	},
}

const (
	MessageTypePlayerJoined   = "PLAYER_JOINED"
	MessageTypePlayerLeft     = "PLAYER_LEFT"
	MessageTypeStartGame      = "START_GAME"
	MessageTypePlayerPosition = "PLAYER_POSITION"
	MessageTypePlayerAction   = "PLAYER_ACTION"
)

type Message struct {
	Type string `json:"type"`
	Data string `json:"data,omitempty"`
}
