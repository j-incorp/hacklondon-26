import { type ReactElement, useEffect, useState } from 'react'

const HidingOverlay = ({ endTime }: { endTime: Date }): ReactElement | null => {
  const [secondsLeft, setSecondsLeft] = useState(() => Math.max(0, Math.ceil((endTime.getTime() - Date.now()) / 1000)))

  useEffect(() => {
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((endTime.getTime() - Date.now()) / 1000))

      setSecondsLeft(remaining)
    }

    tick()

    const id = window.setInterval(tick, 1000)

    return () => window.clearInterval(id)
  }, [endTime])

  if (secondsLeft <= 0) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="text-center text-white">
        <p className="text-2xl font-semibold">Hiding Phase</p>
        <p className="text-8xl font-bold tabular-nums">
          {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:{String(secondsLeft % 60).padStart(2, '0')}
        </p>
      </div>
    </div>
  )
}

export { HidingOverlay }
