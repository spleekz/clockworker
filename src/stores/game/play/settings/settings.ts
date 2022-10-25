import { CurrentGameSettings } from './current-settings'
import { GameSettingList } from './setting-list'

export class GameSettings {
  list = new GameSettingList()
  current = new CurrentGameSettings({ gameSettingList: this.list })
}
