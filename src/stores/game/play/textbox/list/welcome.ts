import { GameScript } from 'content/text/get-parsed-game-script'

import { Textbox } from '../textbox'

type Config = {
  gameScript: GameScript
}

export const createWelcomeTextbox = (config: Config): Textbox<'welcome'> => {
  return new Textbox({
    name: 'welcome',
    text: config.gameScript.content.welcome,
  })
}
