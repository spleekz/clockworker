import { observer } from 'mobx-react-lite'
import React from 'react'

import { Callback, FC } from 'basic-utility-types'

import { Popup as PopupStore } from 'stores/entities/popup'
import { PopupHistory } from 'stores/entities/popup-history'
import { closePopup } from 'stores/lib/popups'
import { useStore } from 'stores/root-store/context'

import { Popup, PopupProps } from '../popup-template'

type CloseGamePopupConfig = { popup: PopupStore; history: PopupHistory }
export const closeGamePopup = ({ popup, history }: CloseGamePopupConfig): void => {
  closePopup({ popup, history })
}

export type GamePopupProps = {
  popup: PopupStore
} & Omit<PopupProps, 'isOpened' | 'fnForClosing'>

export const GamePopup: FC<GamePopupProps> = observer(
  ({ popup, width, height, styles, title, titleStyles, withCloseButton, onClose, children }) => {
    const history = useStore().appStore.popupHistory

    const isOpened = popup.isOpened
    const fnForClosing: Callback = (): void => {
      closeGamePopup({ popup, history })
      onClose?.()
    }

    return (
      <Popup
        width={width}
        height={height}
        styles={styles}
        title={title}
        titleStyles={titleStyles}
        withCloseButton={withCloseButton}
        isOpened={isOpened}
        fnForClosing={fnForClosing}
      >
        {children}
      </Popup>
    )
  },
)
