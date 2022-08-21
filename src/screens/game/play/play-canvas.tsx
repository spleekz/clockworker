import { observer } from 'mobx-react-lite'
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

import { FC } from 'basic-utility-types'

import { Textbox } from 'components/textbox/textbox'

import { useGameStore } from '../game'
import { useGamePlayStore } from './screen'

export const PlayCanvas: FC = observer(() => {
  const gameStore = useGameStore()
  const gamePlayStore = useGamePlayStore()

  useEffect(() => {
    gamePlayStore.setupGame()
    gameStore.opening.show().then(() => {
      gamePlayStore.startGame()
    })
  }, [])

  const containerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (gamePlayStore.isGameLoaded && gamePlayStore.canvasObject.canvas && containerRef.current) {
      //"рендер" канваса, созданного в сторе
      containerRef.current.appendChild(gamePlayStore.canvasObject.canvas)
    }
  }, [gamePlayStore.isGameLoaded])

  return (
    <Container ref={containerRef}>
      <Textbox
        isOpened={gamePlayStore.isTextboxOpened}
        text={gamePlayStore.currentTextbox?.text ?? ''}
      />
    </Container>
  )
})

const Container = styled.div`
  position: relative;
  flex: 1 0 auto;
  display: flex;
`
