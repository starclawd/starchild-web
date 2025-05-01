import styled, { css } from 'styled-components'
import { memo } from 'react'
import suggestImg from 'assets/tradeai/suggest.png'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'
import { useIsMobile } from 'store/application/hooks'
import ShortcutsList from './components/ShortcutsList'
const DefalutUiWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex-grow: 1;
  ${({ theme }) => !theme.isMobile && css`
    justify-content: flex-start;
    flex-direction: column;
  `}
`

const ImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: unset;
  width: 100%;
  height: fit-content;
  img {
    width: 346px;
  }
  ${({ theme }) => theme.isMobile && css`
    position: absolute;
    top: ${vm(50)};
    left: 0;
    width: 100%;
    height: auto;
    img {
      height: auto;
      z-index: 1;
    }
    .icon-chat-default-ui {
      font-size: .20rem;
      position: absolute;
      z-index: 2;
      color: ${theme.primaryMedium};
      &:nth-child(2) {
        bottom: ${vm(88)};
        left: ${vm(74)};
      }
      &:last-child {
        bottom: ${vm(25)};
        right: ${vm(45)};
      }
    }
  `}
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  > span:first-child {
    font-size: 32px;
    font-weight: 700;
    line-height: 34px;
    text-align: center;
    color: ${({ theme }) => theme.textL1};
  }
  ${({ theme }) => theme.isMobile
  ? css`
    width: 100%;
    > span:first-child {
      font-size: 0.32rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.34rem;
      text-align: center;
      margin-bottom: ${vm(20)};
    }
    > span:nth-child(2) {
      font-size: 0.16rem;
      font-style: normal;
      font-weight: 500;
      line-height: 0.24rem;
      text-align: center;
      color: ${theme.textL3};
      margin-bottom: ${vm(8)};
    }
  ` : css`
    height: 50px;
    justify-content: flex-end;
  `}
`

export default memo(function DefalutUi() {
  const isMobile = useIsMobile()

  return <DefalutUiWrapper>
    <ImgWrapper>
      <img src={suggestImg} alt="" />
      {isMobile && <IconBase className="icon-chat-default-ui" />}
      {isMobile && <IconBase className="icon-chat-default-ui" />}
    </ImgWrapper>
    <Content>
      <span><Trans>Welcome to<br/>Holominds AI Agent</Trans></span>
      {isMobile && <span><Trans>Ask AI anything...</Trans></span>}
      {isMobile && <ShortcutsList />}
    </Content>
  </DefalutUiWrapper>
})
