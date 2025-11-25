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

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin: 0;
`

const TableContainer = styled.div`
  background: ${({ theme }) => theme.bgL0};
  border: 1px solid ${({ theme }) => theme.lineDark8};
  border-radius: 12px;
  overflow: hidden;
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background: ${({ theme }) => theme.bgL0};
  border: 1px solid ${({ theme }) => theme.lineDark8};
  border-radius: 12px;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.textL2};
  font-size: 16px;
  background: ${({ theme }) => theme.bgL0};
  border: 1px solid ${({ theme }) => theme.lineDark8};
  border-radius: 12px;
`

const CommunityVaults = memo(() => {
  const { communityVaults, filter, isLoadingCommunityVaults, updateFilter } = useCommunityVaultsData()

  const handleRowClick = useCallback((vaultId: string) => {
    // TODO: 实现点击行的逻辑，比如跳转到vault详情页
    console.log('Row clicked:', vaultId)
  }, [])

  if (isLoadingCommunityVaults) {
    return (
      <CommunityContainer>
        <SectionHeader>
          <SectionTitle>
            <Trans>AI powered community Vaults</Trans>
          </SectionTitle>
        </SectionHeader>
        <LoadingContainer>
          <Pending isFetching />
        </LoadingContainer>
      </CommunityContainer>
    )
  }

  const filteredVaults = communityVaults.filter((vault) => {
    // 如果开启了隐藏零余额，过滤掉余额为 '-' 的vault
    if (filter.hideZeroBalances && vault.yourBalance === '-') {
      return false
    }
    return true
  })

  return (
    <CommunityContainer>
      <SectionHeader>
        <SectionTitle>
          <Trans>AI powered community Vaults</Trans>
        </SectionTitle>
        <VaultsFilters filter={filter} onFilterChange={updateFilter} />
      </SectionHeader>

      {filteredVaults.length === 0 ? (
        <EmptyState>
          {filter.hideZeroBalances ? (
            <Trans>No vaults with balance found</Trans>
          ) : (
            <Trans>No AI powered community vaults available</Trans>
          )}
        </EmptyState>
      ) : (
        <TableContainer>
          <VaultsTable vaults={filteredVaults} onRowClick={handleRowClick} />
        </TableContainer>
      )}
    </CommunityContainer>
  )
})

CommunityVaults.displayName = 'CommunityVaults'

export default CommunityVaults
