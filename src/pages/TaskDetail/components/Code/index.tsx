import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import useCopyContent from 'hooks/useCopyContent'
import { vm } from 'pages/helper'
import { memo, useCallback, useMemo, useState, useEffect, useRef } from 'react'
import { useTaskDetail } from 'store/backtest/hooks'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import NoData from 'components/NoData'
import MemoizedHighlight from 'components/MemoizedHighlight'
import { useSleep } from 'hooks/useSleep'
import { TYPING_ANIMATION_DURATION } from 'constants/index'

const CodeWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex-shrink: 0;
    `}
`

const Title = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  height: 72px;
  padding: 16px;
  color: ${({ theme }) => theme.textL1};
  background-color: ${({ theme }) => theme.black700};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
      height: ${vm(72)};
      padding: ${vm(16)};
    `}
`

const TitleTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.18rem;
      line-height: 0.26rem;
    `}
`

const CodeDes = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  color: ${({ theme }) => theme.textL4};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.12rem;
      line-height: 0.18rem;
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

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
  padding-right: 4px;
  background-color: ${({ theme }) => theme.bgT10};
`

const Content = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 16px;
  flex-grow: 1;
  min-height: 0;
  width: 100%;
  margin-right: 0 !important;
  .no-data-wrapper {
    background-color: transparent;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(16)};
    `}
`

export default memo(function Code() {
  const theme = useTheme()
  const [{ code }] = useTaskDetail()
  const contentRef = useScrollbarClass<HTMLDivElement>()

  // 从 markdown 代码块中提取纯代码内容，或处理转义的换行符
  const extractExecutableCode = useCallback((codeContent: string) => {
    if (!codeContent) return ''

    // 首先检查是否是 markdown 代码块格式
    const codeBlockRegex = /```[\w]*\n?([\s\S]*?)```/g
    const matches = codeContent.match(codeBlockRegex)

    if (matches && matches.length > 0) {
      // 提取第一个代码块的内容
      const firstMatch = matches[0]
      // 去掉开头的```language和结尾的```
      const cleanCode = firstMatch
        .replace(/^```[\w]*\n?/, '') // 去掉开头的```和语言标识
        .replace(/```$/, '') // 去掉结尾的```
        .trim()
      return cleanCode
    }

    // 如果不是 markdown 格式，检查是否包含转义的换行符
    if (codeContent.includes('\\n')) {
      // 将转义的换行符转换为实际的换行符
      return codeContent
        .replace(/\\n/g, '\n') // 转义的换行符
        .replace(/\\t/g, '\t') // 转义的制表符
        .replace(/\\r/g, '\r') // 转义的回车符
        .replace(/\\"/g, '"') // 转义的双引号
        .replace(/\\'/g, "'") // 转义的单引号
        .replace(/\\\\/g, '\\') // 转义的反斜杠
    }

    // 其他情况直接返回原内容
    return codeContent
  }, [])

  const { copyWithCustomProcessor } = useCopyContent({
    mode: 'custom',
    customProcessor: extractExecutableCode,
  })

  const codeContent = useMemo(() => {
    return extractExecutableCode(code)
  }, [code, extractExecutableCode])

  // 打字机效果状态
  const [displayedContent, setDisplayedContent] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const currentContentRef = useRef('')
  const isExecutingRef = useRef(false)
  const sleep = useSleep()

  // 自动滚动相关状态
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)
  const isUserScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 自动滚动到底部
  const scrollToBottom = useCallback(() => {
    if (contentRef.current && autoScrollEnabled && !isUserScrollingRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }, [contentRef, autoScrollEnabled])

  // 检查是否已经滚动到底部
  const isAtBottom = useCallback(() => {
    if (!contentRef.current) return false
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current
    return Math.abs(scrollHeight - scrollTop - clientHeight) < 3
  }, [contentRef])

  // 处理滚动事件
  const handleScroll = useCallback(() => {
    if (!contentRef.current) return

    // 清除之前的定时器
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // 标记用户正在滚动

    // 检查是否滚动到底部
    if (isAtBottom()) {
      setAutoScrollEnabled(true)
      isUserScrollingRef.current = false
    } else {
      setAutoScrollEnabled(false)
      isUserScrollingRef.current = true
    }

    // // 300ms后认为用户停止滚动
    // scrollTimeoutRef.current = setTimeout(() => {
    //   isUserScrollingRef.current = false
    // }, 300)
  }, [contentRef, isAtBottom])

  // 打字机效果逻辑
  const typeWriterEffect = useCallback(
    async (content: string) => {
      if (!content) {
        setDisplayedContent('')
        currentContentRef.current = ''
        return
      }

      // 防止重复执行相同内容
      if (content === currentContentRef.current && isExecutingRef.current) {
        return
      }

      // 如果正在执行其他内容，停止当前执行
      if (isExecutingRef.current) {
        isExecutingRef.current = false
        await sleep(50) // 等待当前执行停止
      }

      currentContentRef.current = content
      isExecutingRef.current = true
      setIsTyping(true)
      setDisplayedContent('')
      setAutoScrollEnabled(true) // 开始打字时启用自动滚动

      let index = 0
      const sliceText = (startIndex: number, endIndex: number) => {
        return content.slice(startIndex * 5, endIndex * 5)
      }

      // 计算总步数和每步延迟时间
      const totalSteps = Math.ceil(content.length / 5)
      const stepDelay = totalSteps > 0 ? Math.max(10, TYPING_ANIMATION_DURATION / totalSteps) : 17

      while (sliceText(index, index + 1) && isExecutingRef.current) {
        const text = sliceText(index, index + 1)
        index += 1

        if (text && isExecutingRef.current) {
          setDisplayedContent((prev) => prev + text)
          // 在更新内容后滚动到底部
          setTimeout(scrollToBottom, 0)
          await sleep(stepDelay)
        }
      }

      if (isExecutingRef.current) {
        setIsTyping(false)
        isExecutingRef.current = false
      }
    },
    [sleep, scrollToBottom],
  )

  // 当 codeContent 变化时触发打字机效果
  useEffect(() => {
    if (codeContent && codeContent !== currentContentRef.current) {
      typeWriterEffect(codeContent)
    } else if (!codeContent) {
      setDisplayedContent('')
      setIsTyping(false)
      currentContentRef.current = ''
      isExecutingRef.current = false
    }
  }, [codeContent, typeWriterEffect])

  // 添加滚动事件监听器
  useEffect(() => {
    const contentElement = contentRef.current
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll)
      const scrollTimeout = scrollTimeoutRef.current
      return () => {
        contentElement.removeEventListener('scroll', handleScroll)
        scrollTimeout && clearTimeout(scrollTimeout)
      }
    }
  }, [contentRef, handleScroll])

  // 复制代码的处理函数
  const handleCopyCode = useCallback(() => {
    if (code) {
      copyWithCustomProcessor(code)
    }
  }, [code, copyWithCustomProcessor])

  return (
    <CodeWrapper $borderColor={theme.bgT30} $borderRadius={24}>
      <Title>
        <TitleTop>
          <Trans>Code</Trans>
          <CopyWrapper onClick={handleCopyCode}>
            <IconBase className='icon-chat-copy' />
            <Trans>Copy</Trans>
          </CopyWrapper>
        </TitleTop>
        <CodeDes>
          <Trans>The code is generated by AI, executed inside a container.</Trans>
        </CodeDes>
      </Title>
      <ContentWrapper>
        <Content ref={contentRef} className={!theme.isMobile ? 'scroll-style' : ''}>
          {code ? <MemoizedHighlight className='python'>{displayedContent}</MemoizedHighlight> : <NoData />}
        </Content>
      </ContentWrapper>
    </CodeWrapper>
  )
})
