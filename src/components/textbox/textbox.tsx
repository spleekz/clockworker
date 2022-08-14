import { observer } from 'mobx-react-lite'
import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { animated, useTransition } from '@react-spring/web'
import { EmptyFunction, FC } from 'basic-utility-types'

import { useWindowClick } from 'hooks/use-window-click'

import { colors } from 'lib/theme'

import { AutoPrint } from 'components/auto-print/auto-print'
import { PixelatedButton } from 'components/pixelated/pixelated-components'
import { useGameStore } from 'screens/game/screen'

import cross from 'assets/icons/cross.png'

type Props = {
  isOpened: boolean
  afterClose?: EmptyFunction
  withCloseCross: boolean
  text: string
}

export const Textbox: FC<Props> = observer(({ isOpened, afterClose, withCloseCross, text }) => {
  const gameStore = useGameStore()

  const close = (): void => {
    gameStore.closeTextbox()
    afterClose?.()
  }

  const [isTextboxEnteringEnds, setIsTextboxEnteringEnds] = useState(false)
  const transition = useTransition(isOpened, {
    from: { bottom: -20, scale: 0 },
    enter: { bottom: 15, scale: 1 },
    leave: { bottom: -20, scale: 0 },
    config: {
      duration: 230,
    },
    onRest: () => {
      //Установить значение только в момент окончания анимации появления
      if (isTextboxEnteringEnds === false) {
        setIsTextboxEnteringEnds(true)
      }
    },
  })

  const [isTextboxAutoPrint, setIsTextboxAutoPrint] = useState(true)

  const onTextboxPrintEnds = useCallback(() => {
    setIsTextboxAutoPrint(false)
  }, [])

  const containerRef = useRef<HTMLDivElement | null>(null)
  useWindowClick(() => {
    //Игнорировать клики после закрытия текстбокса
    if (!isTextboxAutoPrint && isOpened) {
      close()
    }
  })

  return (
    <>
      {transition(
        (styles, item) =>
          item && (
            <Container ref={containerRef} style={styles}>
              <Box>
                {
                  <AutoPrint
                    text={text}
                    printPrevented={!isTextboxEnteringEnds}
                    onPrintEnds={onTextboxPrintEnds}
                  />
                }
                {/* Показывать крестик только после того, как текст напечатался */}
                {withCloseCross && !isTextboxAutoPrint && (
                  <CloseButton onClick={close}>
                    <CloseCross />
                  </CloseButton>
                )}
              </Box>
            </Container>
          ),
      )}
    </>
  )
})

const Container = styled(animated.div)`
  position: absolute;
  z-index: 999;
  width: 100%;
  display: flex;
  justify-content: center;
  bottom: 15px;
  left: 0;
  right: 0;
  margin: 0 auto;
`
const CloseButton = styled(PixelatedButton).attrs({
  pixelsSize: 'small',
  backgroundColor: colors.secondary,
})`
  position: absolute;
  top: 15.5px;
  right: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 21px;
  height: 33px;
`
const CloseCross = styled.div`
  width: 17.5px;
  height: 17.5px;
  background-image: url(${cross});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`
const Box = styled.div`
  position: relative;
  max-width: 680px;
  padding: 18px 60px 18px 18px;
  font-size: 24px;
  background-color: ${colors.primary};
  border-radius: 16px;
`
