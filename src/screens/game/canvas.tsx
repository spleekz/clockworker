import { observer } from 'mobx-react-lite'
import React, { useEffect, useRef } from 'react'

import { FC } from 'basic-utility-types'
import { Canvas } from 'game-utility-types'

import { useGameStore } from './screen'

export const GameCanvas: FC = observer(() => {
  const gameStore = useGameStore()
  const canvasRef = useRef<Canvas | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      gameStore.initializeCanvas(canvasRef.current)
    }
  }, [])

  return <canvas ref={canvasRef}></canvas>
})
