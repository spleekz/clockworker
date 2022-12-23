import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { FC } from 'basic-utility-types'

import { SettingVariants } from 'components/settings/setting-variants'
import { useGamePlayStore } from 'screens/game/screen'

export const ControlsSettingsSection: FC = observer(() => {
  const { settings } = useGamePlayStore()
  const controlsSettings = settings.editable.controls
  const movementControllers = controlsSettings.movement?.controllers

  return (
    <Container>
      <Title>Управление</Title>
      <Setting>
        <SettingTitle>Движение :</SettingTitle>
        <SettingVariants setting={movementControllers} />
      </Setting>
    </Container>
  )
})

const Container = styled.div``
const Title = styled.div`
  font-size: 32px;
`
const Setting = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`
const SettingTitle = styled.div`
  position: relative;
  top: 10px;
  font-size: 24px;
`
