import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { FC } from 'basic-utility-types'

import { useStore } from 'stores/root-store/context'

import { colors } from 'lib/theme'

import { QuitInMainMenuConfirm } from 'components/game-popups/quit-in-main-menu-confirm'
import { PixelatedButton } from 'components/pixelated/pixelated-components'

import { CreateHeroForm } from './form'
import { handleCreateHeroScreenEsc } from './handle-esc'

export const CreateHeroScreen: FC = observer(() => {
  const { appStore } = useStore()

  handleCreateHeroScreenEsc()

  const goBack = (): void => {
    appStore.setScreen('main')
  }

  return (
    <Container>
      <QuitInMainMenuConfirm
        isOpened={appStore.isQuitInMainMenuConfirmOpened}
        question={'Вернуться в главное меню?'}
      />

      <Title>Создайте персонажа</Title>
      <Body>
        <BackButton onClick={goBack}>Назад</BackButton>
        <CreateHeroForm />
      </Body>
    </Container>
  )
})

const Container = styled.div`
  position: relative;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  padding: 25px;
`
const BackButton = styled(PixelatedButton).attrs({
  pixelsSize: 'medium',
  backgroundColor: colors.mainLight,
})`
  position: absolute;
  bottom: 10px;
  left: 19px;
  padding: 5px;
  font-size: 24px;
`
const Title = styled.div`
  font-size: 50px;
  text-align: center;
  margin-top: 35px;
  color: ${colors.mainMedium};
`
const Body = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
`
