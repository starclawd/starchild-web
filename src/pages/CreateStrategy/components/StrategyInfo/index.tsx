import styled from 'styled-components'
import Header from './components/Header'
import { useStrategyInfoTabIndex } from 'store/createstrategy/hooks/useTabIndex'
import Summary from './components/Summary'
import Code from './components/Code'
import Backtest from './components/Backtest'
import Run from './components/Run'

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
  height: 100%;
`

export default function StrategyInfo() {
  const [strategyInfoTabIndex] = useStrategyInfoTabIndex()
  return (
    <StrategyInfoWrapper>
      <Header />
      <ContentWrapper>
        {strategyInfoTabIndex === 0 && <Summary />}
        {strategyInfoTabIndex === 1 && <Code />}
        {strategyInfoTabIndex === 2 && <Backtest />}
        {strategyInfoTabIndex === 3 && <Run />}
      </ContentWrapper>
    </StrategyInfoWrapper>
  )
}
