import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { useStore } from 'stores/root-store/context'

import { FlagSetting } from '../flag-setting'

export const GeneralAppSettings = observer(() => {
  const { appSettingsStore } = useStore()

  const { general } = appSettingsStore.editable

  const { isGetUpdateNotifications } = general

  return (
    <Container>
      <Setting>
        <SettingTitle>Уведомления о новых версиях игры</SettingTitle>
        <FlagSetting setting={isGetUpdateNotifications} />
      </Setting>
    </Container>
  )
})

const Container = styled.div``
const Setting = styled.div`
  display: flex;
  justify-content: space-between;
`
const SettingTitle = styled.div`
  font-size: 22px;
`
