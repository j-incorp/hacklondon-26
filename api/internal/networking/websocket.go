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
	MessageTypePlayerInfo       = "PLAYER_INFO"
	MessageTypePlayerJoined     = "PLAYER_JOINED"
	MessageTypePlayerLeft       = "PLAYER_LEFT"
	MessageTypeGameStateChange  = "GAME_STATE_CHANGE"
	MessageTypePlayerPosition   = "PLAYER_POSITION"
	MessageTypePlayerAction     = "PLAYER_ACTION"
	MessageTypePlayerListUpdate = "PLAYER_LIST_UPDATE"
)

type Message struct {
	Type string `json:"type"`
	Data string `json:"data,omitempty"`
}
