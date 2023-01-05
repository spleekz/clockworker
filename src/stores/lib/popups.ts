import { PopupHistory } from 'stores/popup-history'

export const closeLastUnclosedPopup = (history: PopupHistory): void => {
  const lastUnclosedPopup = history.getLastUnclosedPopup()
  if (lastUnclosedPopup) {
    lastUnclosedPopup.close()
  }
}

export const closeAllUnclosedPopups = (history: PopupHistory): void => {
  const unclosedPopups = history.getUnclosedPopups()
  unclosedPopups.forEach((popup) => popup.close())
}
