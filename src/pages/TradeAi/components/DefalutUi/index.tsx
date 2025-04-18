import styled, { css } from 'styled-components'
import { memo } from 'react'
import suggestImg from 'assets/tradeai/suggest.png'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
const DefalutUiWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex-grow: 1;
  
  ${({ theme }) => theme.isMobile && css`
    width: 100%;
    padding: ${vm(209)} ${vm(12)} 0;
    > img {
      position: absolute;
      top: ${vm(50)};
      left: 0;
      width: 100%;
      height: auto;
    }
  `}
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: ${vm(358)};
  background: #335FFC;
  ${({ theme }) => theme.isMobile && css`
    width: 100%;
    gap: ${vm(20)};
    border-radius: ${vm(36)};
    span:first-child {
      font-size: 0.32rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.34rem;
      text-align: center;
      color: ${theme.textL1};
    }
    span:last-child {
      font-size: 0.16rem;
      font-style: normal;
      font-weight: 500;
      line-height: 0.24rem;
      text-align: center;
      color: ${theme.textL3};
    }
  `}
  
`

export default memo(function DefalutUi() {
  return <DefalutUiWrapper>
    <img src={suggestImg} alt="" />
    <Content>
      <span><Trans>Welcome to<br/>Holominds AI Agent</Trans></span>
      <span><Trans>Ask AI anything...</Trans></span>
    </Content>
  </DefalutUiWrapper>
})
