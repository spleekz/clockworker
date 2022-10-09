import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { FC } from 'basic-utility-types'

import { colors } from 'lib/theme'

import { PixelatedCheckbox } from 'components/checkbox/pixelated-checkbox'
import { useGamePlayStore } from 'screens/game/play/screen'

export const ControllersSettingsSection: FC = observer(() => {
  const { settings } = useGamePlayStore()
  const settingsList = settings.list

  return (
    <Container>
      <Title>Управление</Title>
      <Setting>
        <SettingTitle>Движение :</SettingTitle>
        <MovementControllersVariants>
          {settingsList.controllers.movement.controllers.map((settingVariant) => {
            return (
              <MovementControllersVariant key={settingVariant.id}>
                <MovementControllersVariantLabel>
                  {settingVariant.label}
                </MovementControllersVariantLabel>
                <PixelatedCheckbox
                  checked={settingVariant.isSelected}
                  onChange={() =>
                    settingsList.selectSettingVariant(
                      settingsList.controllers.movement.controllers,
                      settingVariant.id,
                    )
                  }
                  backgroundColor={colors.mainMedium}
                  checkedBackgroundColor={colors.mainMediumWell}
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
