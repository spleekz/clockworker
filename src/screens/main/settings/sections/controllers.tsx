import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { FC } from 'basic-utility-types'

import { useStore } from 'stores/root-store/context'

import { colors } from 'lib/theme'

import { PixelatedCheckbox } from 'components/checkbox/pixelated-checkbox'

export const ControllersSettingsSection: FC = observer(() => {
  const { settingsStore } = useStore()

  return (
    <Container>
      <Title>Управление</Title>
      <Setting>
        <SettingTitle>Движение :</SettingTitle>
        <MovementControllersVariants>
          {settingsStore.settings.controllers.movement.controllers.map((variant) => {
            return (
              <MovementControllersVariant key={variant.id}>
                <MovementControllersVariantLabel>{variant.label}</MovementControllersVariantLabel>
                <PixelatedCheckbox
                  checked={variant.isSelected}
                  onChange={() => settingsStore.selectMovementControllersVariant(variant.id)}
                  backgroundColor={colors.secondary}
                  checkedBackgroundColor={colors.selected}
                />
              </MovementControllersVariant>
            )
          })}
        </MovementControllersVariants>
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
const MovementControllersVariants = styled.div`
  flex: 1 0 auto;
  display: flex;
  justify-content: space-around;
`
const MovementControllersVariant = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const MovementControllersVariantLabel = styled.div`
  margin-bottom: 8px;
`
