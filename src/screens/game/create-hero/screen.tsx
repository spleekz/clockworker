import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { FC } from 'basic-utility-types'

import { useStore } from 'stores/root-store/context'

import { useKey } from 'hooks/use-key'

import { colors } from 'lib/theme'

import { QuitInMainMenuConfirm } from 'components/game-popups/quit-in-main-menu-confirm'
import { PixelatedButton } from 'components/pixelated/pixelated-components'

import { useGameStore } from '../game'
import { CreateHeroForm } from './form'

export const CreateHeroScreen: FC = observer(() => {
  const { appStore } = useStore()
  const gameStore = useGameStore()

  useKey({
    key: 'Escape',
    fn: () => {
      if (!gameStore.opening.isOpening) {
        appStore.toggleQuitInMainMenuConfirm()
      }
    },
  })

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
  backgroundColor: colors.primary,
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
  color: ${colors.secondary};
`
const Body = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
`
