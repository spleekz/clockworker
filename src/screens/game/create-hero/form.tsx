import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { FC } from 'basic-utility-types'
import { SubmitHandler, useForm } from 'react-hook-form'

import { isLetter, isNumber } from 'lib/strings'
import { colors } from 'lib/theme'

import {
  PixelatedButton,
  PixelatedDiv,
  PixelatedInput,
} from 'components/pixelated/pixelated-components'

import { useGameStore } from '../game'

type CreateHeroForm = {
  heroName: string
  marketName: string
}

export const CreateHeroForm: FC = observer(() => {
  const gameStore = useGameStore()
  const { gameSetupFormStore } = gameStore

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<CreateHeroForm>()

  const trimHeroName = (): void => {
    const { heroName } = getValues()
    setValue('heroName', heroName.trim())
  }
  const trimMarketName = (): void => {
    const { marketName } = getValues()
    setValue('marketName', marketName.trim())
  }

  const isHeroNameEmpty = errors.heroName?.type === 'required'
  const heroNameEmptyText = 'Вы не указали имя своего персонажа'
  const isHeroNameShort = errors.heroName?.type === 'minLength'
  const heroNameShortText = 'Слишком короткое имя для персонажа'
  const isHeroNameError = Boolean(errors.heroName)
  const isHeroNameSpecSymbols = errors.heroName?.type === 'validate'
  const heroNameSpecSymbolsText = 'Имя персонажа содержит недопустимые символы'

  const isMarketNameEmpty = errors.marketName?.type === 'required'
  const marketNameEmptyText = 'Вы не указали название магазина'
  const isMarketNameShort = errors.marketName?.type === 'minLength'
  const marketNameShortText = 'Название магазина слишком короткое'
  const isMarketNameError = Boolean(errors.marketName)
  const isMarketNameSpecSymbols = errors.marketName?.type === 'validate'
  const marketNameSpecSymbolsText = 'Название магазина содержит недопустимые символы'

  const validateNoSpecialSymbols = (value: string): boolean => {
    return value
      .split('')
      .every((symbol) => isLetter(symbol) || isNumber(symbol) || symbol === ' ' || symbol === '-')
  }

  const startGame: SubmitHandler<CreateHeroForm> = ({ heroName, marketName }) => {
    gameSetupFormStore.setPlayerName(heroName)
    gameSetupFormStore.setMarketName(marketName)
    gameStore.setScreen('play')
  }

  return (
    <FormBlock>
      <Form onSubmit={handleSubmit(startGame)}>
        <InputContainer>
          <Input
            {...register('heroName', {
              required: true,
              validate: validateNoSpecialSymbols,
              onBlur: trimHeroName,
              minLength: 3,
            })}
            maxLength={20}
            placeholder={'Имя персонажа'}
          />
          {isHeroNameError && (
            <ExclamationMarkContainer>
              <ExclamationMark>!</ExclamationMark>
            </ExclamationMarkContainer>
          )}
          {isHeroNameEmpty && <FormErrorText>{heroNameEmptyText}</FormErrorText>}
          {isHeroNameShort && <FormErrorText>{heroNameShortText}</FormErrorText>}
          {isHeroNameSpecSymbols && <FormErrorText>{heroNameSpecSymbolsText}</FormErrorText>}
        </InputContainer>
        <InputContainer>
          <Input
            {...register('marketName', {
              required: true,
              validate: validateNoSpecialSymbols,
              onBlur: trimMarketName,
              minLength: 2,
            })}
            maxLength={20}
            placeholder={'Название магазина'}
          />
          {isMarketNameError && (
            <ExclamationMarkContainer>
              <ExclamationMark>!</ExclamationMark>
            </ExclamationMarkContainer>
          )}
          {isMarketNameEmpty && <FormErrorText>{marketNameEmptyText}</FormErrorText>}
          {isMarketNameShort && <FormErrorText>{marketNameShortText}</FormErrorText>}
          {isMarketNameSpecSymbols && <FormErrorText>{marketNameSpecSymbolsText}</FormErrorText>}
        </InputContainer>
        <StartGameButtonContainer>
          <StartGameButton type='submit'>Начать игру</StartGameButton>
        </StartGameButtonContainer>
      </Form>
    </FormBlock>
  )
})

const FormBlock = styled.div`
  position: relative;
  width: 640px;
  height: 700px;
  padding: 15px 22px;
  border-radius: 16px;
  background: ${colors.primary};
`
const Form = styled.form`
  height: 100%;
  position: relative;
`
const InputContainer = styled.div`
  position: relative;
  margin-bottom: 50px;
`
const Input = styled(PixelatedInput).attrs({
  pixelsSize: 'medium',
  backgroundColor: colors.secondary,
  containerStyles: {
    width: '92%',
  },
})`
  padding: 7px 5px;
  font-size: 28px;
  font-weight: bold;
`
const ExclamationMarkContainer = styled(PixelatedDiv).attrs({
  pixelsSize: 'small',
  backgroundColor: colors.error,
})`
  position: absolute;
  top: 3px;
  right: 0;
  width: 24px;
  height: 38px;
  font-size: 30px;
  text-align: center;
  color: #ffffff;
`
const ExclamationMark = styled.div`
  position: absolute;
  left: 10px;
`
const FormErrorText = styled.div`
  position: absolute;
  top: 50px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 6px;
  color: ${colors.error};
  text-align: center;
`
const StartGameButtonContainer = styled.div`
  position: absolute;
  bottom: 5px;
  right: 5px;
`
const StartGameButton = styled(PixelatedButton).attrs({
  pixelsSize: 'medium',
  backgroundColor: colors.secondary,
})`
  font-size: 26px;
  padding: 8px;
  margin-top: 10px;
`
