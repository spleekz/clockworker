import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { animated, useTransition } from '@react-spring/web'
import { EmptyFunction, FC } from 'basic-utility-types'

type Props = {
  isAnimation: boolean
  onAnimationEnd: EmptyFunction
}

export const AnimationBeforeGameOpening: FC<Props> = observer(({ isAnimation, onAnimationEnd }) => {
  const transition = useTransition(isAnimation, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    config: {
      duration: 1500,
    },
    onRest: () => {
      if (isAnimation) {
        onAnimationEnd()
      }
    },
  })

  return transition((styles, item) => {
    return item && <Container style={styles}></Container>
  })
})

const Container = styled(animated.div)`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background-color: #000000;
`
