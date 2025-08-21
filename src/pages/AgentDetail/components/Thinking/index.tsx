import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import { useIsRunningBacktestAgent } from 'store/agentdetail/hooks'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { handleGenerationMsg } from 'store/agentdetail/utils'
import Workflow from '../Workflow'
import usePrevious from 'hooks/usePrevious'
import { Trans } from '@lingui/react/macro'
import { AgentDetailDataType, BacktestDataType } from 'store/agentdetail/agentdetail'
import ThinkingProgress from 'pages/Chat/components/ThinkingProgress'
const DeepThinkWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 0;
  padding: 0;
  gap: 20px;
  width: 100%;
  height: fit-content;
  max-height: 100%;
  padding: 16px;
  border-radius: 24px;
  background: ${({ theme }) => theme.black700};
  overflow: hidden;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
      gap: ${vm(20)};
      flex-grow: 0;
      height: fit-content;
      max-height: ${vm(200)};
      padding: 0;
      border-radius: ${vm(16)};
      margin-top: ${vm(12)};
    `}
`

const TopContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 12px;
  overflow: hidden;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
      .thinking-progress-wrapper {
        padding: ${vm(16)};
        border-radius: ${vm(16)};
        border: 1px solid ${({ theme }) => theme.bgT30};
      }
    `}
`

export default memo(function DeepThink({
  agentDetailData,
  backtestData,
}: {
  agentDetailData: AgentDetailDataType
  backtestData: BacktestDataType
}) {
  const scrollRef = useScrollbarClass<HTMLDivElement>()
  const { generation_msg } = agentDetailData
  const autoScrollEnabledRef = useRef(true)
  const isUserScrollingRef = useRef(false)

  const isRunningBacktestAgent = useIsRunningBacktestAgent(agentDetailData, backtestData)
  // 打字机效果相关状态
  const [displayedMessages, setDisplayedMessages] = useState<any[]>([])
  const [isTyping, setIsTyping] = useState(false)
  // const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const prevDisplayedMessages = usePrevious(displayedMessages)

  const generationMsg = useMemo(() => {
    return handleGenerationMsg(generation_msg)
  }, [generation_msg])

  const prevGenerationMsg = usePrevious(generationMsg)

  // 比较新旧消息，找出新增项
  const newMessages = useMemo(() => {
    if (!prevGenerationMsg || prevGenerationMsg.length === 0) {
      return []
    }

    // 找出新增的消息（长度差异部分）
    if (generationMsg.length > prevGenerationMsg.length) {
      return generationMsg.slice(prevGenerationMsg.length)
    }

    // 如果最后一项内容发生变化，也视为新增
    if (generationMsg.length === prevGenerationMsg.length && generationMsg.length > 0) {
      const lastIndex = generationMsg.length - 1
      const currentLast = generationMsg[lastIndex]
      const prevLast = prevGenerationMsg[lastIndex]

      if (JSON.stringify(currentLast) !== JSON.stringify(prevLast)) {
        return [currentLast]
      }
    }

    return []
  }, [generationMsg, prevGenerationMsg])

  // 打字机效果实现
  const typewriterEffect = useCallback((message: any, messageIndex: number) => {
    // 非文本类型直接显示
    setDisplayedMessages((prev) => {
      const newMessages = [...prev]
      newMessages[messageIndex] = message
      return newMessages
    })
    setIsTyping(false)
  }, [])
  // 处理新消息
  useEffect(() => {
    if (newMessages.length > 0) {
      // 如果是完全新的消息列表，重置显示
      if (!prevGenerationMsg) {
        setDisplayedMessages([])
      }

      // 逐个添加新消息并应用打字机效果
      newMessages.forEach((message, index) => {
        const messageIndex = (prevGenerationMsg?.length || 0) + index

        setTimeout(() => {
          // 先添加空的消息位置
          setDisplayedMessages((prev) => {
            const newMessages = [...prev]
            newMessages[messageIndex] = { ...message, content: message.type === 'text' ? '' : message.content }
            return newMessages
          })

          // 然后应用打字机效果
          setTimeout(() => {
            typewriterEffect(message, messageIndex)
          }, 100)
        }, index * 200) // 每个新消息延迟200ms开始
      })
    }
  }, [newMessages, prevGenerationMsg, typewriterEffect])

  // 初始化显示消息
  useEffect(() => {
    if (generationMsg.length > 0 && displayedMessages.length === 0) {
      setDisplayedMessages(generationMsg)
    }
  }, [generationMsg, displayedMessages.length])

  const currentSpanText = useMemo(() => {
    const lastMessage = displayedMessages[displayedMessages.length - 1]
    if (lastMessage?.type === 'text') {
      return lastMessage.content || (isTyping ? 'Generating...' : '')
    } else if (lastMessage?.type === 'tool_result') {
      return 'tool_result'
    } else if (lastMessage?.type === 'todo_item') {
      return 'TodoWrite'
    } else if (lastMessage?.tool_name === 'TodoWrite') {
      return 'TodoWrite'
    }
    return ''
  }, [displayedMessages, isTyping])

  // 自动滚动到底部
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current && autoScrollEnabledRef.current && !isUserScrollingRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [scrollRef])

  useEffect(() => {
    if (displayedMessages.length !== prevDisplayedMessages?.length) {
      scrollToBottom()
    }
  }, [displayedMessages.length, prevDisplayedMessages?.length, scrollToBottom])

  return (
    <DeepThinkWrapper>
      <TopContent>
        <ThinkingProgress
          loadingText={
            isRunningBacktestAgent ? (
              <Trans>Running Backtest Code...</Trans>
            ) : (
              currentSpanText || <Trans>Code Generation...</Trans>
            )
          }
        />
        {!isRunningBacktestAgent && (
          <Workflow
            renderedContent={displayedMessages}
            scrollRef={scrollRef as any}
            agentDetailData={agentDetailData}
          />
        )}
      </TopContent>
    </DeepThinkWrapper>
  )
})
