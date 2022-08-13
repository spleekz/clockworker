export const isLetter = (symbol: string): boolean => {
  const regExp = new RegExp('[A-Za-zА-Яа-яЁё]')
  return regExp.test(symbol)
}

export const isNumber = (symbol: string): boolean => {
  const regExp = new RegExp('[0-9]')
  return regExp.test(symbol)
}
