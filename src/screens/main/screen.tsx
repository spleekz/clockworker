import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { FC } from 'basic-utility-types'

import { useStore } from 'stores/root-store/context'

import { colors } from 'lib/theme'

import { PixelatedButton } from 'components/pixelated/pixelated-components'

import { version } from '../../../package.json'
import { handleMainScreenEsc } from './handle-esc'
import { MainMenu } from './main-menu'

export const MainScreen: FC = observer(() => {
  const { appStore } = useStore()

  handleMainScreenEsc()

  return (
    <Container>
      <Title>clockworker</Title>
      <Body>
        <MainMenu />
      </Body>
      <QuitGameButton onClick={appStore.openQuitGameConfirm}>Выйти из игры</QuitGameButton>
      <GameVersion>v{version}</GameVersion>
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
const QuitGameButton = styled(PixelatedButton).attrs({
  pixelsSize: 'medium',
  backgroundColor: colors.primary,
})`
  position: absolute;
  bottom: 15px;
  right: 25px;
  font-size: 24px;
  padding: 10px;
`
const GameVersion = styled.span`
  position: absolute;
  bottom: 3px;
  left: 5px;
  font-size: 20px;
`
