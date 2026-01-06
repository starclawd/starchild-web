import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GENERATION_STATUS } from 'store/createstrategy/createstrategy'
import {
  useCodeLoadingPercent,
  useHandleGenerateCode,
  useIsGeneratingCode,
  useIsTypewritingCode,
  useStrategyCode,
} from 'store/createstrategy/hooks/useCode'
import useParsedQueryString from 'hooks/useParsedQueryString'
import MemoizedHighlight from 'components/MemoizedHighlight'
import { IconBase } from 'components/Icons'
import useCopyContent from 'hooks/useCopyContent'
import { extractExecutableCode } from 'utils/extractExecutableCode'
import { ButtonBorder } from 'components/Button'
import codeBg from 'assets/createstrategy/code-bg.png'
import ThinkingProgress from 'pages/Chat/components/ThinkingProgress'
import Pending from 'components/Pending'

// 打字机效果的速度（每个字符的间隔时间，单位毫秒）
const TYPEWRITER_SPEED = 17
// 每次添加的字符数
const TYPEWRITER_CHARS_PER_TICK = 10

const CodeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  gap: 12px;
  width: 100%;
  height: 40px;
  border-left: 1px solid ${({ theme }) => theme.black800};
  border-bottom: 1px solid ${({ theme }) => theme.black800};
`

const Left = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  gap: 4px;
  padding: 0 12px;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.green200};
  .icon-circle-success {
    font-size: 18px;
    color: ${({ theme }) => theme.green200};
  }
`

const OperatorWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`

const RegenerateButton = styled(ButtonBorder)`
  height: 100%;
  padding: 0 12px;
  border: none;
`

const CopyButton = styled(ButtonBorder)`
  height: 100%;
  padding: 0 12px;
  border: none;
`

const CodeContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 12px;
  padding: 20px;
  padding-right: 20px !important;
  background-size: 540px 540px;
  background-repeat: no-repeat;
  background-position: center;
  code.hljs {
    padding: 0 !important;
  }
`

const LoadingWrapper = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.black800};
  padding: 16px;
`

export default memo(function Code() {
  const { strategyId } = useParsedQueryString()
  const { strategyCode, refetch: refetchStrategyCode } = useStrategyCode({ strategyId: strategyId || '' })
  const [isGeneratingCodeFrontend] = useIsGeneratingCode()
  const handleGenerateCode = useHandleGenerateCode()
  const [codeLoadingPercent, setCodeLoadingPercent] = useCodeLoadingPercent()
  const { external_code, generation_status } = strategyCode || { external_code: '', generation_status: null }
  const { copyWithCustomProcessor } = useCopyContent({
    mode: 'custom',
    customProcessor: extractExecutableCode,
  })

  // 打字机效果相关状态
  const [isTypewriting, setIsTypewriting] = useIsTypewritingCode()
  const [typewriterCode, setTypewriterCode] = useState('')
  const typewriterIndexRef = useRef(0)
  const targetCodeRef = useRef('')
  // 用于记录 isGeneratingCodeFrontend 是否曾经为 true（用于判断是否应该启动打字机效果）
  const hasBeenGeneratingRef = useRef(false)
  // 用于记录旧的 external_code（用于对比是否有变化）
  const prevExternalCodeRef = useRef<string | null>(null)

  // 自动滚动相关状态
  const codeContentRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  const isGeneratingCodeStatus = useMemo(() => {
    return generation_status === GENERATION_STATUS.GENERATING
  }, [generation_status])

  // 处理滚动事件，检测用户是否手动向上滚动
  const handleScroll = useCallback(() => {
    if (!codeContentRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = codeContentRef.current
    // 计算距离底部的距离
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    // 如果用户向上滚动超过10px，则停止自动滚动
    const isAtBottom = distanceFromBottom < 10
    setShouldAutoScroll(isAtBottom)
  }, [])

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    if (codeContentRef.current && shouldAutoScroll) {
      requestAnimationFrame(() => {
        codeContentRef.current?.scrollTo({
          top: codeContentRef.current.scrollHeight,
          behavior: 'auto',
        })
      })
    }
  }, [shouldAutoScroll])

  // 记录 isGeneratingCodeFrontend 是否曾经为 true
  useEffect(() => {
    if (isGeneratingCodeFrontend) {
      hasBeenGeneratingRef.current = true
    }
  }, [isGeneratingCodeFrontend])

  // 启动打字机效果（与 Summary 组件逻辑一致）
  useEffect(() => {
    if (!external_code || generation_status !== GENERATION_STATUS.COMPLETED) return

    const prevCode = prevExternalCodeRef.current

    // 检查是否需要启动打字机效果
    const shouldStartTypewriter = () => {
      // 如果刷新页面时 isGeneratingCodeFrontend 从未为 true，则直接渲染完整内容
      if (!hasBeenGeneratingRef.current) {
        return false
      }

      // 首次有 external_code 数据，启动打字机
      if (prevCode === null) {
        return true
      }

      // 重新生成代码：isGeneratingCodeFrontend 为 true 且 external_code 发生变化
      if (isGeneratingCodeFrontend && prevCode !== external_code) {
        return true
      }

      return false
    }

    if (shouldStartTypewriter()) {
      // 开始打字机效果
      setIsTypewriting(true)
      setTypewriterCode('')
      typewriterIndexRef.current = 0
      targetCodeRef.current = external_code
    }

    // 更新旧的 external_code
    prevExternalCodeRef.current = external_code
  }, [external_code, generation_status, isGeneratingCodeFrontend, setIsTypewriting])

  // 打字机效果的实现
  useEffect(() => {
    if (!isTypewriting || !targetCodeRef.current) return

    const targetCode = targetCodeRef.current
    const totalLength = targetCode.length

    const intervalId = setInterval(() => {
      typewriterIndexRef.current += TYPEWRITER_CHARS_PER_TICK
      const currentIndex = typewriterIndexRef.current

      if (currentIndex >= totalLength) {
        // 打字机效果完成
        setTypewriterCode(targetCode)
        setIsTypewriting(false)
        clearInterval(intervalId)
      } else {
        setTypewriterCode(targetCode.slice(0, currentIndex))
      }
    }, TYPEWRITER_SPEED)

    return () => {
      clearInterval(intervalId)
    }
  }, [isTypewriting, setIsTypewriting])

  // 监听滚动事件
  useEffect(() => {
    const codeContent = codeContentRef.current
    if (!codeContent) return

    codeContent.addEventListener('scroll', handleScroll)
    return () => {
      codeContent.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // 打字机效果时自动滚动到底部
  useEffect(() => {
    if (isTypewriting && typewriterCode) {
      scrollToBottom()
    }
  }, [isTypewriting, typewriterCode, scrollToBottom])

  // 打字机效果开始时，重置自动滚动状态
  useEffect(() => {
    if (isTypewriting) {
      setShouldAutoScroll(true)
    }
  }, [isTypewriting])

  const handleCopyCode = useCallback(() => {
    if (external_code) {
      copyWithCustomProcessor(external_code)
    }
  }, [external_code, copyWithCustomProcessor])
  // 当 generation_status 不是 COMPLETED 时，每5秒轮询一次
  useEffect(() => {
    if (isGeneratingCodeStatus) {
      const intervalId = setInterval(() => {
        refetchStrategyCode()
      }, 5000)

      return () => {
        clearInterval(intervalId)
      }
    }
  }, [isGeneratingCodeStatus, refetchStrategyCode])

  return (
    <CodeWrapper>
      <Header>
        <Left>
          {!isGeneratingCodeStatus && !isGeneratingCodeFrontend && (
            <>
              <IconBase className='icon-circle-success' />
              <Trans>Your intuition has been translated into code. The matrix is ready. </Trans>
            </>
          )}
        </Left>
        <OperatorWrapper>
          <RegenerateButton $disabled={isGeneratingCodeFrontend} onClick={handleGenerateCode}>
            <IconBase className='icon-arrow-loading' />
            <Trans>Regenerate</Trans>
          </RegenerateButton>
          <CopyButton $disabled={isGeneratingCodeFrontend} onClick={handleCopyCode}>
            <IconBase className='icon-copy' />
            <Trans>Copy</Trans>
          </CopyButton>
        </OperatorWrapper>
      </Header>
      <CodeContentWrapper ref={codeContentRef} style={{ backgroundImage: `url(${codeBg})` }} className='scroll-style'>
        {isGeneratingCodeStatus ? (
          <LoadingWrapper>
            <ThinkingProgress
              loadingPercentProp={codeLoadingPercent}
              setLoadingPercentProp={setCodeLoadingPercent}
              loadingText={<Trans>Generating Code...</Trans>}
              intervalDuration={120000}
            />
          </LoadingWrapper>
        ) : (
          <MemoizedHighlight className='python'>
            {isTypewriting ? typewriterCode : external_code || ''}
          </MemoizedHighlight>
        )}
      </CodeContentWrapper>
    </CodeWrapper>
  )
})
