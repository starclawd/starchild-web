import { memo } from 'react'
import styled from 'styled-components'
import Leaderboard from './components/Leaderboard'
import MyStrategy from './components/MyStrategy'

const StrategyInfoWrapper = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
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
