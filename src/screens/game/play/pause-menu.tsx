import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { FC } from 'basic-utility-types'

import { useStore } from 'stores/root-store/context'

import { colors } from 'lib/theme'

import { PixelatedButton } from 'components/pixelated/pixelated-components'
import { GamePopup } from 'components/popup/game-popups/game-popup-template'

import { useGamePlayStore } from '../screen'

export const PauseMenu: FC = observer(() => {
  const { appStore } = useStore()
  const gamePlayStore = useGamePlayStore()

  const { pauseMenu, settingsMenu } = gamePlayStore.popups
  const { quitInMainMenuConfirm, quitGameConfirm } = appStore

  const resumeGame = (): void => {
    pauseMenu.close()
  }

  const openSettings = (): void => {
    settingsMenu.open({ config: { forwardedFrom: { popup: pauseMenu, onClose: { fn: null } } } })
  }

  const openQuitInMainMenuConfirm = (): void => {
    quitInMainMenuConfirm.open()
  }

  const openQuitGameConfirm = (): void => {
    quitGameConfirm.open()
  }

  return (
    <GamePopup
      popup={pauseMenu}
      width={'600px'}
      height={'550px'}
      styles={{
        backgroundColor: colors.mainLight,
      }}
      withCloseButton={false}
      title={'Пауза'}
    >
      <MenuList>
        <Sections>
          <Section>
            <MenuItem onClick={resumeGame}>Продолжить игру</MenuItem>
            <MenuItem onClick={openSettings}>Настройки</MenuItem>
          </Section>
          <Section>
            <MenuItem onClick={openQuitInMainMenuConfirm}>Выйти в главное меню</MenuItem>
            <MenuItem onClick={openQuitGameConfirm}>Выйти из игры</MenuItem>
          </Section>
        </Sections>
      </MenuList>
    </GamePopup>
  )
})

const MenuList = styled.menu`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 7px;
`
const Sections = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const MenuItem = styled(PixelatedButton).attrs({
  pixelsSize: 'medium',
  backgroundColor: colors.mainMedium,
})`
  display: block;
  margin-bottom: 16px;
  padding: 10px;
  font-size: 20px;
  font-weight: bold;
  &:last-child {
    margin-bottom: 0;
  }
`
