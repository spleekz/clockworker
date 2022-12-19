import { observer } from 'mobx-react-lite'
import React from 'react'

import { Callback, FC } from 'basic-utility-types'

import { useStore } from 'stores/root-store/context'

import { colors } from 'lib/theme'

import { ConfirmPopup } from 'components/popup/confirm-popup'

type Props = {
  isOpened: boolean
  question?: string
  onAccept?: Callback
}

export const QuitInMainMenuConfirm: FC<Props> = observer(({ isOpened, question, onAccept }) => {
  const { appStore } = useStore()

  return (
    <ConfirmPopup
      width={'550px'}
      height={'300px'}
      styles={{
        backgroundColor: colors.mainLight,
      }}
      isOpened={isOpened}
      question={question ?? 'Выйти в главное меню?'}
      questionStyles={{
        fontSize: '30px',
      }}
      acceptText={'Да'}
      onAccept={() => {
        onAccept?.()
        appStore.setScreen('main')
        appStore.closeQuitInMainMenuConfirm()
      }}
      rejectText={'Нет'}
      onReject={appStore.closeQuitInMainMenuConfirm}
      buttonsStyles={{
        width: '140px',
        padding: '10px',
        backgroundColor: colors.mainMedium,
      }}
    />
  )
})
