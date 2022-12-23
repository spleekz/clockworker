import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'

import { FC } from 'basic-utility-types'

import { UpdateStore } from 'stores/update.store'

import { DownloadProgress } from './download-progress'
import { UpdateNotification } from './update-notification'

type Props = {
  updateStore: NonNullable<UpdateStore>
}

export const UpdatePopup: FC<Props> = observer(({ updateStore }) => {
  const {
    version,
    releaseNotes,
    currentPercentage,
    isNotificationOpened,
    updateGame,
    setIsNotificationOpened,
  } = updateStore

  useEffect(() => {
    if (version !== null && releaseNotes !== null) {
      setIsNotificationOpened(true)
    }
  }, [version, releaseNotes])

  return (
    <>
      {version !== null &&
        releaseNotes !== null &&
        (currentPercentage === null ? (
          <UpdateNotification
            isOpened={isNotificationOpened}
            version={version}
            releaseNotes={releaseNotes}
            updateGame={updateGame}
            fnForClosing={() => setIsNotificationOpened(false)}
          />
        ) : (
          <DownloadProgress percentage={currentPercentage} />
        ))}
    </>
  )
})
