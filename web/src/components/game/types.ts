import * as z from 'zod'

// ── Enums ──────────────────────────────────────────────────────────────

const messageType = z.enum([
  'PLAYER_INFO',
  'PLAYER_JOINED',
  'PLAYER_LEFT',
  'GAME_STATE_CHANGE',
  'HIDING_PHASE_START',
  'PLAYER_POSITION',
  'PLAYER_ACTION',
  'PLAYER_LIST_UPDATE',
])

const playerRole = z.enum(['HIDER', 'SEEKER', ''])

const gameState = z.enum(['WAITING_FOR_PLAYERS', 'HIDING', 'SEEKING', 'FINISHED'])

const playerAction = z.enum(['ASK_QUESTION', 'ANSWER_QUESTION', 'VETO_QUESTION', 'SEND_CURSE'])

const questionType = z.enum(['RADAR', 'PICTURE', 'MATCHING'])

const pictureType = z.enum([
  'five-buildings',
  'tallest-building',
  'train-station',
  'body-of-water',
  'sky',
  'street-sign',
  'clock',
  'bus-route-number',
  'street-art',
  'church',
  'strava-map',
  'monument-shadow',
])

const matchingType = z.enum(['tube-line', 'london-borough'])

const curseType = z.enum(['ORANGE'])

// ── Shared schemas ─────────────────────────────────────────────────────

const position = z.object({
  lat: z.number(),
  long: z.number(),
})

const player = z.object({
  id: z.string(),
  name: z.string(),
  role: playerRole,
  position: position,
})

// ── Lobby / Game bootstrapping ─────────────────────────────────────────

const lobby = z.object({
  code: z.string(),
  name: z.string(),
  players: z.array(player),
})

// ── Outgoing message data payloads ─────────────────────────────────────

const playerInfoMessage = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
})

const playerJoinedMessage = z.object({
  playerId: z.string(),
})

const playerLeftMessage = z.object({
  playerId: z.string(),
})

const gameStateChangeMessage = z.object({
  state: gameState,
})

const hidingPhaseStartMessage = z.object({
  duration: z.number(), // seconds until hiding phase ends
})

const playerPositionMessage = z.object({
  lat: z.number(),
  long: z.number(),
})

const playerListUpdateMessage = z.object({
  players: z.array(player),
})

// ── Question / answer payloads ─────────────────────────────────────────

const radarQuestion = z.object({
  radius: z.number(), // in meters
})

const radarResponse = z.object({
  radius: z.number(),
  hit: z.boolean(),
})

const pictureQuestion = z.object({
  type: pictureType,
})

const pictureResponse = z.object({
  pictureUrl: z.string(),
})

const matchingQuestion = z.object({
  type: matchingType,
})

const matchingResponse = z.object({
  type: matchingType,
  hit: z.boolean(),
})

const questionResponse = z.object({
  type: questionType,
  data: z.union([radarResponse, pictureResponse, matchingResponse]).optional(),
})

// ── Curse payloads ─────────────────────────────────────────────────────

const curseNotification = z.object({
  type: curseType,
})

// ── Outgoing player action wrapper ─────────────────────────────────────

const questionRequest = z.object({
  type: questionType,
  position: position,
  data: z.union([radarQuestion, pictureQuestion, matchingQuestion]).optional(),
})

const playerActionMessage = z.object({
  action: playerAction,
  data: z.union([questionRequest, questionResponse, curseNotification]).optional(),
})

const game = z.object({
  playerId: z.string(),
  role: playerRole,
  gameState: gameState,
  currentQuestion: questionResponse.optional(),
  currentPictureQuestion: pictureQuestion.optional(),
  hidingPhaseEndTime: z.date(),
  lobby: lobby,
})

// ── Top-level outgoing message (discriminated by `type`) ───────────────

const message = z.discriminatedUnion('type', [
  z.object({ type: z.literal('PLAYER_INFO'), data: playerInfoMessage }),
  z.object({ type: z.literal('PLAYER_JOINED'), data: playerJoinedMessage }),
  z.object({ type: z.literal('PLAYER_LEFT'), data: playerLeftMessage }),
  z.object({ type: z.literal('GAME_STATE_CHANGE'), data: gameStateChangeMessage }),
  z.object({ type: z.literal('HIDING_PHASE_START'), data: hidingPhaseStartMessage }),
  z.object({ type: z.literal('PLAYER_POSITION'), data: playerPositionMessage }),
  z.object({ type: z.literal('PLAYER_ACTION'), data: playerActionMessage }),
  z.object({ type: z.literal('PLAYER_LIST_UPDATE'), data: playerListUpdateMessage }),
])

// ── Inferred types ─────────────────────────────────────────────────────

type Lobby = z.infer<typeof lobby>
type Game = z.infer<typeof game>
type MessageType = z.infer<typeof messageType>
type PlayerRole = z.infer<typeof playerRole>
type GameState = z.infer<typeof gameState>
type PlayerAction = z.infer<typeof playerAction>
type QuestionType = z.infer<typeof questionType>
type PictureType = z.infer<typeof pictureType>
type MatchingType = z.infer<typeof matchingType>
type CurseType = z.infer<typeof curseType>
type Position = z.infer<typeof position>
type Player = z.infer<typeof player>
type PlayerInfoMessage = z.infer<typeof playerInfoMessage>
type PlayerJoinedMessage = z.infer<typeof playerJoinedMessage>
type PlayerLeftMessage = z.infer<typeof playerLeftMessage>
type GameStateChangeMessage = z.infer<typeof gameStateChangeMessage>
type HidingPhaseStartMessage = z.infer<typeof hidingPhaseStartMessage>
type PlayerPositionMessage = z.infer<typeof playerPositionMessage>
type PlayerListUpdateMessage = z.infer<typeof playerListUpdateMessage>
type RadarQuestion = z.infer<typeof radarQuestion>
type RadarResponse = z.infer<typeof radarResponse>
type PictureQuestion = z.infer<typeof pictureQuestion>
type PictureResponse = z.infer<typeof pictureResponse>
type MatchingQuestion = z.infer<typeof matchingQuestion>
type MatchingResponse = z.infer<typeof matchingResponse>
type QuestionRequest = z.infer<typeof questionRequest>
type QuestionResponse = z.infer<typeof questionResponse>
type CurseNotification = z.infer<typeof curseNotification>
type PlayerActionMessage = z.infer<typeof playerActionMessage>
type Message = z.infer<typeof message>

// ── Exports ────────────────────────────────────────────────────────────

export type {
  CurseNotification,
  CurseType,
  Game,
  GameState,
  GameStateChangeMessage,
  HidingPhaseStartMessage,
  Lobby,
  MatchingQuestion,
  MatchingResponse,
  MatchingType,
  Message,
  MessageType,
  PictureQuestion,
  PictureResponse,
  PictureType,
  Player,
  PlayerAction,
  PlayerActionMessage,
  PlayerInfoMessage,
  PlayerJoinedMessage,
  PlayerLeftMessage,
  PlayerListUpdateMessage,
  PlayerPositionMessage,
  PlayerRole,
  Position,
  QuestionRequest,
  QuestionResponse,
  QuestionType,
  RadarQuestion,
  RadarResponse,
}

export {
  curseNotification,
  curseType,
  game,
  gameState,
  gameStateChangeMessage,
  hidingPhaseStartMessage,
  lobby,
  matchingQuestion,
  matchingResponse,
  matchingType,
  message,
  messageType,
  pictureQuestion,
  pictureResponse,
  pictureType,
  player,
  playerAction,
  playerActionMessage,
  playerInfoMessage,
  playerJoinedMessage,
  playerLeftMessage,
  playerListUpdateMessage,
  playerPositionMessage,
  playerRole,
  position,
  questionRequest,
  questionResponse,
  questionType,
  radarQuestion,
  radarResponse,
}
