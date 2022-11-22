import { observer } from 'mobx-react-lite'
import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { animated, useTransition } from '@react-spring/web'
import { FC } from 'basic-utility-types'

import { useWindowClick } from 'hooks/use-window-click'

import { colors, theme } from 'lib/theme'

import { AutoPrintedText } from 'components/auto-printed-text/auto-printed-text'
import { PixelatedButton } from 'components/pixelated/pixelated-components'
import { useGamePlayStore } from 'screens/game/play/screen'

import { CrossIcon } from 'assets/icons/cross'

type Props = {
  text: string
  isOpened: boolean
}

export const Textbox: FC<Props> = observer(({ isOpened, text }) => {
  const gamePlayStore = useGamePlayStore()

  const close = (): void => {
    gamePlayStore.textboxController.closeCurrentTextbox()
  }

  const [isTextboxEnteringEnds, setIsTextboxEnteringEnds] = useState(false)
  const transition = useTransition(isOpened, {
    from: { bottom: -20, scale: 0 },
    enter: { bottom: 15, scale: 1 },
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
                  <AutoPrintedText
                    text={text}
                    printPrevented={!isTextboxEnteringEnds}
                    onPrintEnds={onTextboxPrintEnds}
                  />
                }
                {/* Показывать крестик только после того, как текст напечатался */}
                {!isTextboxAutoPrint && (
                  <CloseButton onClick={close}>
                    <CrossIcon size={17.5} />
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
  backgroundColor: colors.mainMedium,
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
const Box = styled.div`
  position: relative;
  max-width: 680px;
  padding: 18px 60px 18px 18px;
  font-size: 24px;
  background-color: ${colors.mainLight};
  border-radius: ${theme.borderRadius}px;
`
