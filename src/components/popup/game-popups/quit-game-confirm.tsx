import { observer } from 'mobx-react-lite'
import React from 'react'

import { Callback, FC } from 'basic-utility-types'

import { useStore } from 'stores/root-store/context'

import { colors } from 'lib/theme'

import { ConfirmPopup } from 'components/popup/confirm-popup'

type Props = {
  isOpened: boolean
  onAccept?: Callback
}

export const QuitGameConfirm: FC<Props> = observer(({ isOpened, onAccept }) => {
  const { appStore } = useStore()

  return (
    <ConfirmPopup
      width={'550px'}
      height={'300px'}
      styles={{
        backgroundColor: colors.mainLight,
      }}
      isOpened={isOpened}
      question={'Выйти из игры?'}
      acceptText={'Да'}
      onAccept={() => {
        onAccept?.()
        appStore.quitGame()
      }}
      rejectText={'Нет'}
      onReject={appStore.closeQuitGameConfirm}
      buttonsStyles={{
        width: '140px',
        padding: '10px',
        backgroundColor: colors.mainMedium,
      }}
    />
  )
})
