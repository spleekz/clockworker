import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { animated, useSpring } from '@react-spring/web'
import { FC } from 'basic-utility-types'

import { colors } from 'lib/theme'

import { useGameStore } from './screen'

type Props = {
  isOpened: boolean
}

export const GameOpening: FC<Props> = observer(({ isOpened }) => {
  const gameStore = useGameStore()

  const containerStyles = useSpring({
    from: { opacity: 1 },
    to: { opacity: 0 },
    delay: gameStore.openingDurationMs,
    cancel: !isOpened,
    config: {
      duration: gameStore.openingFadeAnimationMs,
    },
  })

  const contentStyles = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 300,
    cancel: !isOpened,
    config: {
      duration: 1700,
    },
  })

  return (
    <>
      {isOpened && (
        <Container style={containerStyles}>
          <Content style={contentStyles}>clockworker</Content>
        </Container>
      )}
    </>
  )
})

const Container = styled(animated.div)`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background-color: #000000;

  display: flex;
  justify-content: center;
  align-items: center;
`
const Content = styled(animated.div)`
  font-size: 110px;
  color: ${colors.secondary};
`
