import { Trans } from '@lingui/react/macro'
import styled from 'styled-components'
import usdc from 'assets/tokens/usdc.png'
import { formatNumber } from 'utils/format'
import { ButtonCommon } from 'components/Button'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { useClaimInfo, useFetchClaimInfoData } from 'store/vaultsdetail/hooks/useClaimInfo'
import { useCallback, useMemo, useState } from 'react'
import NetworkSelector, { ColorMode } from 'pages/Vaults/components/VaultsWalletConnect/components/NetworkSelector'
import { useOrderlyVaultClaimWithFee } from 'hooks/contract/useOrderlyVaultContract'
import { useCurrentDepositAndWithdrawVault } from 'store/vaults/hooks'
import { getChainInfo } from 'constants/chainInfo'
import { Address, Hex } from 'viem'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useTheme } from 'store/themecache/hooks'
import Pending from 'components/Pending'
import { BROKER_HASH } from 'constants/brokerHash'
import { formatContractError } from 'utils/handleError'
import { useSleep } from 'hooks/useSleep'
import { useLatestTransactionHistory } from 'store/vaultsdetail/hooks/useTransactionData'
import { useReadOrderlyVaultCrossChainFee } from 'hooks/contract/useGeneratedHooks'
import { useAccountId } from 'hooks/useAccountId'
import { VaultInfo } from 'api/vaults'

const AvailableClaimWrapper = styled.div`
  display: flex;
  align-content: center;
  justify-content: space-between;
  width: 100%;
`

const LeftContent = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  > span:first-child {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.black300};
  }
  > span:last-child {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.black0};
    img {
      width: 18px;
      height: 18px;
    }
  }
`

const RightContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ButtonClaim = styled(ButtonCommon)`
  height: 28px;
  padding: 0 12px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
`

export default function AvailableClaim() {
  const [claimData] = useClaimInfo()
  const { address } = useAppKitAccount()
  const { chainId } = useAppKitNetwork()
  const { fetchClaimData } = useFetchClaimInfoData()
  const [currentDepositAndWithdrawVault] = useCurrentDepositAndWithdrawVault()
  const claimWithFee = useOrderlyVaultClaimWithFee()
  const toast = useToast()
  const { sleep } = useSleep()
  const theme = useTheme()
  const [isClaiming, setIsClaiming] = useState(false)
  const { refetch: refetchLatestTransactionHistory } = useLatestTransactionHistory({
    vaultId: currentDepositAndWithdrawVault?.vault_id as string,
    type: 'withdrawal',
    walletAddress: address || '',
  })

  const availableClaimAmount = useMemo(() => {
    return claimData[chainId as keyof typeof claimData]?.claimableAmount ?? 0
  }, [claimData, chainId])

  // 获取链信息
  const numericChainId = chainId ? Number(chainId) : undefined
  const chainInfo = getChainInfo(numericChainId)
  const usdcAddress = chainInfo?.usdcContractAddress as Address | undefined
  const vaultAddress = currentDepositAndWithdrawVault?.vault_address as Address | undefined

  // 计算 accountId
  const accountId = useAccountId(address)

  // 获取跨链手续费（使用 accountId 作为参数）
  const { data: crossChainFee } = useReadOrderlyVaultCrossChainFee({
    address: vaultAddress,
    args: [accountId as Hex],
    query: {
      enabled: !!vaultAddress && !!accountId,
    },
  })

  const handleClaim = useCallback(async () => {
    if (!vaultAddress || !usdcAddress || availableClaimAmount <= 0 || !address) return
    if (!crossChainFee) {
      return
    }
    try {
      setIsClaiming(true)

      await claimWithFee({
        contractAddress: vaultAddress,
        roleType: 0, // LP = 0
        token: usdcAddress,
        brokerHash: BROKER_HASH,
        value: crossChainFee,
      })

      await sleep(5000)

      await fetchClaimData({
        vaultInfo: currentDepositAndWithdrawVault as VaultInfo,
        walletAddress: address || '',
      })

      await refetchLatestTransactionHistory()

      toast({
        title: <Trans>Claim Successful</Trans>,
        description: '',
        status: TOAST_STATUS.SUCCESS,
        typeIcon: 'icon-chat-complete',
        iconTheme: theme.black0,
      })
    } catch (error: any) {
      toast({
        title: <Trans>Claim Failed</Trans>,
        description: formatContractError(error),
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-close',
        iconTheme: theme.black0,
      })
    } finally {
      setIsClaiming(false)
    }
  }, [
    address,
    theme,
    vaultAddress,
    usdcAddress,
    availableClaimAmount,
    currentDepositAndWithdrawVault,
    sleep,
    claimWithFee,
    toast,
    fetchClaimData,
    refetchLatestTransactionHistory,
    crossChainFee,
  ])

  const isClaimDisabled = !vaultAddress || !usdcAddress || availableClaimAmount <= 0 || isClaiming || !address

  return (
    <AvailableClaimWrapper>
      <LeftContent>
        <span>
          <Trans>Claimable</Trans>
        </span>
        <span>
          <img src={usdc} alt='usdc' />
          <span>{formatNumber(availableClaimAmount)}</span>
        </span>
      </LeftContent>
      <RightContent>
        <NetworkSelector showAvailableClaimAmount colorMode={ColorMode.DARK} />
        <ButtonClaim onClick={handleClaim} $disabled={isClaimDisabled} $pending={isClaiming}>
          {isClaiming ? <Pending /> : <Trans>Claim</Trans>}
        </ButtonClaim>
      </RightContent>
    </AvailableClaimWrapper>
  )
}
