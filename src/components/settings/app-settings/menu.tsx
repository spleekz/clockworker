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

  const close = (): void => {
    appStore.settingsMenu.close()
    onClose?.()
  }

  return (
    <SettingsMenuTemplate isOpened={appStore.settingsMenu.isOpened} onClose={close}>
      <GeneralAppSettings />
    </SettingsMenuTemplate>
  )
})
