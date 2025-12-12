import styled from 'styled-components'
import ActionLayer from '../ActionLayer'
import { Trans } from '@lingui/react/macro'
import { memo, useCallback, useMemo, useState } from 'react'
import { useStrategyDetail } from 'store/createstrategy/hooks/useStrategyDetail'
import { STRATEGY_STATUS } from 'store/createstrategy/createstrategy'
import { useGenerateStrategyCode, useStrategyCode } from 'store/createstrategy/hooks/useCode'
import useParsedQueryString from 'hooks/useParsedQueryString'
import ThinkingProgress from 'pages/Chat/components/ThinkingProgress'
import MemoizedHighlight from 'components/MemoizedHighlight'
import NoData from 'components/NoData'

const CodeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`

const LoadingWrapper = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  padding: 16px;
`

const CodeContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`

export default memo(function Code() {
  const code = ''
  const { strategyId } = useParsedQueryString()
  const { strategyCode, refetch: refetchStrategyCode } = useStrategyCode(strategyId || '')
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)
  const { strategyDetail } = useStrategyDetail()
  const triggerGenerateStrategyCode = useGenerateStrategyCode()
  const isCreateSuccess = useMemo(() => {
    return strategyDetail?.status === STRATEGY_STATUS.DRAFT && strategyDetail?.strategy_config !== null
  }, [strategyDetail])
  const handleGenerateCode = useCallback(async () => {
    if (!isCreateSuccess || isGeneratingCode) return
    setIsGeneratingCode(true)
    const data = await triggerGenerateStrategyCode(strategyId || '')
    if (data?.isSuccess) {
      refetchStrategyCode()
      setIsGeneratingCode(false)
    }
  }, [strategyId, triggerGenerateStrategyCode, refetchStrategyCode, isCreateSuccess, isGeneratingCode])
  return (
    <CodeWrapper>
      {isGeneratingCode ? (
        <LoadingWrapper>
          <ThinkingProgress loadingText={<Trans>Generating Code...</Trans>} intervalDuration={120000} />
        </LoadingWrapper>
      ) : (
        code && (
          <CodeContentWrapper>
            <MemoizedHighlight className='python'>{code}</MemoizedHighlight>
          </CodeContentWrapper>
        )
      )}
      {!isGeneratingCode && (
        <ActionLayer
          iconCls='icon-view-code'
          title={<Trans>Generate Code</Trans>}
          description={
            isCreateSuccess ? (
              <Trans>
                Click [Generate Code] to let the Agent write the script and transform your text strategy into executable
                logic. Once generated, you can Simulation with virtual funds or deploy with real funds.
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
