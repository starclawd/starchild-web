import { Trans } from '@lingui/react/macro'
import { useAppKitAccount } from '@reown/appkit/react'
import Pending from 'components/Pending'
import { useMemo } from 'react'
import { useFetchVaultLpInfoList, useVaultLpInfoList } from 'store/portfolio/hooks/useVaultLpInfo'
import { useAllVaults, useVaultsData } from 'store/vaults/hooks'
import styled from 'styled-components'
import NoDataWrapper from './components/NoDataWrapper'
import VaultsItem from './components/VaultsItem'
import NoConnected from './components/NoConnected'

const MyVaultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Title = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
`

const VaultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export default function MyVaults() {
  const { address } = useAppKitAccount()
  const { isLoadingVaults } = useVaultsData()
  const { isLoading: isLoadingVaultLpInfoList } = useFetchVaultLpInfoList({ walletAddress: address || '' })
  const [vaultLpInfoList] = useVaultLpInfoList()
  const allVaults = useAllVaults()

  const vaultsList = useMemo(() => {
    return allVaults.filter((item) => vaultLpInfoList.some((vaultLpInfo) => vaultLpInfo.vault_id === item.vault_id))
  }, [allVaults, vaultLpInfoList])

  return (
    <MyVaultsWrapper>
      <Title>
        <Trans>My vaults</Trans>
      </Title>
      <VaultsList>
        {!address ? (
          <NoConnected />
        ) : isLoadingVaults || isLoadingVaultLpInfoList ? (
          <Pending isFetching />
        ) : vaultsList.length > 0 ? (
          vaultsList.map((item) => <VaultsItem key={item.vault_id} item={item} />)
        ) : (
          <NoDataWrapper />
        )}
      </VaultsList>
    </MyVaultsWrapper>
  )
}
