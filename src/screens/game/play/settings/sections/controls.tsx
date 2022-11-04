import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { FC } from 'basic-utility-types'

import { colors } from 'lib/theme'

import { PixelatedCheckbox } from 'components/checkbox/pixelated-checkbox'
import { useGamePlayStore } from 'screens/game/play/screen'

export const ControlsSettingsSection: FC = observer(() => {
  const { settings } = useGamePlayStore()
  const controlsSettings = settings.editable.controls
  const movementControllers = controlsSettings.movement?.controllers

  return (
    <Container>
      <Title>Управление</Title>
      <Setting>
        <SettingTitle>Движение :</SettingTitle>
        <MovementControlsVariants>
          {movementControllers?.variants.map((controllersVariant) => {
            return (
              <MovementControlsVariant key={controllersVariant.id}>
                <MovementControlsVariantLabel>{controllersVariant.label}</MovementControlsVariantLabel>
                <PixelatedCheckbox
                  checked={controllersVariant.isSelected}
                  onChange={() => movementControllers.selectVariant(controllersVariant.id)}
                  backgroundColor={colors.mainMedium}
                  checkedBackgroundColor={colors.mainMediumWell}
                />
              </MovementControlsVariant>
            )
          })}
        </MovementControlsVariants>
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
const MovementControlsVariants = styled.div`
  flex: 1 0 auto;
  display: flex;
  justify-content: space-around;
`
const MovementControlsVariant = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const MovementControlsVariantLabel = styled.div`
  margin-bottom: 8px;
`
