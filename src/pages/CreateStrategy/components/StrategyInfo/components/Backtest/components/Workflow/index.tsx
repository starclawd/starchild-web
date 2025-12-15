import { Trans } from '@lingui/react/macro'
import Divider from 'components/Divider'
import { memo, useMemo } from 'react'
import styled, { keyframes } from 'styled-components'
import { useTheme } from 'store/themecache/hooks'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useStrategyBacktest, useStreamingSteps } from 'store/createstrategy/hooks/useBacktest'

const WorkflowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 320px;
  flex-shrink: 0;
`

const WorkflowTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px;
  color: ${({ theme }) => theme.textL2};
`

const WorkflowList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const WorkflowItem = styled.div`
  display: flex;
  gap: 8px;
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

export default memo(function Workflow() {
  const { strategyId } = useParsedQueryString()
  const theme = useTheme()
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
  console.log('displaySteps', displaySteps)
  return (
    <WorkflowWrapper>
      <WorkflowTitle>
        <Trans>Workflow</Trans>
      </WorkflowTitle>
      <Divider color={theme.lineDark8} height={1} paddingVertical={12} />
      <WorkflowList>
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
    </WorkflowWrapper>
  )
})
