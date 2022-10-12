import React, { ButtonHTMLAttributes, CSSProperties, InputHTMLAttributes, useState } from 'react'
import styled from 'styled-components'

import { colors } from 'lib/theme'

type PixelsSize = 'small' | 'medium' | 'large'

type PixelatedElementProps = {
  pixelsSize: PixelsSize
  backgroundColor: string
}

const pixelsScales: { [P in PixelsSize]: number } = {
  small: 0.8,
  medium: 1,
  large: 2.5,
}

const getPixelsScale = (pixelsSize: PixelsSize): number => {
  return pixelsScales[pixelsSize]
}
const getPixelsOffset = (pixelsSize: PixelsSize, pixelsCount: number): number => {
  return pixelsCount * getPixelsScale(pixelsSize)
}

export const PixelatedDiv = styled.div<PixelatedElementProps>`
  position: relative;
  z-index: 3;
  background-color: ${(props) => props.backgroundColor};

  &:before {
    content: '';
    position: absolute;
    z-index: -1;
    top: ${({ pixelsSize }) => getPixelsOffset(pixelsSize, 10)}px;
    bottom: ${({ pixelsSize }) => getPixelsOffset(pixelsSize, 10)}px;
    left: ${({ pixelsSize }) => getPixelsOffset(pixelsSize, -10)}px;
    right: ${({ pixelsSize }) => getPixelsOffset(pixelsSize, -10)}px;
    background-color: ${(props) => props.backgroundColor};
  }

  &:after {
    content: '';
    position: absolute;
    z-index: -1;
    top: ${({ pixelsSize }) => getPixelsOffset(pixelsSize, 4)}px;
    bottom: ${({ pixelsSize }) => getPixelsOffset(pixelsSize, 4)}px;
    left: ${({ pixelsSize }) => getPixelsOffset(pixelsSize, -6)}px;
    right: ${({ pixelsSize }) => getPixelsOffset(pixelsSize, -6)}px;
    background-color: ${(props) => props.backgroundColor};
  }
`

type PixelatedButtonProps = PixelatedElementProps & { hoverColor?: string } & {
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export const PixelatedButton = React.forwardRef<HTMLButtonElement, PixelatedButtonProps>(
  ({ pixelsSize, backgroundColor, className, hoverColor, children, ...buttonProps }, ref) => {
    const [isHover, setIsHover] = useState(false)

    const background = isHover ? hoverColor ?? colors.mainMediumWell : backgroundColor

    return (
      <PixelatedDiv
        ref={ref}
        as={'button'}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        pixelsSize={pixelsSize}
        backgroundColor={background}
        className={className}
        {...buttonProps}
      >
        {children}
      </PixelatedDiv>
    )
  },
)
PixelatedButton.displayName = 'PixelatedButton'

//Для инпута не работают :before и :after
export const PixelatedInput = React.forwardRef<
  HTMLInputElement,
  PixelatedElementProps & { className?: string } & {
    containerStyles?: CSSProperties
  } & InputHTMLAttributes<HTMLInputElement>
>(({ pixelsSize, backgroundColor, className, containerStyles, ...inputProps }, ref) => {
  return (
    <DivForPixelatedInput
      pixelsSize={pixelsSize}
      backgroundColor={backgroundColor}
      style={containerStyles}
    >
      <StyledInput ref={ref} backgroundColor={backgroundColor} className={className} {...inputProps} />
    </DivForPixelatedInput>
  )
})
PixelatedInput.displayName = 'PixelatedInput'

const DivForPixelatedInput = styled(PixelatedDiv)``
const StyledInput = styled.input<{ backgroundColor: string }>`
  background-color: ${(props) => props.backgroundColor};
`
