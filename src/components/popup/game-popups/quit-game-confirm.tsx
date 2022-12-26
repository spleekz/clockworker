import { observer } from 'mobx-react-lite'
import React from 'react'

import { Callback, FC } from 'basic-utility-types'

import { useStore } from 'stores/root-store/context'

import { colors } from 'lib/theme'

import { ConfirmPopup } from 'components/popup/confirm-popup'

type Props = {
  onAccept?: Callback
}

export const QuitGameConfirm: FC<Props> = observer(({ onAccept }) => {
  const { appStore } = useStore()

  return (
    <ConfirmPopup
      width={'550px'}
      height={'300px'}
      styles={{
        backgroundColor: colors.mainLight,
      }}
      isOpened={appStore.popupsController.isOpened('quitGameConfirm')}
      question={'Выйти из игры?'}
      acceptText={'Да'}
      onAccept={() => {
        onAccept?.()
        appStore.quitGame()
      }}
      rejectText={'Нет'}
      onReject={() => appStore.popupsController.close('quitGameConfirm')}
      buttonsStyles={{
        width: '140px',
        padding: '10px',
        backgroundColor: colors.mainMedium,
      }}
    />
  )
})
