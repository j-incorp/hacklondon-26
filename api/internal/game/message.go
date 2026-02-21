package game

import "encoding/json"

const (
	MessageTypePlayerInfo       = "PLAYER_INFO"
	MessageTypePlayerJoined     = "PLAYER_JOINED"
	MessageTypePlayerLeft       = "PLAYER_LEFT"
	MessageTypeGameStateChange  = "GAME_STATE_CHANGE"
	MessageTypeHidingPhaseStart = "HIDING_PHASE_START"
	MessageTypePlayerPosition   = "PLAYER_POSITION"
	MessageTypePlayerAction     = "PLAYER_ACTION"
	MessageTypePlayerListUpdate = "PLAYER_LIST_UPDATE"
)

type PlayerAction string

const (
	PlayerActionAskQuestion    = "ASK_QUESTION"
	PlayerActionAnswerQuestion = "ANSWER_QUESTION"
	PlayerActionVetoQuestion   = "VETO_QUESTION"
	PlayerActionSendCurse      = "SEND_CURSE"
)

// Message represents a WebSocket message exchanged between server and client.
type IncomingMessage struct {
	Type string          `json:"type"`
	Data json.RawMessage `json:"data,omitempty"`
}

type OutgoingMessage struct {
	Type string `json:"type"`
	Data any    `json:"data,omitempty"`
}

type PlayerInfoMessage struct {
	Id   string `json:"id"`
	Name string `json:"name"`
	Role string `json:"role"`
}

type GameStateChangeMessage struct {
	State string `json:"state"`
}

type PlayerPositionMessage struct {
	Lat  float64 `json:"lat"`
	Long float64 `json:"long"`
}

type IncomingPlayerActionMessage struct {
	Action PlayerAction    `json:"action"`
	Data   json.RawMessage `json:"data,omitempty"`
}

type OutgoingPlayerActionMessage struct {
	Action PlayerAction `json:"action"`
	Data   any          `json:"data,omitempty"`
}

type PlayerListUpdateMessage struct {
	Players []*Player `json:"players"`
}

type PlayerJoinedMessage struct {
	PlayerId string `json:"playerId"`
}

type PlayerLeftMessage struct {
	PlayerId string `json:"playerId"`
}

type OutgoingHidingPhaseStart struct {
	Duration int `json:"duration"` // seconds until hiding phase ends
}
