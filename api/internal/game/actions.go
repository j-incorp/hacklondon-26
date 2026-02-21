package game

type PlayerAction string

const (
	PlayerActionAskQuestion    = "ASK_QUESTION"
	PlayerActionAnswerQuestion = "ANSWER_QUESTION"
	PlayerActionVetoQuestion   = "VETO_QUESTION"
)
