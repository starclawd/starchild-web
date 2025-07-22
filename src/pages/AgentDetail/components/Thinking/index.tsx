import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'
import { gradientFlow } from 'styles/animationStyled'
import { useIsRunningBacktestAgent } from 'store/agentdetail/hooks'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { handleGenerationMsg } from 'store/agentdetail/utils'
import Workflow from '../Workflow'
import usePrevious from 'hooks/usePrevious'
import { Trans } from '@lingui/react/macro'
import { AgentDetailDataType, BacktestDataType } from 'store/agentdetail/agentdetail'
const DeepThinkWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 0;
  padding: 0;
  gap: 20px;
  width: 100%;
  max-width: 800px;
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
      padding: ${vm(8)};
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
    `}
`

const LoadingBarWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 100%;
  height: 14px;
  padding: 4px;
  border-radius: 16px;
  background: ${({ theme }) => theme.bgL0};
  .loading-progress {
    height: 100%;
    will-change: width;
    background: linear-gradient(90deg, #fff 0%, #00a9de 100%);
    border-radius: 4px;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(14)};
      padding: ${vm(4)};
      border-radius: ${vm(16)};
      .loading-progress {
        border-radius: ${vm(4)};
      }
    `}
`

const AnalyzeContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`

const AnalyzeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  .icon-chat-thinking {
    font-size: 24px;
    color: ${({ theme }) => theme.blue100};
    flex-shrink: 0;
  }
  span {
    max-width: 600px;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    background: linear-gradient(90deg, #fff 0%, #00a9de 100%);
    background-size: 200% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ${gradientFlow} 1s linear infinite;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
      .icon-chat-thinking {
        font-size: 0.24rem;
      }
      span {
        max-width: ${vm(300)};
        font-size: 0.14rem;
        font-weight: 400;
        line-height: 0.2rem;
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
  const [loadingPercent, setLoadingPercent] = useState(0)
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
    // if (message.type === 'text' && message.content) {
    //   const content = message.content
    //   let charIndex = 0

    //   const typeNextChar = () => {
    //     if (charIndex <= content.length) {
    //       setDisplayedMessages((prev) => {
    //         const newMessages = [...prev]
    //         if (newMessages[messageIndex]) {
    //           newMessages[messageIndex] = {
    //             ...message,
    //             content: content.slice(0, charIndex),
    //           }
    //         }
    //         return newMessages
    //       })

    //       charIndex++

    //       if (charIndex <= content.length) {
    //         typingTimeoutRef.current = setTimeout(typeNextChar, 30) // 每30ms显示一个字符
    //       } else {
    //         setIsTyping(false)
    //       }
    //     }
    //   }

    //   setIsTyping(true)
    //   typeNextChar()
    // } else {
    // }
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

  // 进度动画函数
  const animateLoading = useCallback(() => {
    const startTime = Date.now()
    const intervalDuration = 120000 // 60秒一个周期

    const updateProgress = () => {
      const now = Date.now()
      const elapsed = now - startTime

      // 计算当前是第几个周期
      const currentCycle = Math.floor(elapsed / intervalDuration)
      // 当前周期内的进度 (0-1)
      const cycleProgress = (elapsed % intervalDuration) / intervalDuration

      // 计算当前进度百分比
      let currentPercent = 0

      // 每个周期走剩余的60%
      for (let i = 0; i <= currentCycle; i++) {
        const remaining = 100 - currentPercent
        if (i === currentCycle) {
          // 当前周期：根据cycleProgress计算部分进度
          currentPercent += remaining * 0.6 * cycleProgress
        } else {
          // 已完成的周期：直接加上60%的剩余
          currentPercent += remaining * 0.6
        }
      }

      // 确保不超过99%（永远不到100%）
      currentPercent = Math.min(currentPercent, 99)
      setLoadingPercent(currentPercent)

      // 继续动画直到外部停止
      requestAnimationFrame(updateProgress)
    }

    requestAnimationFrame(updateProgress)
  }, [])

  useEffect(() => {
    if (displayedMessages.length !== prevDisplayedMessages?.length) {
      scrollToBottom()
    }
  }, [displayedMessages.length, prevDisplayedMessages?.length, scrollToBottom])

  useEffect(() => {
    animateLoading()
  }, [animateLoading])

  return (
    <DeepThinkWrapper>
      <TopContent>
        <AnalyzeContent>
          <AnalyzeItem>
            <IconBase className='icon-chat-thinking' />
            <span>
              {isRunningBacktestAgent ? (
                <Trans>Running Backtest Code...</Trans>
              ) : (
                currentSpanText || <Trans>Code Generation...</Trans>
              )}
            </span>
          </AnalyzeItem>
        </AnalyzeContent>
        <LoadingBarWrapper>
          <span style={{ width: `${loadingPercent}%` }} className='loading-progress'></span>
        </LoadingBarWrapper>
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
