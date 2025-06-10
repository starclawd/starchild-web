import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import Markdown from 'components/Markdown'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import useCopyContent from 'hooks/useCopyContent'
import { vm } from 'pages/helper'
import { useMemo, useRef } from 'react'
import { useTaskDetail } from 'store/backtest/hooks'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { BorderBottom1PxBox } from 'styles/borderStyled'

const ChatHistoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  height: 100%;
  ${({ theme }) => theme.isMobile && css`
    width: 100%;
    min-width: 100%;
  `}
`

const ChatHistoryItem = styled(BorderBottom1PxBox)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 28px;
  padding-bottom: 40px;
  margin-bottom: 40px;
  &:last-child {
    margin-bottom: 0;
    border-bottom: none;
  }
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(28)};
    padding-bottom: ${vm(40)};
    margin-bottom: ${vm(40)};
  `}
`

const Title = styled.div`
  font-size: 26px;
  font-weight: 500;
  line-height: 34px; 
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) => theme.isMobile && css`
    font-size: 0.26rem;
    line-height: 0.34rem;
  `}
`

const UpdateTime = styled.div`
  font-size: 13px;
  font-weight: 400;
  line-height: 20px; 
  color: ${({ theme }) => theme.textL3};
  ${({ theme }) => theme.isMobile && css`
    font-size: 0.13rem;
    line-height: 0.2rem;
  `}
`

const Content = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
  color: ${({ theme }) => theme.textL2};
  .markdown-wrapper {
    > p:first-child {
      font-size: 26px;
      font-weight: 500;
      line-height: 34px; 
      color: ${({ theme }) => theme.textL1};
      em {
        font-style: normal;
      }
      ${({ theme }) => theme.isMobile && css`
        font-size: 0.26rem;
        line-height: 0.34rem;
      `}
    }
  }
  ${({ theme }) => theme.isMobile && css`
    font-size: 0.16rem;
    line-height: 0.26rem;
  `}
`

const CopyWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
  .icon-chat-copy {
    font-size: 18px;
    color: ${({ theme }) => theme.textL3};
  }
  ${({ theme }) => theme.isMobile
  ? css`
      gap: ${vm(4)};
      font-size: 0.14rem;
      line-height: 0.2rem;
      .icon-chat-copy {
        font-size: 0.18rem;
      }
    `
    : css`
      cursor: pointer;
    `}
`

export default function ChatHistory() {
  const theme = useTheme()
  const [{ trigger_history }] = useTaskDetail()
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])
  const { copyFromElement } = useCopyContent({ mode: 'element' })
  
  const list = useMemo(() => {
    const list = JSON.parse(trigger_history)
    return list.map((item: any) => {
      return {
        updateTime: item.trigger_time,
        content: item.message,
      }
    })
  }, [trigger_history])
  
  const handleCopy = (index: number) => {
    const contentElement = contentRefs.current[index]
    if (contentElement) {
      copyFromElement(contentElement)
    }
  }
  
  const chatHistoryRef = useScrollbarClass<HTMLDivElement>()
  return <ChatHistoryWrapper ref={chatHistoryRef} className="scroll-style">
    {list.map((item: any, index: number) => {
      const { title, updateTime, content } = item
      return <ChatHistoryItem
        key={index}
        $borderColor={theme.lineDark8}
      >
        <Content ref={(el) => { contentRefs.current[index] = el }}>
          <Markdown>
            {content}
          </Markdown>
        </Content>
        <UpdateTime>
          <Trans>Trigger time: {updateTime}</Trans>
        </UpdateTime>
        <CopyWrapper onClick={() => handleCopy(index)}>
          <IconBase className="icon-chat-copy" />
          <Trans>Copy</Trans>
        </CopyWrapper>
      </ChatHistoryItem>
    })}
  </ChatHistoryWrapper>
}
