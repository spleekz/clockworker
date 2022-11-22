import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { Callback, FC } from 'basic-utility-types'

import { PixelatedDiv } from 'components/pixelated/pixelated-components'

import { CheckMarkIcon } from 'assets/icons/check-mark'

type Props = {
  checked?: boolean
  disabled?: boolean
  onChange?: Callback
  backgroundColor: string
  checkedBackgroundColor: string
}

export const PixelatedCheckbox: FC<Props> = observer(
  ({ checked, onChange, backgroundColor, checkedBackgroundColor }) => {
    const background = checked ? checkedBackgroundColor : backgroundColor

    return (
      <StyledPixelatedCheckbox onClick={onChange} backgroundColor={background}>
        {checked && (
          <CheckMarkContainer>
            <CheckMarkIcon size={42} />
          </CheckMarkContainer>
        )}
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
const CheckMarkContainer = styled.div`
  position: absolute;
  top: -5px;
`
