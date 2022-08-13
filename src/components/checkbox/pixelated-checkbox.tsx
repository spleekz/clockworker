import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { EmptyFunction, FC } from 'basic-utility-types'

import { PixelatedDiv } from 'components/pixelated/pixelated-components'

import checkMark from 'assets/icons/check-mark.png'

type Props = {
  checked?: boolean
  disabled?: boolean
  onChange?: EmptyFunction
  backgroundColor: string
  checkedBackgroundColor: string
}

export const PixelatedCheckbox: FC<Props> = observer(
  ({ checked, onChange, backgroundColor, checkedBackgroundColor }) => {
    const background = checked ? checkedBackgroundColor : backgroundColor

    return (
      <StyledPixelatedCheckbox onClick={onChange} backgroundColor={background}>
        {checked && <CheckMark />}
      </StyledPixelatedCheckbox>
    )
  },
)

export const StyledPixelatedCheckbox = styled(PixelatedDiv).attrs({
  pixelsSize: 'small',
})`
  width: 38px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const CheckMark = styled.div`
  position: absolute;
  top: -5px;
  width: 42px;
  height: 42px;
  background-image: url(${checkMark});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`
