import { observer } from 'mobx-react-lite'
import React from 'react'

import { Callback, FC } from 'basic-utility-types'

import { useStore } from 'stores/root-store/context'

import { SettingsMenuTemplate } from '../settings-menu-template'
import { GeneralAppSettings } from './general'

type Props = {
  onClose?: Callback
}

export const AppSettingsMenu: FC<Props> = observer(({ onClose }) => {
  const { appStore } = useStore()

  return (
    <SettingsMenuTemplate isOpened={appStore.isSettingsMenuOpened} onClose={onClose}>
      <GeneralAppSettings />
    </SettingsMenuTemplate>
  )
})
