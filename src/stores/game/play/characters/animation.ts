import { AnimationSequence } from 'stores/entities/animation'
import {
  AnimationConfigNoNameNoSpriteSheet,
  AnimationList,
  ViewDirections,
} from 'stores/entities/animation-controller'
import { getRowSequence } from 'stores/game/lib/animation'

export type CharacterMovementAnimationName = 'walkDown' | 'walkRight' | 'walkUp' | 'walkLeft'

export type GetCharacterMovementAnimationConfig = Omit<
  AnimationConfigNoNameNoSpriteSheet,
  'sequence' | 'startFrom'
>

const getCharacterMovementAnimationSequence = (direction: ViewDirections): AnimationSequence => {
  return getRowSequence(direction, 4)
}

const getCharacterMovementAnimationConfig = (
  direction: ViewDirections,
  template: GetCharacterMovementAnimationConfig,
): AnimationConfigNoNameNoSpriteSheet => {
  const sequence: AnimationSequence = getCharacterMovementAnimationSequence(direction)

  // Начинаем со 2-го спрайта, чтобы сразу после начала движения была анимация шага
  return { ...template, sequence, startFrom: 1 }
}

// Возвращает список с анимациями движения, одинаковыми для всех персонажей
export const getCharacterMovementAnimationList = (
  config: GetCharacterMovementAnimationConfig,
): AnimationList<CharacterMovementAnimationName> => {
  return {
    walkDown: getCharacterMovementAnimationConfig(ViewDirections.DOWN, config),
    walkRight: getCharacterMovementAnimationConfig(ViewDirections.RIGHT, config),
    walkUp: getCharacterMovementAnimationConfig(ViewDirections.UP, config),
    walkLeft: getCharacterMovementAnimationConfig(ViewDirections.LEFT, config),
  }
}
