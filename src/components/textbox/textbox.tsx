import { observer } from 'mobx-react-lite'
import React, { useEffect, useRef, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'

import { FC } from 'basic-utility-types'
import { doubleBorderStyle } from 'shared-styles'

import { useWindowClick } from 'hooks/use-window-click'

import { colors } from 'lib/theme'

import { AutoPrintedText } from 'components/auto-printed-text/auto-printed-text'
import { PixelatedButton } from 'components/pixelated/pixelated-components'
import { useGamePlayStore } from 'screens/game/play/screen'

import { CrossIcon } from 'assets/icons/cross'

type AutoprintStatus = 'none' | 'inProgress' | 'end'

type Props = {
  text: string
  isOpened: boolean
}
export const Textbox: FC<Props> = observer(({ isOpened, text }) => {
  const gamePlayStore = useGamePlayStore()

  const [autoprintStatus, setAutoprintStatus] = useState<AutoprintStatus>('none')

  const [isOpeningAnimationSkipped, setIsOpeningAnimationSkipped] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onAnimationEnd = (): void => {
      setAutoprintStatus('inProgress')
    }
    if (containerRef.current) {
      containerRef.current.addEventListener('animationend', onAnimationEnd)
    }
    return () => containerRef.current?.removeEventListener('animationend', onAnimationEnd)
  }, [containerRef.current])

  const [isAutoprintSkipped, setIsAutoprintSkipped] = useState(false)

  const onAutoprintEnd = (): void => {
    setAutoprintStatus('end')
  }

  const close = (): void => {
    gamePlayStore.textboxesController.closeCurrentTextbox()
  }

  useWindowClick(() => {
    if (isOpened) {
      if (autoprintStatus === 'none') {
        setIsOpeningAnimationSkipped(true)
      }
      if (autoprintStatus === 'inProgress') {
        setIsAutoprintSkipped(true)
      }
      if (autoprintStatus === 'end') {
        close()
      }
    }
  })

  useEffect(() => {
    setAutoprintStatus('none')
    setIsOpeningAnimationSkipped(false)
    setIsAutoprintSkipped(false)
  }, [isOpened])

  return (
    <Wrapper>
      <Container
        ref={containerRef}
        isOpened={isOpened}
        isOpeningAnimationSkipped={isOpeningAnimationSkipped}
      >
        {isOpened && (
          <Box>
            {autoprintStatus !== 'none' ? (
              <AutoPrintedText
                text={text}
                onPrintEnd={onAutoprintEnd}
                isPrintSkipped={isAutoprintSkipped}
              />
            ) : (
              <InvisibleText>{text}</InvisibleText>
            )}
            {autoprintStatus === 'end' && (
              <CloseButton onClick={close}>
                <CrossIcon size={17.5} />
              </CloseButton>
            )}
          </Box>
        )}
      </Container>
    </Wrapper>
  )
})

const Wrapper = styled.div`
  width: 100%;
`
const textboxOpening = keyframes`
  from {
    bottom:-20px;
    transform:scale(0)
  }
  to {
    bottom:15px;
    transform:scale(1)
  }
`
const Container = styled.div<{ isOpened: boolean; isOpeningAnimationSkipped: boolean }>`
  width: 100%;
  position: absolute;
  z-index: 999;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  margin: 0 auto;
  pointer-events: ${(props) => (props.isOpened ? 'all' : 'none')};
  animation: ${(props) =>
    props.isOpened &&
    css`
      ${textboxOpening} ${props.isOpeningAnimationSkipped ? 0 : 230}ms forwards
    `};
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
  ${doubleBorderStyle}
`
const InvisibleText = styled.div`
  opacity: 0;
`
