import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import useCopyContent from 'hooks/useCopyContent'
import { vm } from 'pages/helper'
import { memo, useCallback, useMemo, useState, useEffect, useRef } from 'react'
import { useIsCodeTaskType, useTaskDetail } from 'store/backtest/hooks'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import NoData from 'components/NoData'
import MemoizedHighlight from 'components/MemoizedHighlight'
import { useSleep } from 'hooks/useSleep'
import { TYPING_ANIMATION_DURATION } from 'constants/index'
import { useIsMobile } from 'store/application/hooks'
import MoveTabList from 'components/MoveTabList'
import Workflow from '../Workflow'
import { handleGenerationMsg } from 'store/taskdetail/utils'
import { GENERATION_STATUS, TASK_TYPE } from 'store/backtest/backtest'

const CodeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
  .tab-list-wrapper {
    .active-indicator {
      border-radius: 8px;
    }
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex-shrink: 0;
      height: 10px;
    `}
`

const WorkflowTitle = styled.div`
  flex-shrink: 0;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.2rem;
      line-height: 0.28rem;
    `}
`

const WorkflowContent = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
`

const CodeContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
`

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  height: 32px;
  padding: 0 16px;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  margin-top: 8px;
  border-radius: 6px;
  color: ${({ theme }) => theme.textL4};
  background-color: ${({ theme }) => theme.bgT20};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: auto;
      padding: ${vm(4)} ${vm(8)};
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
  margin-top: 20px;
`

const Content = styled.div`
  display: flex;
  overflow: auto;
  flex-grow: 1;
  min-height: 0;
  width: 100%;
  margin-right: 0 !important;
  .no-data-wrapper {
    width: 100%;
    height: 100%;
    background-color: transparent;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(16)};
    `}
`

export default memo(function Code() {
  const sleep = useSleep()
  const contentRef = useScrollbarClass<HTMLDivElement>()
  const [tabIndex, setTabIndex] = useState(1)
  const isCodeTaskType = useIsCodeTaskType()

  // 打字机效果状态
  const [displayedContent, setDisplayedContent] = useState('')
  const currentContentRef = useRef('')
  const isExecutingRef = useRef(false)
  const [{ code, generation_msg, generation_status, task_type }] = useTaskDetail()

  // 用于跟踪 generation_status 的上一个状态
  const prevGenerationStatusRef = useRef<string | undefined>(generation_status)

  // 自动滚动相关状态
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  const generationMsg = useMemo(() => {
    return handleGenerationMsg(generation_msg)
  }, [generation_msg])

  const changeTabIndex = useCallback((index: number) => {
    return () => {
      setTabIndex(index)
    }
  }, [])

  const tabList = useMemo(() => {
    return [
      {
        key: 0,
        text: <Trans>Workflow</Trans>,
        clickCallback: changeTabIndex(0),
      },
      {
        key: 1,
        text: <Trans>Code</Trans>,
        clickCallback: changeTabIndex(1),
      },
    ]
  }, [changeTabIndex])

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

  // 自动滚动到底部
  const scrollToBottom = useCallback(() => {
    if (contentRef.current && shouldAutoScroll) {
      requestAnimationFrame(() => {
        contentRef.current?.scrollTo(0, contentRef.current.scrollHeight)
      })
    }
  }, [contentRef, shouldAutoScroll])

  // 处理滚动事件
  const handleScroll = useCallback(() => {
    if (!contentRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current
    // 如果用户向上滚动超过10px，则停止自动滚动
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 10
    setShouldAutoScroll(isAtBottom)
  }, [contentRef])

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
      setDisplayedContent('')
      setShouldAutoScroll(true) // 开始打字时启用自动滚动

      // 开始时先滚动到底部
      requestAnimationFrame(() => scrollToBottom())

      // Web端使用打字机效果
      let index = 0

      // 动态计算每步字符数和延迟时间，确保总时间为TYPING_ANIMATION_DURATION
      const minStepDelay = 10 // 最小延迟10ms保证性能
      const maxSteps = Math.floor(TYPING_ANIMATION_DURATION / minStepDelay) // 最大步数
      const charsPerStep = Math.max(1, Math.ceil(content.length / maxSteps)) // 每步字符数
      const totalSteps = Math.ceil(content.length / charsPerStep) // 实际总步数
      const stepDelay = totalSteps > 0 ? TYPING_ANIMATION_DURATION / totalSteps : 17 // 每步延迟

      const sliceText = (startIndex: number, endIndex: number) => {
        return content.slice(startIndex * charsPerStep, endIndex * charsPerStep)
      }

      while (sliceText(index, index + 1) && isExecutingRef.current) {
        const text = sliceText(index, index + 1)
        index += 1

        if (text && isExecutingRef.current) {
          setDisplayedContent((prev) => prev + text)
          // 在更新内容后滚动到底部
          requestAnimationFrame(() => scrollToBottom())
          await sleep(stepDelay)
        }
      }

      if (isExecutingRef.current) {
        isExecutingRef.current = false
        // 确保打字机效果完成后滚动到底部
        requestAnimationFrame(() => scrollToBottom())
      }
    },
    [sleep, scrollToBottom],
  )

  // 监听 generation_status 变化，只在从 pending 变为 success 时触发打字机效果
  useEffect(() => {
    const prevStatus = prevGenerationStatusRef.current
    const currentStatus = generation_status

    // 更新上一个状态的记录
    prevGenerationStatusRef.current = currentStatus

    // 只有当状态从 pending 变为 success 时才触发打字机效果
    if (prevStatus === 'pending' && currentStatus === 'success' && codeContent && isCodeTaskType) {
      typeWriterEffect(codeContent)
    } else {
      setDisplayedContent(codeContent)
    }
  }, [generation_status, codeContent, isCodeTaskType, typeWriterEffect])

  // 添加滚动事件监听器
  useEffect(() => {
    const contentElement = contentRef.current
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll)
      return () => {
        contentElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [contentRef, handleScroll])

  // 复制代码的处理函数
  const handleCopyCode = useCallback(() => {
    if (code) {
      copyWithCustomProcessor(code)
    }
  }, [code, copyWithCustomProcessor])

  useEffect(() => {
    if (!isCodeTaskType) {
      setTabIndex(0)
    }
  }, [isCodeTaskType])

  return (
    <CodeWrapper>
      {!isCodeTaskType ? (
        <WorkflowTitle>
          <Trans>Workflow</Trans>
        </WorkflowTitle>
      ) : (
        <MoveTabList tabIndex={tabIndex} tabList={tabList} borderRadius={12} />
      )}
      {tabIndex === 0 && <Workflow renderedContent={generationMsg} scrollRef={null as any} />}
      {tabIndex === 1 && (
        <CodeContent>
          <Title>
            <Trans>The code is generated by AI, executed inside a container.</Trans>
            <CopyWrapper onClick={handleCopyCode}>
              <IconBase className='icon-chat-copy' />
              <Trans>Copy</Trans>
            </CopyWrapper>
          </Title>
          <ContentWrapper>
            <Content ref={contentRef} className='scroll-style'>
              {code ? <MemoizedHighlight className='python'>{displayedContent}</MemoizedHighlight> : <NoData />}
            </Content>
          </ContentWrapper>
        </CodeContent>
      )}
    </CodeWrapper>
  )
})
