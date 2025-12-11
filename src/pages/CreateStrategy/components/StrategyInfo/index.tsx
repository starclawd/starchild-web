import styled from 'styled-components'
import Header from './components/Header'
import { useStrategyInfoTabIndex } from 'store/createstrategy/hooks/useTabIndex'
import Summary from './components/Summary'
import Code from './components/Code'
import Backtest from './components/Backtest'
import PaperTrading from './components/PaperTrading'

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

export default function StrategyInfo() {
  const [strategyInfoTabIndex] = useStrategyInfoTabIndex()
  // TODO: 这里应该从路由或上下文获取实际的策略ID
  const strategyId = 'strategy-123'

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
}
