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
import { FieldErrorMessages } from './errors/field-error-messages'
import { getFormErrors } from './errors/get-errors'

export type CreateHeroForm = {
  heroName: string
  marketName: string
}

export const CreateHeroForm: FC = observer(() => {
  const gameStore = useGameStore()
  const { gameSetupForm } = gameStore

  const { register, handleSubmit, getValues, setValue, formState } = useForm<CreateHeroForm>()

  const errors = getFormErrors(formState.errors)

  const trimHeroName = (): void => {
    const { heroName } = getValues()
    setValue('heroName', heroName.trim())
  }
  const trimMarketName = (): void => {
    const { marketName } = getValues()
    setValue('marketName', marketName.trim())
  }

  const validateNoSpecialSymbols = (value: string): boolean => {
    return value
      .split('')
      .every((symbol) => isLetter(symbol) || isNumber(symbol) || symbol === ' ' || symbol === '-')
  }

  const startGame: SubmitHandler<CreateHeroForm> = ({ heroName, marketName }) => {
    gameSetupForm.setPlayerNickname(heroName)
    gameSetupForm.setMarketName(marketName)
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
          {errors.heroName.isError && (
            <ExclamationMarkContainer>
              <ExclamationMark>!</ExclamationMark>
            </ExclamationMarkContainer>
          )}
          <FieldErrorMessages errors={errors.heroName} />
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
          {errors.marketName.isError && (
            <ExclamationMarkContainer>
              <ExclamationMark>!</ExclamationMark>
            </ExclamationMarkContainer>
          )}
          <FieldErrorMessages errors={errors.marketName} />
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
  background: ${colors.mainLight};
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
  backgroundColor: colors.mainMedium,
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
const StartGameButtonContainer = styled.div`
  position: absolute;
  bottom: 5px;
  right: 5px;
`
const StartGameButton = styled(PixelatedButton).attrs({
  pixelsSize: 'medium',
  backgroundColor: colors.mainMedium,
})`
  font-size: 26px;
  padding: 8px;
  margin-top: 10px;
`
