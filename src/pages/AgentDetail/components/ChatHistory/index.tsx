import dayjs from 'dayjs'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import Markdown from 'components/Markdown'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import useCopyContent from 'hooks/useCopyContent'
import { vm } from 'pages/helper'
import { useMemo, useRef } from 'react'
import { useIsGeneratingCode, useIsRunningBacktestAgent } from 'store/agentdetail/hooks'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { BorderBottom1PxBox } from 'styles/borderStyled'
import { useTimezone } from 'store/timezonecache/hooks'
import { useIsMobile } from 'store/application/hooks'
import Thinking from '../Thinking'
import NoData from 'components/NoData'
import { AgentDetailDataType, BacktestDataType } from 'store/agentdetail/agentdetail'
import CheckedLogs from '../CheckedLogs'

const ChatHistoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  height: 100%;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
      height: fit-content;
      min-width: 100%;
      overflow: unset;
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
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(28)};
      padding-bottom: ${vm(40)};
      margin-bottom: ${vm(40)};
      &:last-child {
        margin-bottom: 0;
        border-bottom: none;
      }
    `}
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 28px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(28)};
    `}
`

const Title = styled.div`
  .markdown-wrapper {
    font-size: 26px;
    font-weight: 500;
    line-height: 34px;
    color: ${({ theme }) => theme.textL1};
    em {
      font-style: normal;
    }
    ${({ theme }) =>
      theme.isMobile &&
      css`
        font-size: 0.26rem;
        line-height: 0.34rem;
      `}
  }
`

const UpdateTime = styled.div`
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.13rem;
      line-height: 0.2rem;
    `}
`

const Content = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
  color: ${({ theme }) => theme.textL2};
  ${({ theme }) =>
    theme.isMobile &&
    css`
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
  ${({ theme }) =>
    theme.isMobile
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

export default function ChatHistory({
  agentDetailData,
  backtestData,
}: {
  agentDetailData: AgentDetailDataType
  backtestData: BacktestDataType
}) {
  const theme = useTheme()
  const isMobile = useIsMobile()
  const [timezone] = useTimezone()
  const { trigger_history, check_log } = agentDetailData
  const isRunningBacktestAgent = useIsRunningBacktestAgent(agentDetailData, backtestData)
  const isGeneratingCode = useIsGeneratingCode(agentDetailData)
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])
  const { copyFromElement } = useCopyContent({ mode: 'element' })

  const list = useMemo(() => {
    return trigger_history.map((item: any) => {
      return {
        updateTime: item.trigger_time,
        content: item.message || item.error,
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
  if (!isMobile && (isGeneratingCode || isRunningBacktestAgent)) {
    return <Thinking agentDetailData={agentDetailData} backtestData={backtestData} />
  }
  if (list.length === 0 && check_log) {
    return <CheckedLogs agentDetailData={agentDetailData} />
  }
  return (
    <ChatHistoryWrapper className='scroll-style' ref={chatHistoryRef}>
      {list.length > 0 ? (
        list.map((item: any, index: number) => {
          const { updateTime, content, error } = item
          const splitContent = content.split('\n\n')
          const title = splitContent[0]
          const messageContent = splitContent.slice(1).join('\n\n')
          const formatTime = dayjs.tz(updateTime, timezone).format('YYYY-MM-DD HH:mm:ss')
          return (
            <ChatHistoryItem key={index} $borderColor={theme.lineDark8}>
              <ContentWrapper
                ref={(el) => {
                  contentRefs.current[index] = el
                }}
              >
                <Title>
                  <Markdown>{title}</Markdown>
                </Title>
                <UpdateTime>
                  <Trans>Trigger time: {formatTime}</Trans>
                </UpdateTime>
                <Content>
                  <Markdown>{messageContent}</Markdown>
                </Content>
              </ContentWrapper>
              <CopyWrapper onClick={() => handleCopy(index)}>
                <IconBase className='icon-chat-copy' />
                <Trans>Copy</Trans>
              </CopyWrapper>
            </ChatHistoryItem>
          )
        })
      ) : (
        <NoData />
      )}
    </ChatHistoryWrapper>
  )
}
