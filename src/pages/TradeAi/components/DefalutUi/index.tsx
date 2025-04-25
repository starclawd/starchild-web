import styled, { css } from 'styled-components'
import { memo, useCallback } from 'react'
import suggestImg from 'assets/tradeai/suggest.png'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'
import { t } from '@lingui/core/macro'
import { useSendAiContent } from 'store/tradeai/hooks'
const DefalutUiWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex-grow: 1;
`

const ImgWrapper = styled.div`
  ${({ theme }) => theme.isMobile && css`
    position: absolute;
    top: ${vm(50)};
    left: 0;
    width: 100%;
    height: auto;
    img {
      width: 100%;
      height: auto;
      z-index: 1;
    }
    .icon-chat-default-ui {
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
  ${({ theme }) => theme.isMobile && css`
    width: 100%;
    > span:first-child {
      font-size: 0.32rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.34rem;
      text-align: center;
      margin-bottom: ${vm(20)};
      color: ${theme.textL1};
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
  `}
`

const ShortcutsList = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  width: 100%;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(10)};
    padding-bottom: ${vm(24)};
  `}
`

const ShortcutsItem = styled.div`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
  `}
`

const ShortcutsItemItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  ${({ theme }) => theme.isMobile && css`
    height: ${vm(36)};
    padding: ${vm(8)} ${vm(12)};
    border-radius: ${vm(12)};
    background: ${({ theme }) => theme.brand6};
    color: ${theme.textL1};
    font-size: .14rem;
    font-weight: 400;
    line-height: .2rem;
  `}
`

export default memo(function DefalutUi() {
  const sendAiContent = useSendAiContent()
  const shortcutsList = [
    {
      key: '1',
      list: [
        {
          key: 'What security incidents have happened recently in crypto?',
          text: t`What security incidents have happened recently in crypto?`,
        },
        {
          key: 'Which sectors are outperforming in the crypto market?',
          text: t`Which sectors are outperforming in the crypto market?`,
        },
      ]
    },
    {
      key: '2',
      list: [
        {
          key: 'What s the correlation between crypto and traditional markets?',
          text: t`What's the correlation between crypto and traditional markets?`,
        },
        {
          key: 'What security incidents have happened recently in crypto?',
          text: t`What security incidents have happened recently in crypto?`,
        },
      ]
    },
    {
      key: '3',
      list: [
        {
          key: 'What are the biggest whales buying or selling?',
          text: t`What are the biggest whales buying or selling?`,
        },
        {
          key: 'What s the latest news about Bitcoin ETFs?',
          text: t`What's the latest news about Bitcoin ETFs?`,
        },
        {
          key: 'How is AI being integrated with blockchain technology?',
          text: t`How is AI being integrated with blockchain technology?`,
        },
      ]
    },
  ]
  const sendContent = useCallback((text: string) => {
    sendAiContent({
      value: text,
    })
  }, [sendAiContent])
  return <DefalutUiWrapper>
    <ImgWrapper>
      <img src={suggestImg} alt="" />
      <IconBase className="icon-chat-default-ui" />
      <IconBase className="icon-chat-default-ui" />
    </ImgWrapper>
    <Content>
      <span><Trans>Welcome to<br/>Holominds AI Agent</Trans></span>
      <span><Trans>Ask AI anything...</Trans></span>
      <ShortcutsList>
        {
          shortcutsList.map((item) => (
            <ShortcutsItem key={item.key}>
              {item.list.map((item) => (
                <ShortcutsItemItem key={item.key} onClick={() => sendContent(item.text)}>
                  {item.text}
                </ShortcutsItemItem>
              ))}
            </ShortcutsItem>
          ))
        }
      </ShortcutsList>
    </Content>
  </DefalutUiWrapper>
})
