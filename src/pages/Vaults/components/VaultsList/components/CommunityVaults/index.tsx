import { memo, useCallback } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { useCommunityVaultsData } from 'store/vaults/hooks/useVaultData'
import Pending from 'components/Pending'
import VaultsTable from './components/VaultsTable'
import VaultsFilters from './components/VaultsFilters'

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
  const { communityVaults, filter, isLoadingCommunityVaults, updateFilter } = useCommunityVaultsData()

  const handleRowClick = useCallback((vaultId: string) => {
    // TODO: 实现点击行的逻辑，比如跳转到vault详情页
    console.log('Row clicked:', vaultId)
  }, [])

  const filteredVaults = communityVaults.filter((vault) => {
    // 如果开启了隐藏零余额，过滤掉余额为 '-' 的vault
    if (filter.hideZeroBalances && vault.yourBalance === '-') {
      return false
    }
    return true
  })

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
          <VaultsTable vaults={filteredVaults} onRowClick={handleRowClick} />
        </TableContainer>
      )}
    </CommunityContainer>
  )
})
