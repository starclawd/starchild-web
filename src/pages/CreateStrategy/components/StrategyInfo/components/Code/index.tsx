import styled, { css } from 'styled-components'
import ActionLayer from '../ActionLayer'
import { Trans } from '@lingui/react/macro'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useStrategyDetail } from 'store/createstrategy/hooks/useStrategyDetail'
import { GENERATION_STATUS, STRATEGY_STATUS } from 'store/createstrategy/createstrategy'
import {
  useCodeLoadingPercent,
  useGenerateStrategyCode,
  useHandleGenerateCode,
  useIsGeneratingCode,
  useIsTypewritingCode,
  useStrategyCode,
} from 'store/createstrategy/hooks/useCode'
import useParsedQueryString from 'hooks/useParsedQueryString'
import ThinkingProgress from 'pages/Chat/components/ThinkingProgress'
import MemoizedHighlight from 'components/MemoizedHighlight'
import NoData from 'components/NoData'
import { IconBase } from 'components/Icons'
import { useStrategyInfoTabIndex } from 'store/createstrategy/hooks/useTabIndex'
import useCopyContent from 'hooks/useCopyContent'
import { extractExecutableCode } from 'utils/extractExecutableCode'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import { useDeployModalToggle } from 'store/application/hooks'
import ShinyButton from 'components/ShinyButton'
import PixelBlast from './components/PixelBlast'
import { useIsShowRestart } from 'store/createstrategy/hooks/useRestart'

// 打字机效果的速度（每个字符的间隔时间，单位毫秒）
const TYPEWRITER_SPEED = 17
// 每次添加的字符数
const TYPEWRITER_CHARS_PER_TICK = 10

const CodeWrapper = styled.div<{ $isShowRestart: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-right: 8px !important;
  ${({ $isShowRestart }) =>
    $isShowRestart &&
    css`
      padding-bottom: 56px;
    `}
`

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.green100};
  .icon-chat-complete {
    font-size: 24px;
    color: ${({ theme }) => theme.green100};
  }
`

const ActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  > span {
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.textL3};
  }
`

const ActionList = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
  margin-bottom: 20px;
  .action-layer-wrapper:first-child {
    width: 50%;
    height: 100%;
  }
  .code-launch-button {
    width: 50%;
    height: 100%;
    border-radius: 8px;
    .action-layer-wrapper {
      width: 100%;
      border: none;
    }
  }
`

const CodeLoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: calc(100vh - 76px);
  gap: 12px;
`

const LoadingWrapper = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  padding: 16px;
`

const LoadingCodeContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: calc(100% - 104px);
`

const InnerWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
  overflow: auto;
  z-index: 2;
  code.hljs {
    padding: 20px !important;
  }
`

const CodeContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.black800};
  code.hljs {
    padding: 0 !important;
  }
`

const CodeTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 32px;
  padding: 0 16px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.bgT20};
  > span {
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px;
    color: ${({ theme }) => theme.textL4};
  }
`

const CopyWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.textL3};
  .icon-chat-copy {
    font-size: 18px;
    transition: all ${ANI_DURATION}s;
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
          &:hover {
            color: ${({ theme }) => theme.textL1};
            .icon-chat-copy {
              color: ${({ theme }) => theme.textL1};
            }
          }
        `}
`

export default memo(function Code() {
  const isShowRestart = useIsShowRestart()
  const { strategyId } = useParsedQueryString()
  const [, setStrategyInfoTabIndex] = useStrategyInfoTabIndex()
  const { strategyCode, refetch: refetchStrategyCode } = useStrategyCode({ strategyId: strategyId || '' })
  const [isGeneratingCode] = useIsGeneratingCode()
  const [codeLoadingPercent, setCodeLoadingPercent] = useCodeLoadingPercent()
  const toggleDeployModal = useDeployModalToggle()
  const handleGenerateCode = useHandleGenerateCode()
  const { strategyDetail } = useStrategyDetail({ strategyId: strategyId || '' })
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

  // 判断是否处于生成中的 UI 状态（包括真正的生成中和打字机效果中）
  const isInGeneratingUI = useMemo(() => {
    return isGeneratingCode || generation_status === GENERATION_STATUS.GENERATING || isTypewriting
  }, [isGeneratingCode, generation_status, isTypewriting])

  // 当前应该显示的代码
  const displayCode = useMemo(() => {
    // isGeneratingCode 为 true 时，不显示代码
    if (isGeneratingCode) {
      return ''
    }
    // 打字机效果中，显示 typewriterCode
    if (isTypewriting) {
      return typewriterCode
    }
    // 只有 generation_status 是 COMPLETED 时才显示 external_code
    if (generation_status === GENERATION_STATUS.COMPLETED) {
      return external_code || ''
    }
    // 其他情况不显示代码
    return ''
  }, [isGeneratingCode, isTypewriting, typewriterCode, external_code, generation_status])

  const isCreateSuccess = useMemo(() => {
    return !!strategyDetail?.strategy_config
  }, [strategyDetail])
  const goPaperTradingTab = useCallback(() => {
    setStrategyInfoTabIndex(3)
  }, [setStrategyInfoTabIndex])
  const depoloy = useCallback(() => {
    toggleDeployModal()
  }, [toggleDeployModal])
  const handleCopyCode = useCallback(() => {
    if (external_code) {
      copyWithCustomProcessor(external_code)
    }
  }, [external_code, copyWithCustomProcessor])

  // 当 generation_status 不是 COMPLETED 时，每5秒轮询一次
  useEffect(() => {
    if (generation_status === GENERATION_STATUS.GENERATING) {
      const intervalId = setInterval(() => {
        refetchStrategyCode()
      }, 5000)

      return () => {
        clearInterval(intervalId)
      }
    }
  }, [generation_status, refetchStrategyCode])

  return (
    <CodeWrapper $isShowRestart={isShowRestart} className='scroll-style'>
      {!isInGeneratingUI && generation_status === GENERATION_STATUS.COMPLETED && (
        <>
          <Title>
            <IconBase className='icon-chat-complete' />
            <Trans>Your intuition has been translated into code. The matrix is ready. </Trans>
          </Title>
          <ActionWrapper>
            <span>
              <Trans>How do you want to test your Alpha?</Trans>
            </span>
            <ActionList>
              <ActionLayer
                showRightArrow
                iconCls='icon-paper-trading'
                title={<Trans>Run Paper Trading</Trans>}
                description={<Trans>Simulation in real-time with virtual funds.</Trans>}
                clickCallback={goPaperTradingTab}
              />
              <ShinyButton className='code-launch-button'>
                <ActionLayer
                  showRightArrow
                  iconCls='icon-deploy'
                  title={<Trans>Launch</Trans>}
                  description={
                    <Trans>
                      Launch the live Strategy and create a Mirror Vault. Retail users can deposit into your Vault, and
                      you earn performance fees.
                    </Trans>
                  }
                  clickCallback={depoloy}
                />
              </ShinyButton>
            </ActionList>
          </ActionWrapper>
        </>
      )}
      {isInGeneratingUI ? (
        <CodeLoadingWrapper>
          <LoadingWrapper>
            <ThinkingProgress
              loadingPercentProp={codeLoadingPercent}
              setLoadingPercentProp={setCodeLoadingPercent}
              loadingText={<Trans>Generating Code...</Trans>}
              intervalDuration={120000}
            />
          </LoadingWrapper>
          <LoadingCodeContent>
            <PixelBlast />
            <InnerWrapper ref={innerWrapperRef} className='scroll-style'>
              {displayCode && <MemoizedHighlight className='python'>{displayCode}</MemoizedHighlight>}
            </InnerWrapper>
          </LoadingCodeContent>
        </CodeLoadingWrapper>
      ) : (
        external_code &&
        generation_status === GENERATION_STATUS.COMPLETED && (
          <CodeContentWrapper>
            <CodeTop>
              <span>
                <Trans>The code is generated by AI, executed inside a container.</Trans>
              </span>
              <CopyWrapper onClick={handleCopyCode}>
                <IconBase className='icon-chat-copy' />
                <Trans>Copy</Trans>
              </CopyWrapper>
            </CodeTop>
            <MemoizedHighlight className='python'>{external_code}</MemoizedHighlight>
          </CodeContentWrapper>
        )
      )}
      {!isInGeneratingUI &&
        (generation_status === GENERATION_STATUS.PENDING ||
          !generation_status ||
          (generation_status === GENERATION_STATUS.FAILED && !external_code)) && (
          <ActionLayer
            iconCls='icon-view-code'
            title={<Trans>Generate Code</Trans>}
            description={
              isCreateSuccess ? (
                <Trans>
                  Click [Generate Code] to let the Agent write the script and transform your text strategy into
                  executable logic. Once generated, you can Simulation with virtual funds or deploy with real funds.
                </Trans>
              ) : (
                <Trans>Strategy Not Defined. Please describe and confirm your strategy logic first.</Trans>
              )
            }
            rightText={<Trans>Generate code</Trans>}
            rightButtonClickCallback={handleGenerateCode}
            rightButtonDisabled={!isCreateSuccess}
          />
        )}
    </CodeWrapper>
  )
})
