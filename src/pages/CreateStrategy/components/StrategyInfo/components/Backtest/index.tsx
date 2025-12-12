import styled from 'styled-components'
import ActionLayer from '../ActionLayer'
import { Trans } from '@lingui/react/macro'
import { memo, useCallback, useMemo } from 'react'
import { useStrategyDetail } from 'store/createstrategy/hooks/useStrategyDetail'
import { STRATEGY_STATUS } from 'store/createstrategy/createstrategy'
import { useStrategyBacktest } from 'store/createstrategy/hooks/useBacktest'

const BacktestWrapper = styled.div`
  display: flex;
  width: 100%;
`

export default memo(function Backtest() {
  const { strategyDetail } = useStrategyDetail()
  const { strategyBacktestData, refetch: refetchStrategyBacktestData } = useStrategyBacktest()
  const isCodeGenerated = useMemo(() => {
    return strategyDetail?.status === STRATEGY_STATUS.DRAFT_READY
  }, [strategyDetail])
  const handleRunBacktest = useCallback(async () => {
    console.log('handleRunBacktest')
  }, [])
  return (
    <BacktestWrapper>
      <ActionLayer
        iconCls='icon-view-code'
        title={<Trans>Run Backtest</Trans>}
        description={
          isCodeGenerated ? (
            <Trans>Click [**Run Backtest]** to see how your strategy would have performed on historical data.</Trans>
          ) : (
            <Trans>Strategy Not Defined. Please describe and confirm your strategy logic first.</Trans>
          )
        }
        rightText={<Trans>Run Backtest</Trans>}
        rightButtonClickCallback={handleRunBacktest}
        rightButtonDisabled={!isCodeGenerated}
      />
    </BacktestWrapper>
  )
})
