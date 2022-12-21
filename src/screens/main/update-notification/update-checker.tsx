import { observer } from 'mobx-react-lite'
import React from 'react'

import { FC } from 'basic-utility-types'

import { useStore } from 'stores/root-store/context'

import { UpdateNotification } from './update-notification'

export const UpdateChecker: FC = observer(() => {
  const { updateStore } = useStore()

  if (!updateStore) {
    return null
  }

  const { version, releaseNotes, currentPercentage, isUpdateAvailable, updateGame } = updateStore

  return (
    <>
      {isUpdateAvailable && version !== null && releaseNotes !== null && (
        <UpdateNotification
          version={version}
          releaseNotes={releaseNotes}
          currentPercentage={currentPercentage}
          updateGame={updateGame}
        />
      )}
    </>
  )
})
