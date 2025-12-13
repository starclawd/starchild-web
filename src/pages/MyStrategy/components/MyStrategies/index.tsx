import { memo } from 'react'
import styled from 'styled-components'
import TabList from './components/TabList'
import { useMyStrategies } from 'store/mystrategy/hooks/useMyStrategies'
import Pending from 'components/Pending'
import StrategyItem from './components/StrategyItem'
import NoData from 'components/NoData'

const MyStrategiesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const StrategiesListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 300px;
`

export default memo(function MyStrategies() {
  const { myStrategies, isLoadingMyStrategies } = useMyStrategies()
  return (
    <MyStrategiesWrapper>
      <TabList />
      <StrategiesListWrapper>
        {isLoadingMyStrategies ? (
          <Pending isFetching />
        ) : myStrategies.length > 0 ? (
          myStrategies.map((strategy) => <StrategyItem key={strategy.id} strategy={strategy} />)
        ) : (
          <NoData />
        )}
      </StrategiesListWrapper>
    </MyStrategiesWrapper>
  )
})
