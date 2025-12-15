import styled from 'styled-components'
import { useCallback, useState } from 'react'
import PaperTradingSetup from './components/PaperTradingSetup'
import PaperTradingRunning from './components/PaperTradingRunning'
import { useStartPaperTradingAction, usePaperTrading } from 'store/createstrategy/hooks/usePaperTrading'
import useParsedQueryString from 'hooks/useParsedQueryString'
import Pending from 'components/Pending'

const PaperTradingWrapper = styled.div`
  display: flex;
  width: 100%;
`

export default function PaperTrading() {
  const [isStarting, setIsStarting] = useState(false)
  const { strategyId } = useParsedQueryString()
  const startPaperTrading = useStartPaperTradingAction()
  const {
    paperTradingCurrentData,
    isLoadingPaperTradingCurrent,
    refetch: refetchPaperTradingCurrent,
  } = usePaperTrading({
    strategyId: strategyId || '',
  })

  const handleRunPaperTrading = useCallback(async () => {
    if (!strategyId) {
      console.error('Strategy ID is required')
      return
    }

    setIsStarting(true)
    try {
      const result = await startPaperTrading(strategyId)
      if (result?.data?.status === 'success') {
        // startPaperTrading成功后，调用查询接口更新状态
        await refetchPaperTradingCurrent()
      } else {
        console.error('Failed to start paper trading:', result?.error)
      }
    } catch (error) {
      console.error('Error starting paper trading:', error)
    } finally {
      setIsStarting(false)
    }
  }, [strategyId, startPaperTrading, refetchPaperTradingCurrent])

  // 如果正在加载Paper Trading状态，显示加载状态
  if (isLoadingPaperTradingCurrent) {
    return (
      <PaperTradingWrapper>
        <Pending />
      </PaperTradingWrapper>
    )
  }

  // 如果有Paper Trading数据，说明正在运行，显示Running视图
  if (paperTradingCurrentData) {
    return (
      <PaperTradingWrapper>
        <PaperTradingRunning />
      </PaperTradingWrapper>
    )
  }

  // 否则显示Setup视图
  return (
    <PaperTradingWrapper>
      <PaperTradingSetup onRunPaperTrading={handleRunPaperTrading} isLoading={isStarting} />
    </PaperTradingWrapper>
  )
}
