import { observer } from 'mobx-react-lite'
import React from 'react'

import { FC } from 'basic-utility-types'

import { useStore } from 'stores/root-store/context'

import { colors } from 'lib/theme'

import { ConfirmPopup } from 'components/popup/confirm-popup'

type Props = {
  isOpened: boolean
  question?: string
}

export const QuitInMainMenuConfirm: FC<Props> = observer(({ isOpened, question }) => {
  const { appStore } = useStore()

  return (
    <ConfirmPopup
      width={'580px'}
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
