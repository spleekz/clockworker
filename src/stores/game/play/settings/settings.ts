import { CurrentGameSettings } from './current-settings'
import { GameSettingsList } from './settings-list'

export class GameSettings {
  list = new GameSettingsList()
  current = new CurrentGameSettings({ gameSettingsList: this.list })
}
