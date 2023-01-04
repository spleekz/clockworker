import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { FC } from 'basic-utility-types'

import { colors } from 'lib/theme'

import { PixelatedButton } from 'components/pixelated/pixelated-components'
import { Popup, PopupProps } from 'components/popup/popup-template'

export type SettingsMenuTemplateProps = Omit<
  PopupProps,
  'width' | 'height' | 'styles' | 'title' | 'titleStyles' | 'withCloseButton' | 'fnForClosing'
>

export const SettingsMenuTemplate: FC<SettingsMenuTemplateProps> = observer(
  ({ isOpened, onClose, children }) => {
    return (
      <Popup
        width={'600px'}
        height={'550px'}
        styles={{
          backgroundColor: colors.mainLight,
        }}
        title={'Настройки'}
        withCloseButton={false}
        isOpened={isOpened}
      >
        <Container>
          <List>{children}</List>
          <OKButtonContainer>
            <OKButton onClick={onClose}>ОК</OKButton>
          </OKButtonContainer>
        </Container>
      </Popup>
    )
  },
)

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
  backgroundColor: colors.mainMedium,
})`
  font-size: 30px;
  padding: 5px;
`
