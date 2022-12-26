import { observer } from 'mobx-react-lite'
import React from 'react'

import { Callback, FC } from 'basic-utility-types'

import { useStore } from 'stores/root-store/context'

import { colors } from 'lib/theme'

import { ConfirmPopup } from 'components/popup/confirm-popup'

type Props = {
  question?: string
  onAccept?: Callback
}

export const QuitInMainMenuConfirm: FC<Props> = observer(({ question, onAccept }) => {
  const { appStore } = useStore()

  return (
    <ConfirmPopup
      width={'550px'}
      height={'300px'}
      styles={{
        backgroundColor: colors.mainLight,
      }}
      isOpened={appStore.popupsController.isOpened('quitInMainMenuConfirm')}
      question={question ?? 'Выйти в главное меню?'}
      questionStyles={{
        fontSize: '30px',
      }}
      acceptText={'Да'}
      onAccept={() => {
        onAccept?.()
        appStore.setScreen('main')
        appStore.popupsController.close('quitInMainMenuConfirm')
      }}
      rejectText={'Нет'}
      onReject={() => appStore.popupsController.close('quitInMainMenuConfirm')}
      buttonsStyles={{
        width: '140px',
        padding: '10px',
        backgroundColor: colors.mainMedium,
      }}
    />
  )
})
