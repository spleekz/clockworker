import { AnimationList } from 'stores/entities/animation-controller'

import {
  CharacterMovementAnimationName,
  GetCharacterMovementAnimationConfig,
  getCharacterMovementAnimationList,
} from '../animation'

export type PlayerCharacterAnimationName = CharacterMovementAnimationName

export const playerCharacterWalkFramesPerSprite = 11

const playerCharacterMovementAnimationConfig: Pick<
  GetCharacterMovementAnimationConfig,
  'framesPerSprite'
> = {
  framesPerSprite: playerCharacterWalkFramesPerSprite,
}

export const getPlayerCharacterAnimationList = (
  config: Omit<GetCharacterMovementAnimationConfig, 'framesPerSprite'>,
): AnimationList<PlayerCharacterAnimationName> => {
  return getCharacterMovementAnimationList({ ...config, ...playerCharacterMovementAnimationConfig })
}
