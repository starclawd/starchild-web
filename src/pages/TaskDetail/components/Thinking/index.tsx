import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'
import { gradientFlow } from 'styles/animationStyled'
import { TYPING_ANIMATION_DURATION } from 'constants/index'
import { useTaskDetail } from 'store/backtest/hooks'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { handleGenerationMsg } from 'store/taskdetail/utils'
import Workflow from '../Workflow'
const DeepThinkWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0;
  gap: 20px;
  width: 800px;
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
      height: auto;
      max-height: ${vm(200)};
      padding: ${vm(8)};
      border-radius: ${vm(16)};
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

export default memo(function DeepThink({ setIsThinking }: { setIsThinking: (isThinking: boolean) => void }) {
  const [loadingPercent, setLoadingPercent] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [renderedContent, setRenderedContent] = useState<any[]>([])
  const [currentSpanText, setCurrentSpanText] = useState('')
  const animationInProgressRef = useRef(false)
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const scrollRef = useScrollbarClass<HTMLDivElement>()
  const [taskDetail] = useTaskDetail()
  const { generation_msg } = taskDetail
  const autoScrollEnabledRef = useRef(true)

  const isUserScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 自动滚动到底部
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current && autoScrollEnabledRef.current && !isUserScrollingRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [scrollRef])

  // 检查是否已经滚动到底部
  const isAtBottom = useCallback(() => {
    if (!scrollRef.current) return false
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    return Math.abs(scrollHeight - scrollTop - clientHeight) < 3
  }, [scrollRef])

  // 处理滚动事件
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return

    // 清除之前的定时器
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // 检查是否滚动到底部
    if (isAtBottom()) {
      autoScrollEnabledRef.current = true
      isUserScrollingRef.current = false
    } else {
      autoScrollEnabledRef.current = false
      isUserScrollingRef.current = true
    }
  }, [scrollRef, isAtBottom])

  const generationMsg = useMemo(() => {
    return handleGenerationMsg(generation_msg)
  }, [generation_msg])

  // 打字机效果渲染消息
  const startTypingAnimation = useCallback(() => {
    if (animationInProgressRef.current || generationMsg.length === 0) return

    animationInProgressRef.current = true
    let index = 0
    autoScrollEnabledRef.current = true // 开始动画时启用自动滚动

    // 根据消息数量和总时长动态计算每条消息的间隔时间
    const totalMessages = generationMsg.length
    const messageDelay = totalMessages > 0 ? Math.max(100, TYPING_ANIMATION_DURATION / totalMessages) : 800

    const typeNextMessage = () => {
      if (index >= generationMsg.length) {
        // 所有消息渲染完成
        animationInProgressRef.current = false
        setIsThinking(false)
        return
      }

      const currentMessage = generationMsg[index]

      // 更新span文本
      if (currentMessage.type === 'text') {
        setCurrentSpanText(currentMessage.content || 'AI思考中...')
      } else if (currentMessage.type === 'tool_result') {
        setCurrentSpanText('tool_result')
      } else if (currentMessage.type === 'todo_item') {
        setCurrentSpanText('TodoWrite')
      } else if (currentMessage.tool_name === 'TodoWrite') {
        setCurrentSpanText('TodoWrite')
      }

      // 添加到渲染内容
      setRenderedContent((prev) => [...prev, currentMessage])
      setCurrentIndex(index)

      // 在内容更新后滚动到底部
      setTimeout(scrollToBottom, 0)

      index++

      // 延迟渲染下一条消息
      setTimeout(typeNextMessage, messageDelay)
    }

    typeNextMessage()
  }, [generationMsg, setIsThinking, scrollToBottom])

  // 进度动画函数
  const animateLoading = useCallback(() => {
    if (generationMsg.length === 0) return

    const startTime = Date.now()
    const duration = TYPING_ANIMATION_DURATION + 1000 // 使用统一的动画时长

    const updateProgress = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // 从0%到100%的线性进度
      const currentPercent = progress * 100
      setLoadingPercent(currentPercent)

      if (progress < 1) {
        requestAnimationFrame(updateProgress)
      }
    }

    requestAnimationFrame(updateProgress)
  }, [generationMsg])
  // 添加滚动事件监听器
  useEffect(() => {
    const contentElement = scrollRef.current
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll)
      const scrollTimeout = scrollTimeoutRef.current
      return () => {
        contentElement.removeEventListener('scroll', handleScroll)
        scrollTimeout && clearTimeout(scrollTimeout)
      }
    }
  }, [scrollRef, handleScroll])

  // 组件挂载后自动开始动画
  useEffect(() => {
    if (generationMsg.length > 0) {
      animateLoading()
      startTypingAnimation()
    } else {
      // 如果没有消息，直接结束思考状态
      setIsThinking(false)
    }
    const typingInterval = typingIntervalRef.current
    return () => {
      animationInProgressRef.current = false
      if (typingInterval) {
        clearInterval(typingInterval)
      }
    }
  }, [animateLoading, startTypingAnimation, generationMsg, setIsThinking])

  return (
    <DeepThinkWrapper>
      <TopContent>
        <AnalyzeContent>
          <AnalyzeItem>
            <IconBase className='icon-chat-thinking' />
            <span>{currentSpanText}</span>
          </AnalyzeItem>
        </AnalyzeContent>
        <LoadingBarWrapper>
          <span style={{ width: `${loadingPercent}%` }} className='loading-progress'></span>
        </LoadingBarWrapper>
        <Workflow renderedContent={renderedContent} scrollRef={scrollRef as any} />
      </TopContent>
    </DeepThinkWrapper>
  )
})
