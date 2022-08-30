import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { Callback, FC } from 'basic-utility-types'

import { colors } from 'lib/theme'

import { PixelatedButton } from 'components/pixelated/pixelated-components'
import { Popup } from 'components/popup/popup-template'

import { ControllersSettingsSection } from './sections/controllers'

type Props = {
  isOpened: boolean
  onClose: Callback
  afterClose?: Callback
}

export const GameSettingsMenu: FC<Props> = observer(({ isOpened, onClose, afterClose }) => {
  return (
    <Popup
      width={'600px'}
      height={'550px'}
      styles={{
        backgroundColor: colors.primary,
      }}
      title={'Настройки'}
      withCloseButton={false}
      isOpened={isOpened}
      fnForClosing={onClose}
      afterClose={afterClose}
    >
      <Container>
        <List>
          <ControllersSettingsSection />
        </List>
        <OKButtonContainer>
          <OKButton onClick={onClose}>ОК</OKButton>
        </OKButtonContainer>
      </Container>
    </Popup>
  )
})

const Container = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`
const List = styled.ul`
  flex: 1 0 auto;
`
const OKButtonContainer = styled.div`
  text-align: right;
`
const OKButton = styled(PixelatedButton).attrs({
  pixelsSize: 'medium',
  backgroundColor: colors.secondary,
})`
  font-size: 30px;
  padding: 5px;
`
