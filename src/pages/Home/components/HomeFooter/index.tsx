import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { ANI_DURATION } from 'constants/index'

const Footer = styled.div<{ $opacity: number }>`
  position: absolute;
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

const WhiteListInfo = styled.span`
  a {
    color: #0076a0;
    transition: color ${ANI_DURATION}s;
  }
  ${({ theme }) =>
    theme.isMobile
      ? css`
          a {
            &:active {
              color: #00a9de;
            }
          }
        `
      : css`
          a {
            &:hover {
              color: #00a9de;
            }
          }
        `}
`

interface HomeFooterProps {
  opacity: number
}

export default function HomeFooter({ opacity }: HomeFooterProps) {
  return (
    <Footer $opacity={opacity}>
      <span>
        <Trans>Powered by STARCHILD</Trans>
      </span>
    </Footer>
  )
}
