import { useStore } from '@tanstack/react-store'
import { type ReactElement, useCallback, useEffect, useState } from 'react'
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket'

import { useLocation } from '@/hooks/use-location'
import { useQuestions } from '@/hooks/use-questions'
import { Button } from '@/ui/button'

import { PictureAlert } from '../alert/picture-alert'
import { QuestionAlert } from '../alert/question-alert'
import { handStore } from '../cards/hand-store'
import { MainMap } from '../maps/main-map'
import { MapRadarMask } from '../maps/map-radar-mask'
import { Gallery } from '../tools/gallery'
import { Tools } from '../tools/tools'
import { gameStore } from './game-store'
import { HidingOverlay } from './hiding-overlay'
import { PlayerList } from './player-list'
import type { PictureQuestion, PlayerRole, QuestionRequest, QuestionResponse, RadarResponse } from './types'
import { message } from './types'

const formatDuration = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const Game = (): ReactElement => {
  const hStore = useStore(handStore, (state) => state)

  const store = useStore(gameStore, (state) => state)

  const [disconnected, setDisconnected] = useState(false)

  const [gameDuration, setGameDuration] = useState<string | null>(null)

  const [mapKids, setMapKids] = useState<ReactElement[]>([])

  const { location: playerLocation } = useLocation()

  const playerLat = playerLocation?.lat ?? 51.5074

  const playerLong = playerLocation?.long ?? -0.1278

  const [seekerLocation, setSeekerLocation] = useState<{ lat: number; long: number }>()

  const { addResponse } = useQuestions()

  const joinUrl = disconnected
    ? null
    : `${import.meta.env.VITE_WS_PREFIX}://${import.meta.env.VITE_API_URL}/lobby/${store.lobby.code}?name=${store.lobby.name}`

  const reconnectUrl = disconnected
    ? `${import.meta.env.VITE_WS_PREFIX}//${import.meta.env.VITE_API_URL}/lobby/${store.lobby.code}/reconnect?id=${store.playerId}`
    : null

  const handleMessage = useCallback(
    (event: MessageEvent<string>) => {
      const parsed = message.safeParse(JSON.parse(event.data))

      if (!parsed.success) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse incoming message', parsed.error)

        console.log(event.data)

        return
      }

      const msg = parsed.data

      switch (msg.type) {
        case 'PLAYER_INFO': {
          const { id, name, role } = msg.data

          // eslint-disable-next-line no-console
          console.log('Player info received', { id, name, role })
          gameStore.setState((prev) => ({ ...prev, playerId: id, role: role as PlayerRole }))

          break
        }

        case 'PLAYER_JOINED': {
          const { playerId } = msg.data

          // eslint-disable-next-line no-console
          console.log('Player joined', { playerId })

          break
        }

        case 'PLAYER_LEFT': {
          const { playerId } = msg.data

          // eslint-disable-next-line no-console
          console.log('Player left', { playerId })

          break
        }

        case 'GAME_STATE_CHANGE': {
          const { state } = msg.data

          // eslint-disable-next-line no-console
          console.log('Game state changed', { state })

          gameStore.setState((prev) => ({ ...prev, gameState: state }))

          break
        }

        case 'HIDING_PHASE_START': {
          const { duration } = msg.data

          // eslint-disable-next-line no-console
          console.log('Hiding phase started', { duration })

          gameStore.setState((prev) => ({
            ...prev,
            hidingPhaseEndTime: new Date(Date.now() + duration * 1000),
          }))

          break
        }

        case 'PLAYER_POSITION': {
          // Seekers position
          const { lat, long } = msg.data

          setSeekerLocation({ lat, long })
          // eslint-disable-next-line no-console
          console.log('Player position update', { lat, long })

          break
        }

        case 'PLAYER_ACTION': {
          const { action, data } = msg.data

          switch (action) {
            case 'ANSWER_QUESTION': {
              const response = data as QuestionResponse

              addResponse(response)

              switch (response.type) {
                case 'RADAR': {
                  const radarResponse = response.data as RadarResponse
                  const { radius } = radarResponse

                  const radar = MapRadarMask({
                    center: [playerLat, playerLong],
                    radius,
                    radarSuccess: radarResponse.hit,
                  })

                  setMapKids((prev) => [...prev, radar])

                  break
                }
              }
              break
            }
          }

          // eslint-disable-next-line no-console
          console.log('Player action received', { action, data })

          switch (action) {
            case 'ASK_QUESTION':
              const { type, data: qData } = data as QuestionRequest
              switch (type) {
                case 'RADAR':
                  break
                case 'PICTURE':
                  const pData = qData as PictureQuestion

                  gameStore.setState((prev) => ({
                    ...prev,
                    currentPictureQuestion: {
                      ...pData,
                    },
                  }))

                  break
                case 'MATCHING':
                  // eslint-disable-next-line no-console
                  console.log('Received question request', { type })

                  break
                default:
                  // eslint-disable-next-line no-console
                  console.warn('Received unknown question type', { type })
              }
              break
            case 'ANSWER_QUESTION':
              const { type: answerType, data: answerData } = data as QuestionResponse

              gameStore.setState((prev) => ({
                ...prev,
                currentQuestion: {
                  type: answerType,
                  data: answerData,
                },
              }))

              break
            case 'VETO_QUESTION':
              break
            case 'SEND_CURSE':
              break
            default:
              // eslint-disable-next-line no-console
              console.warn('Received unknown player action', { action, data })
          }

          break
        }

        case 'PLAYER_LIST_UPDATE': {
          const { players } = msg.data

          // eslint-disable-next-line no-console
          console.log('Player list updated', { players })

          if (players.find((p) => p.id === gameStore.state.playerId)) {
            // eslint-disable-next-line no-console
            console.log('Current player is in the updated player list')
            // Update the player's role
            gameStore.setState((prev) => ({
              ...prev,
              role: players.find((p) => p.id === prev.playerId)?.role || '',
            }))
          }

          gameStore.setState((prev) => ({
            ...prev,
            lobby: { ...prev.lobby, players },
          }))

          break
        }
      }
    },
    [playerLat, playerLong, addResponse],
  )

  const handleClose = useCallback(() => {
    if (gameStore.state.gameState !== 'WAITING_FOR_PLAYERS') {
      setDisconnected(true)
    }
  }, [])

  const handleOpen = useCallback(() => {
    setDisconnected(false)
  }, [])

  const { sendJsonMessage: joinSend } = useWebSocket(joinUrl, {
    onMessage: handleMessage,
    onClose: handleClose,
    onOpen: handleOpen,
  })

  const { sendJsonMessage: reconnectSend } = useWebSocket(reconnectUrl, {
    shouldReconnect: () => true,
    reconnectAttempts: Infinity,
    reconnectInterval: 5000,
    onMessage: handleMessage,
    onClose: handleClose,
    onOpen: handleOpen,
  })

  const sendJsonMessage = disconnected ? reconnectSend : joinSend

  useEffect(() => {
    gameStore.setState((prev) => ({ ...prev, sendJsonMessage }))
  }, [sendJsonMessage])

  useEffect(() => {
    if (!store.lobby.code) {
      return
    }

    if (!location) {
      return
    }

    const intervalId = window.setInterval(() => {
      sendJsonMessage({
        type: 'PLAYER_POSITION',
        data: {
          lat: playerLocation?.lat,
          long: playerLocation?.long,
        },
      })
    }, 10_000)

    return () => window.clearInterval(intervalId)
  }, [sendJsonMessage, store.lobby.code, playerLocation])

  const startGame = useCallback(async () => {
    await fetch(`http://${import.meta.env.VITE_API_URL}/lobby/${store.lobby.code}/start`, { method: 'POST' })
  }, [store.lobby.code])

  const endGame = useCallback(async () => {
    const res = await fetch(`http://${import.meta.env.VITE_API_URL}/lobby/${store.lobby.code}/end`, { method: 'POST' })
    if (res.ok) {
      const { duration } = (await res.json()) as { duration: number }

      let addTime = 0

      hStore.cards
        .filter((card) => card.type === 'time-bonus')
        .forEach((card) => {
          addTime += card.amount * 60
        })

      setGameDuration(formatDuration(duration + addTime))
    }
  }, [store.lobby.code, hStore])

  return (
    <div className="flex flex-col w-full h-full text-center justify-center items-center content-center">
      {store.gameState === 'HIDING' && <HidingOverlay endTime={store.hidingPhaseEndTime} />}
      {store.gameState === 'WAITING_FOR_PLAYERS' ? (
        <>
          <h1 className="text-4xl font-bold pt-24">Lobby {store.lobby.code}</h1>
          <PlayerList players={store.lobby.players} />
          {store.lobby.players?.length === 2 && (
            <Button className="" onClick={startGame} type="button">
              Start Game
            </Button>
          )}
        </>
      ) : (
        <div className="relative h-screen w-full">
          <PictureAlert
            question={store.currentPictureQuestion}
            onCapture={async (file: File) => {
              const { type, size } = file
              const url = await fetch(`http://${import.meta.env.VITE_API_URL}/upload`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  filetype: type,
                  size,
                }),
              })

              const resp = await url.json()
              const { url: uploadUrl, key } = resp as { url: string; key: string }

              await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                  'Content-Type': type,
                },
                body: file,
              })

              sendJsonMessage({
                type: 'PLAYER_ACTION',
                data: {
                  action: 'ANSWER_QUESTION',
                  data: {
                    type: 'PICTURE',
                    data: {
                      pictureUrl: 'd1bxoywow59vkr.cloudfront.net/' + key,
                    },
                  },
                },
              })
            }}
          />
          <QuestionAlert question={store.currentQuestion}></QuestionAlert>
          <MainMap
            lat={playerLat}
            lng={playerLong}
            seekerLat={seekerLocation?.lat}
            seekerLng={seekerLocation?.long}
            zoom={8}
          >
            {mapKids.map((kid, index) => (
              <div key={index}>{kid}</div>
            ))}
          </MainMap>
          <p className="pointer-events-none absolute left-0 top-0 w-full bg-black/50 p-3 text-center text-lg font-semibold text-white mt-2">
            You are the <span className="uppercase">{store.role}</span>
          </p>
          {store.role === 'HIDER' &&
            (store.gameState === 'HIDING' || store.gameState === 'SEEKING') &&
            !gameDuration && (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50">
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 text-lg"
                  onClick={endGame}
                  type="button"
                >
                  I have been found
                </Button>
              </div>
            )}
          {gameDuration && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-black/70 text-white rounded-lg px-6 py-4 text-center">
              <p className="text-lg font-semibold">You were found! It took...</p>
              <p className="text-3xl font-bold mt-1">{gameDuration}</p>
            </div>
          )}
          <div className="absolute bottom-4 right-4 z-40">
            <Tools type={store.role} />
          </div>
          {store.role === 'SEEKER' ? (
            <div className="absolute bottom-4 left-4 z-40">
              <Gallery />
            </div>
          ) : undefined}
        </div>
      )}
    </div>
  )
}

export { Game }
