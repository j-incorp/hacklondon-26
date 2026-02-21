package game

import (
	"encoding/json"
	"errors"
	"log/slog"
)

// CurseType identifies which curse the seeker is inflicting on the hider.
type CurseType string

const (
	CurseTypeOrange = "ORANGE" // Obscures part of the hider's screen
)

// IncomingCurseRequest is the message the seeker client sends to cast a curse.
type IncomingCurseRequest struct {
	Type CurseType `json:"type"`
}

// OutgoingCurseNotification is the message forwarded to the hider client.
type OutgoingCurseNotification struct {
	Type CurseType `json:"type"`
}

// SendCurse validates the curse and forwards it from the seeker to the hider.
func (c IncomingCurseRequest) SendCurse(lobby *Lobby, seeker *Player, hider *Player) error {
	if !isValidCurse(c.Type) {
		slog.Warn("Received unknown curse type", "curseType", c.Type, "seekerId", seeker.Id)
		return errors.New("unknown curse type")
	}

	slog.Debug("Hider sending curse to Seeker", "curseType", c.Type, "seekerId", seeker.Id, "hiderId", hider.Id)

	notification := OutgoingCurseNotification{
		Type: c.Type,
	}

	msg, _ := json.Marshal(OutgoingMessage{
		Type: MessageTypePlayerAction,
		Data: OutgoingPlayerActionMessage{
			Action: PlayerActionSendCurse,
			Data:   notification,
		},
	})

	err := lobby.sendToPlayer(hider.Id, msg)
	if err != nil {
		slog.Error("Failed to send curse to seeker", "seekerId", seeker.Id, "error", err)
		return err
	}

	return nil
}

func isValidCurse(ct CurseType) bool {
	switch ct {
	case CurseTypeOrange:
		return true
	}
	return false
}
