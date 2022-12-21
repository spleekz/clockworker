import { observer } from 'mobx-react-lite'
import React from 'react'

import { Callback, FC } from 'basic-utility-types'

import { DownloadProgress } from './download-progress'
import { UpdateAvailable } from './update-available'

type Props = {
  version: string
  releaseNotes: string
  currentPercentage: number | null
  updateGame: Callback
}

export const UpdateNotification: FC<Props> = observer(
  ({ version, releaseNotes, currentPercentage, updateGame }) => {
    return (
      <>
        {currentPercentage !== null ? (
          <DownloadProgress percentage={currentPercentage} />
        ) : (
          <UpdateAvailable version={version} releaseNotes={releaseNotes} updateGame={updateGame} />
        )}
      </>
    )
  },
)
