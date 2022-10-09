import { observer } from 'mobx-react-lite'
import React from 'react'

import { FC } from 'basic-utility-types'

import { UpdateStore } from 'stores/update-store'

import { DownloadProgress } from './download-progress'
import { UpdateAvailable } from './update-available'

type Props = {
  updateStore: UpdateStore
}

export const UpdateNotification: FC<Props> = observer(({ updateStore }) => {
  const { version, releaseNotes, currentPercentage } = updateStore

  return (
    <>
      {version !== null &&
        releaseNotes !== null &&
        (currentPercentage !== null ? (
          <DownloadProgress percentage={currentPercentage} />
        ) : (
          <UpdateAvailable
            version={version}
            releaseNotes={releaseNotes}
            updateGame={updateStore.updateGame}
          />
        ))}
    </>
  )
})
