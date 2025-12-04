import { memo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { useVaultsData } from 'store/vaults/hooks/useVaultData'
import Pending from 'components/Pending'
import VaultCard from './components/VaultCard'
import { useAllStrategiesOverview, useFetchAllStrategiesOverviewData } from 'store/vaults/hooks'

const AiGeneratedVaultsContainer = styled.div`
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

const VaultList = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  height: 346px;
`

const AiGeneratedVaults = memo(() => {
  const { isLoading: isLoadingAllStrategies } = useFetchAllStrategiesOverviewData()
  const [allStrategies] = useAllStrategiesOverview()

  return (
    <AiGeneratedVaultsContainer>
      <SectionTitle>
        <Trans>Top strategies</Trans>
        <span>*</span>
      </SectionTitle>

      {isLoadingAllStrategies ? (
        <Pending isFetching />
      ) : (
        <VaultList>
          {allStrategies.map((strategy, index) => {
            return <VaultCard key={strategy.strategyId} strategy={strategy} />
          })}
        </VaultList>
      )}
    </AiGeneratedVaultsContainer>
  )
})

AiGeneratedVaults.displayName = 'AiGeneratedVaults'

export default AiGeneratedVaults
