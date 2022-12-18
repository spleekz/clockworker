import { observer } from 'mobx-react-lite'
import React from 'react'

import { useGamePlayStore } from 'screens/game/play/screen'

import { Textbox } from './textbox'

export const GameTextbox = observer(() => {
  const gamePlayStore = useGamePlayStore()
  const { textboxesController } = gamePlayStore

  const text = textboxesController.currentTextbox?.text ?? ''

  return <Textbox isOpened={textboxesController.isTextboxOpened} text={text} />
})
