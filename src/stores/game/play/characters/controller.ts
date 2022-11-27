import { makeAutoObservable, observable } from 'mobx'

import { PlayerCharacter } from './player/player-character'

type This = InstanceType<typeof CharactersController>

export type CharacterName = keyof This['refList']

export type CharacterList = { [P in CharacterName]: InstanceType<This['refList'][P]> }

export class CharactersController {
  constructor() {
    makeAutoObservable(this, { refList: observable.shallow })
  }

  //Список персонажей, использующихся в контроллере
  refList = { playerCharacter: PlayerCharacter }

  //Список созданных персонажей
  list: CharacterList = {} as CharacterList

  createCharacter = async <
    T extends CharacterName,
    CharacterConfig extends ConstructorParameters<This['refList'][T]>[number],
  >(
    name: T,
    ...args: CharacterConfig extends never ? [undefined] : [CharacterConfig]
  ): Promise<void> => {
    const characterConfig = args[0]
    this.list[name] = new this.refList[name](characterConfig)
    await this.list[name].imageContainer.loadAll()
  }

  //Список персонажей, активных в текущий момент
  activeCharactersNames: Array<CharacterName> = []

  addActiveCharacter = (characterName: CharacterName): void => {
    this.activeCharactersNames.push(characterName)
  }
  addActiveCharacters = (charactersNames: Array<CharacterName>): void => {
    charactersNames.forEach((characterName) => {
      this.addActiveCharacter(characterName)
    })
  }

  removeActiveCharacter = (characterName: CharacterName): void => {
    this.activeCharactersNames = this.activeCharactersNames.filter((name) => name !== characterName)
  }
  removeActiveCharacters = (characterNames: Array<CharacterName>): void => {
    this.activeCharactersNames = this.activeCharactersNames.filter((name) =>
      characterNames.every((characterName) => name === characterName),
    )
  }

  clearActiveCharacters = (): void => {
    this.activeCharactersNames = []
  }

  get isAllActiveCharactersImagesLoaded(): boolean {
    return Object.values(this.list).every(
      (activeCharacter) => activeCharacter.imageContainer.isAllImagesLoaded,
    )
  }
}
