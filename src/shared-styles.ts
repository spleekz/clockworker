import { css } from 'styled-components'

import { colors, theme } from 'lib/theme'

export const doubleBorderStyle = css`
  border: 6.5px solid ${colors.mainDark};
  border-radius: ${theme.borderRadius / 1.7}px;
  &:after {
    content: '';
    position: absolute;
    z-index: -1;
    top: -13px;
    left: -13px;
    right: -13px;
    bottom: -13px;
    background-color: ${colors.mainMedium};
    border-radius: ${theme.borderRadius}px;
  }
`
