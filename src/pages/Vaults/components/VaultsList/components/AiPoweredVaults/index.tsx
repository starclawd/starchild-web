import { memo, useCallback } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import Pending from 'components/Pending'
import VaultsTable from './components/VaultsTable'
import { ROUTER } from 'pages/router'
import { useCurrentRouter } from 'store/application/hooks'
import { useAllStrategiesOverview, useFetchAllStrategiesOverviewData } from 'store/vaults/hooks'

const AiPoweredVaultsContainer = styled.div`
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

const TableContainer = styled.div`
  width: 100%;
`

export default memo(function AiPoweredVaults() {
  const { isLoading: isLoadingAllStrategies } = useFetchAllStrategiesOverviewData()
  const [, setCurrentRouter] = useCurrentRouter()
  const [allStrategies] = useAllStrategiesOverview()

  const handleRowClick = useCallback(
    (vaultId: string) => {
      setCurrentRouter(`${ROUTER.VAULT_DETAIL}?vaultId=${vaultId}`)
    },
    [setCurrentRouter],
  )

  return (
    <AiPoweredVaultsContainer>
      <SectionTitle>
        <Trans>AI powered Vaults</Trans>
        <span>*</span>
      </SectionTitle>
      {isLoadingAllStrategies ? (
        <Pending isFetching />
      ) : (
        <TableContainer>
          <VaultsTable allStrategies={allStrategies} onRowClick={handleRowClick} />
        </TableContainer>
      )}
    </AiPoweredVaultsContainer>
  )
})
