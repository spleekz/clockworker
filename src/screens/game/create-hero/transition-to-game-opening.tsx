import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { animated, useTransition } from '@react-spring/web'
import { EmptyFunction, FC } from 'basic-utility-types'

import { useGameStore } from '../game'

type Props = {
  isTransition: boolean
  onTransitionEnd: EmptyFunction
}

export const TransitionToGameOpening: FC<Props> = observer(({ isTransition, onTransitionEnd }) => {
  const gameStore = useGameStore()

  const transition = useTransition(isTransition, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    config: {
      duration: gameStore.opening.transitionMs,
    },
    onRest: () => {
      if (isTransition) {
        onTransitionEnd()
      }
    },
  })

  return transition((styles, item) => {
    return item && <Container background={gameStore.opening.background} style={styles}></Container>
  })
})

const Container = styled(animated.div)<{ background: string }>`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background-color: ${(props) => props.background};
`
