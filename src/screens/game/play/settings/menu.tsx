import { observer } from 'mobx-react-lite'
import React from 'react'

import { Callback, FC } from 'basic-utility-types'

import { SettingsMenuTemplate } from 'components/settings/settings-menu-template'
import { useGamePlayStore } from 'screens/game/screen'

import { ControlsSettingsSection } from './sections/controls'

type Props = {
  isOpened: boolean
  onClose?: Callback
}

export const GameSettingsMenu: FC<Props> = observer(({ isOpened, onClose }) => {
  const gamePlayStore = useGamePlayStore()

  const close = (): void => {
    gamePlayStore.popups.controller.close('settingsMenu')
    onClose?.()
  }

  return (
    <SettingsMenuTemplate isOpened={isOpened} onClose={close}>
      <ControlsSettingsSection />
    </SettingsMenuTemplate>
  )
})
