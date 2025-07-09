import styled, { css } from 'styled-components'
import { memo } from 'react'
import { Trans } from '@lingui/react/macro'
import aiLogo from 'assets/tradeai/ai-logo.png'
import { vm } from 'pages/helper'

const AssistantIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
  height: 18px;
  gap: 4px;
  img {
    width: 18px;
    height: 18px;
  }
  span {
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    color: ${({ theme }) => theme.textL1};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(18)};
      gap: ${vm(4)};
      img {
        width: ${vm(18)};
        height: ${vm(18)};
      }
      span {
        font-size: 0.12rem;
        font-weight: 500;
        line-height: 0.18rem;
      }
    `}
`

export default memo(function AssistantIcon() {
  return (
    <AssistantIconWrapper>
      <img src={aiLogo} alt='ai-logo' />
      <span>
        <Trans>Holominds</Trans>
      </span>
    </AssistantIconWrapper>
  )
})
