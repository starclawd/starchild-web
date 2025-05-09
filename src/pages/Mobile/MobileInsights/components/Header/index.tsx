import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import Notification from 'pages/Insights/components/Notification'

const HeaderWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 0 ${vm(12)};
`

const TopOperator = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  ${({ theme}) =>
    theme.isMobile &&
    css`
      align-items: center;
      justify-content: space-between;
      padding: ${vm(8)};
      height: ${vm(60)};
      border-radius: ${vm(36)};
      background-color: ${({ theme }) => theme.bgL1};
      span {
        font-size: 0.16rem;
        font-weight: 500;
        line-height: 0.24rem;
        color: ${({ theme }) => theme.textL1};
      }
    `
  }
`

const ShowHistoryIcon = styled.div`
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(88)};
    height: ${vm(44)};
  `}
`

export default function Header() {
  return <HeaderWrapper>
    <TopOperator>
      <ShowHistoryIcon>
      </ShowHistoryIcon>
      <span><Trans>Insights</Trans></span>
      <Notification />
    </TopOperator>
  </HeaderWrapper>
}
