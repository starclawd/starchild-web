import { memo } from 'react'
import styled from 'styled-components'
import Leaderboard from './components/Leaderboard'
import MyStrategy from './components/MyStrategy'

const StrategyInfoWrapper = styled.div`
  display: flex;
  margin-top: 12px;
  gap: 12px;
  width: 800px;
  height: 200px;
`

export default memo(function StrategyInfo() {
  return (
    <StrategyInfoWrapper>
      <Leaderboard />
      <MyStrategy />
    </StrategyInfoWrapper>
  )
})
