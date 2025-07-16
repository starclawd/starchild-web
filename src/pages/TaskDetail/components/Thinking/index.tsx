import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'
import { gradientFlow } from 'styles/animationStyled'
import { TempAiContentDataType } from 'store/tradeai/tradeai'
import { TYPING_ANIMATION_DURATION } from 'constants/index'
import { useTaskDetail } from 'store/backtest/hooks'
import Markdown from 'components/Markdown'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
const DeepThinkWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0;
  gap: 20px;
  width: 800px;
  height: fit-content;
  padding: 16px;
  border-radius: 24px;
  background: ${({ theme }) => theme.bgL1};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
      gap: ${vm(20)};
      padding: ${vm(8)};
      border-radius: ${vm(16)};
    `}
`

const TopContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
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
  width: 100%;
  height: 14px;
  padding: 4px;
  border-radius: 16px;
  background: ${({ theme }) => theme.bgL0};
  .loading-progress {
    height: 100%;
    will-change: width;
    background: linear-gradient(90deg, #fff 0%, #2ff582 100%);
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
`

const AnalyzeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  .icon-chat-thinking {
    font-size: 24px;
    color: ${({ theme }) => theme.jade10};
    flex-shrink: 0;
  }
  span {
    max-width: 600px;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    background: linear-gradient(90deg, #fff 0%, #2ff582 100%);
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

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 500px;
  overflow-y: auto;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(20)};
      max-height: calc(100vh - ${vm(200)});
    `}
`

const ThinkItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
  .icon-chat-tell-more {
    margin-top: 2px;
    flex-shrink: 0;
    font-size: 18px;
    color: ${({ theme }) => theme.textL1};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      font-size: 0.12rem;
      line-height: 0.18rem;
      .icon-chat-tell-more {
        margin-top: ${vm(2)};
        font-size: 0.16rem;
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
  const { generation_msg, generation_status } = taskDetail

  // 自动滚动相关状态
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)
  const isUserScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 自动滚动到底部
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current && autoScrollEnabled && !isUserScrollingRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [scrollRef, autoScrollEnabled])

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
      setAutoScrollEnabled(true)
      isUserScrollingRef.current = false
    } else {
      setAutoScrollEnabled(false)
      isUserScrollingRef.current = true
    }
  }, [scrollRef, isAtBottom])

  const generationMsg = useMemo(() => {
    try {
      const list = JSON.parse(generation_msg) || []
      const expandedList: any[] = []

      list.forEach((item: string) => {
        if (item.startsWith('{') && item.endsWith('}')) {
          // Handle string-wrapped object like "{'key': 'value'}"
          try {
            // Replace single quotes with double quotes for valid JSON
            const jsonStr = item.replace(/'/g, '"')
            const parsedItem = JSON.parse(jsonStr)

            // 如果是 TodoWrite，展开每个 todo 为独立的消息项
            if (parsedItem.tool_name === 'TodoWrite' && parsedItem.tool_input?.todos) {
              parsedItem.tool_input.todos.forEach((todo: any) => {
                expandedList.push({
                  type: 'todo_item',
                  content: todo.content,
                  status: todo.status,
                  id: todo.id,
                })
              })
            } else {
              expandedList.push(parsedItem)
            }
          } catch {
            expandedList.push(item)
          }
        } else if (item.startsWith('##')) {
          // Handle markdown format
          expandedList.push({
            type: 'markdown',
            content: item,
          })
        } else {
          // Handle plain string
          expandedList.push({
            type: 'text',
            content: item,
          })
        }
      })

      return expandedList
    } catch (error) {
      return []
    }
  }, [generation_msg])

  // 打字机效果渲染消息
  const startTypingAnimation = useCallback(() => {
    if (animationInProgressRef.current || generationMsg.length === 0) return

    animationInProgressRef.current = true
    let index = 0
    setAutoScrollEnabled(true) // 开始动画时启用自动滚动

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

  // 渲染Content内容
  const renderContentItems = useCallback(() => {
    return (
      <Content ref={scrollRef} className='scroll-style'>
        {renderedContent.map((item, index) => {
          if (item.type === 'tool_result') {
            return (
              <ThinkItem key={index}>
                <IconBase className='icon-chat-tell-more' />
                <Markdown>{item.content}</Markdown>
              </ThinkItem>
            )
          } else if (item.type === 'todo_item') {
            return (
              <ThinkItem key={index}>
                <IconBase className='icon-chat-tell-more' />
                <Markdown>{item.content}</Markdown>
              </ThinkItem>
            )
          }
          return null
        })}
      </Content>
    )
  }, [renderedContent, scrollRef])

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
        {renderContentItems()}
      </TopContent>
    </DeepThinkWrapper>
  )
})
