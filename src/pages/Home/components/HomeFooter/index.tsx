import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'

const Footer = styled.div<{ $opacity: number }>`
  position: fixed;
  left: 0;
  bottom: 20px;
  width: 100%;
  color: #fff;
  text-align: center;
  font-family: 'PowerGrotesk';
  font-size: 10px;
  font-style: normal;
  font-weight: 300;
  line-height: 18px; /* 180% */
  letter-spacing: 2px;
  text-transform: uppercase;
  z-index: 10;
  transition: opacity 1.5s;
  opacity: 0;
  ${({ $opacity }) =>
    $opacity > 0 &&
    css`
      opacity: 1;
    `}
  ${({ theme }) =>
    theme.isMobile
      ? css`
          font-size: 0.1rem;
          line-height: 0.18rem;
          bottom: ${vm(20)};
        `
      : css``}
`

interface HomeFooterProps {
  opacity: number
}

export default function HomeFooter({ opacity }: HomeFooterProps) {
  return (
    <Footer $opacity={opacity}>
      <span>
        <Trans>Powered by WOO</Trans>
      </span>
    </Footer>
  )
}
