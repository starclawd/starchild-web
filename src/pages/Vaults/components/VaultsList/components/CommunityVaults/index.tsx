import { memo, useCallback } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { useCommunityVaultsData } from 'store/vaults/hooks/useVaultData'
import Pending from 'components/Pending'
import VaultsTable from './components/VaultsTable'
import { ROUTER } from 'pages/router'
import { useCurrentRouter } from 'store/application/hooks'

const CommunityContainer = styled.div`
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

export default memo(function CommunityVaults() {
  const { communityVaults, isLoadingCommunityVaults } = useCommunityVaultsData()
  const [, setCurrentRouter] = useCurrentRouter()

  const handleRowClick = useCallback(
    (vaultId: string) => {
      setCurrentRouter(`${ROUTER.VAULT_DETAIL}?vaultId=${vaultId}`)
    },
    [setCurrentRouter],
  )

  return (
    <CommunityContainer>
      <SectionTitle>
        <Trans>AI powered community Vaults</Trans>
        <span>*</span>
      </SectionTitle>
      {isLoadingCommunityVaults ? (
        <Pending isFetching />
      ) : (
        <TableContainer>
          <VaultsTable vaults={communityVaults} onRowClick={handleRowClick} />
        </TableContainer>
      )}
    </CommunityContainer>
  )
})
