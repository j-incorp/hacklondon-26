package game

import (
	"encoding/json"
	"errors"
	"log/slog"
	"math"
)

var (
	ErrNoImage = errors.New("no image attached")
)

type QuestionType string

const (
	QuestionTypeRadar    QuestionType = "RADAR"
	QuestionTypePicture  QuestionType = "PICTURE"
	QuestionTypeMatching QuestionType = "MATCHING"
)

// A question request from the seeker client
type IncomingQuestionRequest struct {
	Type           QuestionType    `json:"type"`
	PlayerPosition Position        `json:"position"`
	Data           json.RawMessage `json:"data,omitempty"`
}

// An outgoing question request to send to the hider client
type OutgoingQuestionRequest struct {
	Type QuestionType `json:"type"`
	Data any          `json:"data,omitempty"`
}

// A question response from the hider client
type IncomingQuestionResponse struct {
	Type QuestionType    `json:"type"`
	Data json.RawMessage `json:"data,omitempty"`
}

// A question response to send to the seeker client
type OutgoingQuestionResponse struct {
	Type QuestionType `json:"type"`
	Data any          `json:"data,omitempty"`
}

type RadarQuestion struct {
	Radius int `json:"radius"` // in meters
}

type RadarResponse struct {
	Radius int  `json:"radius"` // in meters
	Hit    bool `json:"hit"`
}

// Handle incoming question requests from the seeker client
func (q IncomingQuestionRequest) Ask(lobby *Lobby, asker *Player, answerer *Player) error {
	switch q.Type {
	case QuestionTypeRadar:
		var radarQ RadarQuestion
		err := json.Unmarshal(q.Data, &radarQ)
		if err != nil {
			slog.Warn("Failed to unmarshal radar question data", "askerId", asker.Id, "error", err)
			return err
		}
		distance := latLongDistance(q.PlayerPosition, answerer.Position)
		hit := distance <= float64(radarQ.Radius)
		slog.Debug("Radar question asked", "askerId", asker.Id, "answererId", answerer.Id, "radius", radarQ.Radius, "distance", distance, "hit", hit)
		// Send answer to the seeker instantly
		response := OutgoingQuestionResponse{
			Type: QuestionTypeRadar,
			Data: RadarResponse{
				Radius: radarQ.Radius,
				Hit:    hit,
			},
		}
		respBytes, _ := json.Marshal(OutgoingMessage{Type: MessageTypePlayerAction, Data: OutgoingPlayerActionMessage{Action: PlayerActionAnswerQuestion, Data: response}})
		lobby.broadcast(respBytes)
	case QuestionTypePicture:
		var picQ PictureQuestion
		err := json.Unmarshal(q.Data, &picQ)
		if err != nil {
			slog.Warn("Failed to unmarshal picture question data", "askerId", asker.Id, "error", err)
			return err
		}
		// Prompt the hider client to upload a picture
		req := OutgoingQuestionRequest{
			Type: QuestionTypePicture,
			Data: picQ,
		}
		reqBytes, _ := json.Marshal(OutgoingMessage{Type: MessageTypePlayerAction, Data: OutgoingPlayerActionMessage{Action: PlayerActionAskQuestion, Data: req}})
		err = lobby.sendToPlayer(answerer.Id, reqBytes)
		if err != nil {
			slog.Error("Failed to send picture question request to answerer", "answererId", answerer.Id, "error", err)
			return err
		}
	case QuestionTypeMatching:
		var matchingQ MatchingQuestion
		err := json.Unmarshal(q.Data, &matchingQ)
		if err != nil {
			slog.Warn("Failed to unmarshal matching question data", "askerId", asker.Id, "error", err)
			return err
		}
		// Handle matching response automatically
		var hit bool
		switch matchingQ.MatchingType {
		case MatchingTypeNearestTubeLine:
			hit = false
		case MatchingTypeNearestHospital:
			hit = false
		case MatchingTypeNearestAirport:
			hit = false
		default:
			slog.Warn("Received unknown matching question type", "matchingType", matchingQ.MatchingType, "askerId", asker.Id)
			return errors.New("unknown matching question type")
		}
		resp, _ := json.Marshal(OutgoingMessage{Type: MessageTypePlayerAction, Data: OutgoingPlayerActionMessage{Action: PlayerActionAnswerQuestion, Data: OutgoingQuestionResponse{Type: QuestionTypeMatching, Data: MatchingResponse{MatchingType: matchingQ.MatchingType, Hit: hit}}}})
		err = lobby.sendToPlayer(answerer.Id, resp)
	default:
		slog.Warn("Received unknown question type", "questionType", q.Type, "askerId", asker.Id)
		return errors.New("unknown question type")
	}
	return nil
}

// For questions where the hider client has to provide an answer, forward the answer to the seeker
// client.
func (q IncomingQuestionResponse) Answer(lobby *Lobby, answerer *Player, asker *Player) error {
	switch q.Type {
	case QuestionTypePicture:
		// Forward the picture response to the seeker client
		var picData any
		err := json.Unmarshal(q.Data, &picData)
		if err != nil {
			slog.Warn("Failed to unmarshal picture question response data", "answererId", answerer.Id, "error", err)
			return err
		}
		response := OutgoingQuestionResponse{
			Type: QuestionTypePicture,
			Data: picData,
		}
		respBytes, _ := json.Marshal(OutgoingMessage{Type: MessageTypePlayerAction, Data: OutgoingPlayerActionMessage{Action: PlayerActionAnswerQuestion, Data: response}})
		err = lobby.sendToPlayer(asker.Id, respBytes)
		if err != nil {
			slog.Error("Failed to send picture question response to asker", "askerId", asker.Id, "error", err)
			return err
		}
	default:
		slog.Warn("Received unknown question response type", "questionType", q.Type, "answererId", answerer.Id)
		return errors.New("unknown question response type")
	}
	return nil
}

// Get the distance between two lat/long points in meters.
func latLongDistance(pos1 Position, pos2 Position) float64 {
	const R = 6371000 // Earth radius in meters
	lat1Rad := pos1.Lat * math.Pi / 180
	lat2Rad := pos2.Lat * math.Pi / 180
	lon1Rad := pos1.Long * math.Pi / 180
	lon2Rad := pos2.Long * math.Pi / 180

	x := (lon2Rad - lon1Rad) * math.Cos((lat1Rad+lat2Rad)/2)
	y := lat2Rad - lat1Rad

	return math.Sqrt(x*x+y*y) * R
}

type PictureType string

const (
	PictureTypeTallestBuilding PictureType = "tallest building"
	PictureTypeNearestWater    PictureType = "nearest large body of water"
	PictureTypePavement        PictureType = "pavement"
)

type PictureQuestion struct {
	PictureType PictureType `json:"type"`
}

type PictureResponse struct {
	PictureURL string `json:"pictureUrl"`
}

type MatchingType string

const (
	MatchingTypeNearestTubeLine MatchingType = "nearest tube line"
	MatchingTypeNearestHospital MatchingType = "nearest hospital"
	MatchingTypeNearestAirport  MatchingType = "nearest airport"
)

type MatchingQuestion struct {
	MatchingType MatchingType `json:"type"`
}

type MatchingResponse struct {
	MatchingType MatchingType `json:"type"`
	Hit          bool         `json:"hit"`
}
