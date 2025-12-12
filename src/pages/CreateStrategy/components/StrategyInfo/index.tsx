import styled from 'styled-components'
import Header from './components/Header'
import { useStrategyInfoTabIndex } from 'store/createstrategy/hooks/useTabIndex'
import Summary from './components/Summary'
import Code from './components/Code'
import Backtest from './components/Backtest'
import PaperTrading from './components/PaperTrading'
import { memo, useEffect } from 'react'
import { useStrategyDetail } from 'store/createstrategy/hooks/useStrategyDetail'
import useParsedQueryString from 'hooks/useParsedQueryString'

const StrategyInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  height: 100%;
  padding: 12px 20px 20px;
`

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - 64px);
`

export default memo(function StrategyInfo() {
  const { strategyId } = useParsedQueryString()
  const [strategyInfoTabIndex] = useStrategyInfoTabIndex()
  const { strategyDetail, refetch } = useStrategyDetail()
  const { strategy_config } = strategyDetail || { name: '', description: '', strategy_config: null }

  // 当 strategyId 存在但 strategy_config 不存在时，每5秒轮询一次
  // useEffect(() => {
  //   if (!strategyId || strategy_config) return

  //   const intervalId = setInterval(() => {
  //     refetch()
  //   }, 5000)

  //   return () => clearInterval(intervalId)
  // }, [strategyId, strategy_config, refetch])

  return (
    <StrategyInfoWrapper>
      <Header />
      <ContentWrapper className='scroll-style'>
        {strategyInfoTabIndex === 0 && <Summary />}
        {strategyInfoTabIndex === 1 && <Code />}
        {strategyInfoTabIndex === 2 && <Backtest />}
        {strategyInfoTabIndex === 3 && <PaperTrading />}
      </ContentWrapper>
    </StrategyInfoWrapper>
  )
})
