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
  gap: 4px;
  height: 100%;
  padding: 0 12px;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  border-radius: 0;
  color: ${({ theme }) => theme.black200};
  border-top: none;
  border-right: none;
  border-bottom: none;
  .icon-arrow-loading {
    font-size: 18px;
    color: ${({ theme }) => theme.black200};
  }
`

const CopyButton = styled(ButtonBorder)`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 100%;
  padding: 0 12px;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  border-radius: 0;
  color: ${({ theme }) => theme.black200};
  border-top: none;
  border-bottom: none;
  .icon-copy {
    font-size: 18px;
    color: ${({ theme }) => theme.black200};
  }
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
  const [isGeneratingCode] = useIsGeneratingCode()
  const handleGenerateCode = useHandleGenerateCode()
  const [codeLoadingPercent, setCodeLoadingPercent] = useCodeLoadingPercent()
  const { external_code, generation_status } = strategyCode || { external_code: '', generation_status: null }
  const { copyWithCustomProcessor } = useCopyContent({
    mode: 'custom',
    customProcessor: extractExecutableCode,
  })

  // 打字机效果相关状态
  const prevGenerationStatusRef = useRef<GENERATION_STATUS | null>(null)
  const [isTypewriting, setIsTypewriting] = useIsTypewritingCode()
  const [typewriterCode, setTypewriterCode] = useState('')
  const typewriterIndexRef = useRef(0)
  const targetCodeRef = useRef('')

  // 自动滚动相关状态
  const innerWrapperRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  const isGeneratingCodeStatus = useMemo(() => {
    return generation_status === GENERATION_STATUS.GENERATING
  }, [generation_status])

  // 处理滚动事件，检测用户是否手动向上滚动
  const handleScroll = useCallback(() => {
    if (!innerWrapperRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = innerWrapperRef.current
    // 计算距离底部的距离
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    // 如果用户向上滚动超过10px，则停止自动滚动
    const isAtBottom = distanceFromBottom < 10
    setShouldAutoScroll(isAtBottom)
  }, [])

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    if (innerWrapperRef.current && shouldAutoScroll) {
      requestAnimationFrame(() => {
        innerWrapperRef.current?.scrollTo({
          top: innerWrapperRef.current.scrollHeight,
          behavior: 'auto',
        })
      })
    }
  }, [shouldAutoScroll])

  // 检测 generation_status 从 GENERATING 变成 COMPLETED
  useEffect(() => {
    const prevStatus = prevGenerationStatusRef.current

    // 当状态从 GENERATING 变成 COMPLETED 且有代码时，启动打字机效果
    if (
      prevStatus === GENERATION_STATUS.GENERATING &&
      generation_status === GENERATION_STATUS.COMPLETED &&
      external_code
    ) {
      // 开始打字机效果
      setIsTypewriting(true)
      setTypewriterCode('')
      typewriterIndexRef.current = 0
      targetCodeRef.current = external_code
    }

    // 更新前一个状态的引用
    prevGenerationStatusRef.current = generation_status
  }, [generation_status, external_code, setIsTypewriting])

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
    const innerWrapper = innerWrapperRef.current
    if (!innerWrapper) return

    innerWrapper.addEventListener('scroll', handleScroll)
    return () => {
      innerWrapper.removeEventListener('scroll', handleScroll)
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
          {!isGeneratingCodeStatus && (
            <>
              <IconBase className='icon-circle-success' />
              <Trans>Your intuition has been translated into code. The matrix is ready. </Trans>
            </>
          )}
        </Left>
        <OperatorWrapper>
          <RegenerateButton onClick={handleGenerateCode}>
            {isGeneratingCode ? (
              <Pending />
            ) : (
              <>
                <IconBase className='icon-arrow-loading' />
                <Trans>Regenerate</Trans>
              </>
            )}
          </RegenerateButton>
          <CopyButton onClick={handleCopyCode}>
            <IconBase className='icon-copy' />
            <Trans>Copy</Trans>
          </CopyButton>
        </OperatorWrapper>
      </Header>
      <CodeContentWrapper style={{ backgroundImage: `url(${codeBg})` }} className='scroll-style'>
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
          <MemoizedHighlight className='python'>{external_code || ''}</MemoizedHighlight>
        )}
      </CodeContentWrapper>
    </CodeWrapper>
  )
})
