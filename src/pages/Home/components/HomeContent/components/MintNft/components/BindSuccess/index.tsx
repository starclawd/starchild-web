import { Trans } from '@lingui/react/macro'
import { HomeButton } from 'components/Button'
import { vm } from 'pages/helper'
import styled, { css } from 'styled-components'
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
  return (
    <BindSuccessWrapper>
      <BindSuccessInfo>
        <span>
          <Trans>
            Congratulations!
            <br /> You have login succesfully.
          </Trans>
        </span>
        <span>
          <Trans>Please join our VIP users group</Trans>
        </span>
      </BindSuccessInfo>
      <JoinButton>
        <Trans>join</Trans>
      </JoinButton>
    </BindSuccessWrapper>
  )
}
