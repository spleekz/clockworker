import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { FC } from 'basic-utility-types'

import { useStore } from 'stores/root-store/context'

import { useKey } from 'hooks/use-key'

import { colors } from 'lib/theme'

import { PixelatedButton } from 'components/pixelated/pixelated-components'

import { SettingsMenu } from './settings/menu'

export const MainScreen: FC = observer(() => {
  const { appStore } = useStore()

  useKey({
    key: 'Escape',
    fn: () => {
      if (appStore.isSettingsMenuOpened) {
        appStore.closeSettingsMenu()
      } else {
        appStore.toggleQuitGameConfirm()
      }
    },
  })

  const goToCreatingHero = (): void => {
    appStore.setScreen('createHero')
  }

  return (
    <Container>
      <SettingsMenu isOpened={appStore.isSettingsMenuOpened} onClose={appStore.closeSettingsMenu} />

      <Title>clockworker</Title>
      <Body>
        <MainMenuButtons>
          <Button onClick={goToCreatingHero}>Новая игра</Button>
          <Button onClick={appStore.openSettingsMenu}>Настройки</Button>
        </MainMenuButtons>
      </Body>
      <QuitGameButton onClick={appStore.openQuitGameConfirm}>Выйти из игры</QuitGameButton>
    </Container>
  )
})

const Container = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 25px;
`
const Title = styled.div`
  font-size: 72px;
  color: ${colors.secondary};
`
const Body = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const MainMenuButtons = styled.menu`
  display: flex;
  flex-direction: column;
`
const Button = styled(PixelatedButton).attrs({
  pixelsSize: 'medium',
  backgroundColor: colors.primary,
})`
  font-size: 32px;
  padding: 22px 5px;
  margin-top: 20px;
  &:first-child {
    margin-top: 0;
  }
`
const QuitGameButton = styled(Button)`
  position: absolute;
  bottom: 15px;
  right: 25px;
  font-size: 24px;
  padding: 10px;
`
