import { DeepRequired, FieldErrorsImpl } from 'react-hook-form'

import { CreateHeroForm } from '../form'

type FieldError = {
  value: boolean
  message: string
}

export type FieldErrors = {
  isError: boolean
  isEmpty: FieldError
  isShort: FieldError
  isSpecSymbols: FieldError
}

type GetFormErrorsReturn = {
  [P in keyof CreateHeroForm]: FieldErrors
}

export const getFormErrors = (
  errors: FieldErrorsImpl<DeepRequired<CreateHeroForm>>,
): GetFormErrorsReturn => {
  const isHeroNameError = Boolean(errors.heroName)
  const isHeroNameEmpty = errors.heroName?.type === 'required'
  const heroNameEmptyMessage = 'Вы не указали имя своего персонажа'
  const isHeroNameShort = errors.heroName?.type === 'minLength'
  const heroNameShortMessage = 'Слишком короткое имя для персонажа'
  const isHeroNameSpecSymbols = errors.heroName?.type === 'validate'
  const heroNameSpecSymbolsMessage = 'Имя персонажа содержит недопустимые символы'

  const isMarketNameError = Boolean(errors.marketName)
  const isMarketNameEmpty = errors.marketName?.type === 'required'
  const marketNameEmptyMessage = 'Вы не указали название магазина'
  const isMarketNameShort = errors.marketName?.type === 'minLength'
  const marketNameShortMessage = 'Название магазина слишком короткое'
  const isMarketNameSpecSymbols = errors.marketName?.type === 'validate'
  const marketNameSpecSymbolsMessage = 'Название магазина содержит недопустимые символы'

  return {
    heroName: {
      isError: isHeroNameError,
      isEmpty: {
        value: isHeroNameEmpty,
        message: heroNameEmptyMessage,
      },
      isShort: {
        value: isHeroNameShort,
        message: heroNameShortMessage,
      },
      isSpecSymbols: {
        value: isHeroNameSpecSymbols,
        message: heroNameSpecSymbolsMessage,
      },
    },
    marketName: {
      isError: isMarketNameError,
      isEmpty: {
        value: isMarketNameEmpty,
        message: marketNameEmptyMessage,
      },
      isShort: {
        value: isMarketNameShort,
        message: marketNameShortMessage,
      },
      isSpecSymbols: {
        value: isMarketNameSpecSymbols,
        message: marketNameSpecSymbolsMessage,
      },
    },
  }
}
