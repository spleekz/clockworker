import { computed, makeObservable, observable } from 'mobx'

import { Properties } from 'basic-utility-types'

import { PlayerCharacter } from './player/character'

type This = InstanceType<typeof CharactersController>

export type CharacterName = keyof This['refList']
type Character = InstanceType<Properties<This['refList']>>
export type CharacterList = Record<CharacterName, Character>

export class CharactersController {
  constructor() {
    makeObservable(this, {
      list: observable,
      activeCharactersNames: observable,
      isAllActiveCharactersImagesLoaded: computed,
    })
  }

  // список персонажей, использующихся в контроллере
  private refList = { player: PlayerCharacter }

  // список созданных персонажей
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

  // список персонажей, активных в текущий момент
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

  get activeCharacters(): Array<Character> {
    return this.activeCharactersNames.map((characterName) => {
      return this.list[characterName]
    })
  }

  get isAllActiveCharactersImagesLoaded(): boolean {
    return Object.values(this.list).every(
      (activeCharacter) => activeCharacter.imageContainer.isAllImagesLoaded,
    )
  }
}
