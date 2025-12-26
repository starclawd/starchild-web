import { memo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { useVaultsData } from 'store/vaults/hooks/useVaultData'
import Pending from 'components/Pending'
import StrategyCard from './components/StrategyCard'
import { useAllStrategiesOverview, useFetchAllStrategiesOverviewData } from 'store/vaults/hooks'
import { STRATEGY_STATUS } from 'store/createstrategy/createstrategy'

const StrategiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const SectionTitle = styled.div`
  font-size: 26px;
  font-style: normal;
  font-weight: 400;
  line-height: 34px;
  color: ${({ theme }) => theme.textL1};
  span {
    display: inline-block;
    margin-left: 2px;
    color: ${({ theme }) => theme.brand100};
  }
`

const StrategiesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  height: 222px;
`

const Strategies = memo(() => {
  const { isLoading: isLoadingAllStrategies } = useFetchAllStrategiesOverviewData()
  const [allStrategies] = useAllStrategiesOverview()

  return (
    <StrategiesContainer>
      {/* <SectionTitle>
        <Trans>Featured Strategy Agents</Trans>
      </SectionTitle> */}

      {isLoadingAllStrategies ? (
        <Pending isNotButtonLoading />
      ) : (
        <StrategiesList>
          {allStrategies
            .filter((strategy) => strategy.raw?.status === STRATEGY_STATUS.DEPLOYED)
            .map((strategy, index) => {
              return <StrategyCard key={strategy.strategyId} strategy={strategy} />
            })}
        </StrategiesList>
      )}
    </StrategiesContainer>
  )
})

Strategies.displayName = 'Strategies'

export default Strategies
