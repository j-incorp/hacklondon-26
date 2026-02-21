package game

import "github.com/google/uuid"

type Player struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

func NewPlayer(name string) *Player {
	return &Player{Id: uuid.New().String(), Name: name}
}
