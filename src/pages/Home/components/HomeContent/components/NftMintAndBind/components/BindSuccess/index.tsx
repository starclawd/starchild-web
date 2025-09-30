import { Trans } from '@lingui/react/macro'
import { HomeButton } from 'components/Button'
import { vm } from 'pages/helper'
import { useCallback } from 'react'
import styled, { css } from 'styled-components'
import { goOutPageDirect, isPro, STARCHILD_BOT, TELEGRAM, URL } from 'utils/url'
const BindSuccessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(16)};
    `}
`

const BindSuccessInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  span:first-child {
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    text-align: center;
    color: ${({ theme }) => theme.textL1};
  }
  span:last-child {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    text-align: center;
    color: ${({ theme }) => theme.textL3};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      span:first-child {
        font-size: 0.18rem;
        line-height: 0.26rem;
      }
      span:last-child {
        font-size: 0.13rem;
        line-height: 0.2rem;
      }
    `}
`

const JoinButton = styled(HomeButton)`
  width: 120px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(180)};
    `}
`

export default function BindSuccess() {
  const goToTelegramEarlyAccess = useCallback(() => {
    goOutPageDirect(URL[isPro ? STARCHILD_BOT : TELEGRAM])
  }, [])
  return (
    <BindSuccessWrapper>
      <BindSuccessInfo>
        <span>
          <Trans>You have logged in successfully.</Trans>
        </span>
        <span>
          <Trans>You can access via our Telegram bot:</Trans>
        </span>
      </BindSuccessInfo>
      <JoinButton onClick={goToTelegramEarlyAccess}>
        <Trans>Enter</Trans>
      </JoinButton>
    </BindSuccessWrapper>
  )
}
