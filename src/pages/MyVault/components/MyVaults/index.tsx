import { Trans } from '@lingui/react/macro'
import Pending from 'components/Pending'
import { useMemo } from 'react'
import { useVaultLpInfoList } from 'store/myvault/hooks/useVaultLpInfo'
import { useVaultsData } from 'store/vaults/hooks'
import styled from 'styled-components'
import NoDataWrapper from './components/NoDataWrapper'
import VaultsItem from './components/VaultsItem'
import NoConnected from './components/NoConnected'
import useValidVaultWalletAddress from 'hooks/useValidVaultWalletAddress'

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
  min-height: 160px;
`

export default function MyVaults() {
  const [isValidWallet, address] = useValidVaultWalletAddress()
  const { allVaults, isLoadingVaults } = useVaultsData()
  const walletAddress = address && isValidWallet ? address : ''
  const { vaultLpInfoList, isLoadingVaultLpInfoList } = useVaultLpInfoList({
    walletAddress,
  })

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
          <Pending isNotButtonLoading />
        ) : vaultsList.length > 0 ? (
          vaultsList.map((item) => <VaultsItem key={item.vault_id} item={item} walletAddress={walletAddress} />)
        ) : (
          <NoDataWrapper />
        )}
      </VaultsList>
    </MyVaultsWrapper>
  )
}
