package game

const (
	MessageTypePlayerInfo       = "PLAYER_INFO"
	MessageTypePlayerJoined     = "PLAYER_JOINED"
	MessageTypePlayerLeft       = "PLAYER_LEFT"
	MessageTypeGameStateChange  = "GAME_STATE_CHANGE"
	MessageTypePlayerPosition   = "PLAYER_POSITION"
	MessageTypePlayerAction     = "PLAYER_ACTION"
	MessageTypePlayerListUpdate = "PLAYER_LIST_UPDATE"
)

// Message represents a WebSocket message exchanged between server and client.
type Message struct {
	Type string `json:"type"`
	Data string `json:"data,omitempty"`
}
