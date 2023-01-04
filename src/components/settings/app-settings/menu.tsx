import { observer } from 'mobx-react-lite'
import React from 'react'

import { FC } from 'basic-utility-types'

import { useStore } from 'stores/root-store/context'

import { SettingsMenuTemplate } from '../settings-menu-template'
import { GeneralAppSettings } from './general'

export const AppSettingsMenu: FC = observer(() => {
  const { appStore } = useStore()

  return (
    <SettingsMenuTemplate
      isOpened={appStore.popupsController.isOpened('settingsMenu')}
      onClose={() => appStore.popupsController.close('settingsMenu')}
    >
      <GeneralAppSettings />
    </SettingsMenuTemplate>
  )
})
