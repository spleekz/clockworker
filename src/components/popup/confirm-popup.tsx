import { observer } from 'mobx-react-lite'
import React, { CSSProperties } from 'react'
import styled from 'styled-components'

import { EmptyFunction, FC, RequiredBy } from 'basic-utility-types'

import { PixelatedButton } from 'components/pixelated/pixelated-components'

import { Popup, PopupTemplateProps } from './popup-template'

type ConfirmPopupProps = {
  question: string
  questionStyles?: CSSProperties
  acceptText: string
  onAccept: EmptyFunction
  rejectText: string
  onReject: EmptyFunction
  buttonsStyles: RequiredBy<CSSProperties, 'backgroundColor'>
}

type Props = Omit<PopupTemplateProps, 'withCloseButton'> & ConfirmPopupProps

export const ConfirmPopup: FC<Props> = observer(
  ({
    width,
    height,
    styles,
    title,
    isOpened,
    fnForClosing,
    question,
    questionStyles,
    acceptText,
    onAccept,
    rejectText,
    onReject,
    buttonsStyles,
  }) => {
    const { backgroundColor, ...buttonsStylesWithoutBackgroundColor } = buttonsStyles

    return (
      <Popup
        width={width}
        height={height}
        styles={styles}
        title={title}
        withCloseButton={false}
        isOpened={isOpened}
        fnForClosing={fnForClosing}
      >
        <Container>
          <Question style={questionStyles}>{question}</Question>
          <Buttons>
            <Button
              onClick={onAccept}
              style={buttonsStylesWithoutBackgroundColor}
              backgroundColor={backgroundColor}
            >
              {acceptText}
            </Button>
            <Button
              onClick={onReject}
              style={buttonsStylesWithoutBackgroundColor}
              backgroundColor={backgroundColor}
            >
              {rejectText}
            </Button>
          </Buttons>
        </Container>
      </Popup>
    )
  },
)

const Container = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const Question = styled.div`
  text-align: center;
  font-size: 36px;
`
const Buttons = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
`
const Button = styled(PixelatedButton).attrs({
  pixelsSize: 'medium',
})`
  font-size: 32px;
`
