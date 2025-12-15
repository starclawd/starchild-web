import { Trans } from '@lingui/react/macro'
import Divider from 'components/Divider'
import { memo } from 'react'
import styled from 'styled-components'
import { useTheme } from 'store/themecache/hooks'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useStrategyBacktest } from 'store/createstrategy/hooks/useBacktest'

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

export default memo(function Workflow() {
  const { strategyId } = useParsedQueryString()
  const theme = useTheme()
  const { strategyBacktestData } = useStrategyBacktest({
    strategyId: strategyId || '',
  })
  const steps = strategyBacktestData?.steps || []
  return (
    <WorkflowWrapper>
      <WorkflowTitle>
        <Trans>Workflow</Trans>
      </WorkflowTitle>
      <Divider color={theme.lineDark8} height={1} paddingVertical={12} />
      <WorkflowList>
        {steps.map((data, index) => {
          const { step, message } = data
          const stepIndex = index + 1
          return (
            <WorkflowItem key={index}>
              <Step>
                <Trans>Step{stepIndex}</Trans>
              </Step>
              <Content>
                <span>{step}</span>
                <span>{message}</span>
              </Content>
            </WorkflowItem>
          )
        })}
      </WorkflowList>
    </WorkflowWrapper>
  )
})
