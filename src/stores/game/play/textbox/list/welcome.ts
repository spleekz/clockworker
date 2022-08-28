import { GameScript } from 'content/text/get-parsed-game-script'

import { GameActions } from '../../game-actions'
import { Textbox } from '../textbox'

type Config = {
  gameActions: GameActions
  gameScript: GameScript
}

export const createWelcomeTextbox = (config: Config): Textbox<'welcome'> => {

  return new Textbox({
    name: 'welcome',
    text: config.gameScript.content.welcome,
    afterClose: config.gameActions.playerEntering,
  })
}
