package networking

import (
	"net/http"

	"github.com/gorilla/websocket"
)

// SimpleUpgrader is a WebSocket upgrader that allows all origins.
// Consider restricting CheckOrigin in production.
var SimpleUpgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}
