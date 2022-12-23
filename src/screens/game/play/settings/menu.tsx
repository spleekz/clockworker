import { observer } from 'mobx-react-lite'
import React from 'react'

import { Callback, FC } from 'basic-utility-types'

import { SettingsMenuTemplate } from 'components/settings/settings-menu-template'

import { ControlsSettingsSection } from './sections/controls'

type Props = {
  isOpened: boolean
  onClose?: Callback
}

export const GameSettingsMenu: FC<Props> = observer(({ isOpened, onClose }) => {
  return (
    <SettingsMenuTemplate isOpened={isOpened} onClose={onClose}>
      <ControlsSettingsSection />
    </SettingsMenuTemplate>
  )
})
