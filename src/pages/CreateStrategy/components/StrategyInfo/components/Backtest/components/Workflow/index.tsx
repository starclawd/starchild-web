import { Trans } from '@lingui/react/macro'
import { memo, useEffect, useMemo, useRef } from 'react'
import styled, { css, keyframes } from 'styled-components'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useIsShowWorkflow, useStrategyBacktest, useStreamingSteps } from 'store/createstrategy/hooks/useBacktest'
import { ANI_DURATION } from 'constants/index'
import WorkflowTitle from './components/WorkflowTitle'
import ParamsContent, { StreamingParamsType } from './components/ParamsContent'
import { useIsShowRestart } from 'store/createstrategy/hooks/useRestart'

const WorkflowWrapper = styled.div<{ $isShowWorkflow: boolean; $isLoading?: boolean }>`
  display: flex;
  width: ${({ $isShowWorkflow, $isLoading }) => (!$isShowWorkflow && !$isLoading ? '0' : '300px')};
  height: 100%;
  flex-shrink: 0;
  overflow: hidden;
  transition: width ${ANI_DURATION}s ease-out;
  will-change: width;
`

const InnerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 300px;
  height: 100%;
  flex-shrink: 0;
`

const WorkflowList = styled.div<{ $isShowRestart: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: calc(100% - 48px);
  padding-right: 8px !important;
  ${({ $isShowRestart }) =>
    $isShowRestart &&
    css`
      padding-bottom: 56px;
    `}
`

const WorkflowItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Step = styled.div`
  display: flex;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL4};
  span:first-child {
    text-transform: capitalize;
  }
`

const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`

const Cursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 14px;
  background-color: ${({ theme }) => theme.textL4};
  margin-left: 2px;
  animation: ${blink} 0.8s infinite;
  vertical-align: middle;
`

const MessageText = styled.span<{ $isTyping?: boolean }>`
  display: inline;
`

export default memo(function Workflow({ isLoading }: { isLoading?: boolean }) {
  const isShowRestart = useIsShowRestart()
  const { strategyId } = useParsedQueryString()
  const [isShowWorkflow] = useIsShowWorkflow()
  const { strategyBacktestData } = useStrategyBacktest({
    strategyId: strategyId || '',
  })
  const [streamingSteps, isBacktestStreaming] = useStreamingSteps()

  // 优先使用 strategyBacktestData 中的 steps，流式时使用 streamingSteps
  const displaySteps = useMemo(() => {
    // 如果正在流式传输，使用 streamingSteps
    if (isBacktestStreaming && streamingSteps.length > 0) {
      return streamingSteps.map((step) => ({
        step: step.step,
        message: step.displayMessage || '',
        fullMessage: step.message,
        isComplete: step.isComplete,
        isStreaming: true,
      }))
    }
    // 否则使用 strategyBacktestData 中的 steps
    const steps = strategyBacktestData?.steps || []
    return steps.map((step) => ({
      step: step.step,
      message: step.message,
      fullMessage: step.message,
      isComplete: true,
      isStreaming: false,
    }))
  }, [strategyBacktestData, streamingSteps, isBacktestStreaming])

  // 从 streamingSteps 中提取 strategy_generated 步骤的 parameters
  const streamingParams = useMemo((): StreamingParamsType | null => {
    if (!isBacktestStreaming || streamingSteps.length === 0) {
      return null
    }
    // 查找 strategy_generated 步骤
    const strategyGeneratedStep = streamingSteps.find((step) => step.step === 'strategy_generated')
    if (strategyGeneratedStep?.data?.parameters) {
      return strategyGeneratedStep.data.parameters as StreamingParamsType
    }
    return null
  }, [streamingSteps, isBacktestStreaming])

  // 自动滚动到底部
  const workflowListRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (workflowListRef.current) {
      workflowListRef.current.scrollTop = workflowListRef.current.scrollHeight
    }
  }, [displaySteps, streamingParams])

  return (
    <WorkflowWrapper $isLoading={isLoading} $isShowWorkflow={isShowWorkflow}>
      <InnerContent>
        <WorkflowTitle isLoading={isLoading} />
        <WorkflowList $isShowRestart={isShowRestart} ref={workflowListRef} className='scroll-style'>
          {(strategyBacktestData?.params || streamingParams) && (
            <ParamsContent strategyBacktestData={strategyBacktestData} streamingParams={streamingParams} />
          )}
          {displaySteps.map((data, index) => {
            const { step, message, isComplete, isStreaming } = data
            const stepIndex = index + 1
            const showCursor = isStreaming && !isComplete
            return (
              <WorkflowItem key={index}>
                <Step>
                  <Trans>Step{stepIndex}</Trans>
                </Step>
                <Content>
                  <span>{step}</span>
                  <MessageText $isTyping={showCursor}>
                    {message}
                    {showCursor && <Cursor />}
                  </MessageText>
                </Content>
              </WorkflowItem>
            )
          })}
        </WorkflowList>
      </InnerContent>
    </WorkflowWrapper>
  )
})
