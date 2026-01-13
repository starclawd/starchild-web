import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { ClaimData } from '../vaultsdetail'
import { updateClaimData } from '../reducer'
import { useLazyGetClaimInfoQuery, VaultInfo } from 'api/vaults'
import { CHAIN_ID } from 'constants/chainInfo'

/**
 * ClaimInfo API数据获取hook
 */
export function useFetchClaimInfoData() {
  const [claimData, setClaimData] = useClaimInfo()
  const [triggerGetClaimInfo] = useLazyGetClaimInfoQuery()

  const fetchClaimData = useCallback(
    async ({ vaultInfo, walletAddress }: { vaultInfo: VaultInfo; walletAddress: string }) => {
      try {
        const chainIds = vaultInfo.supported_chains.map((chain) => chain.chain_id)
        const results = await Promise.all(
          chainIds.map((chainId) =>
            triggerGetClaimInfo({
              vaultId: vaultInfo.vault_id,
              walletAddress,
              chainId,
            }),
          ),
        )

        const newClaimData: ClaimData = chainIds.reduce((acc, chainId, idx) => {
          acc[chainId] = { claimableAmount: results[idx]?.data?.claimable_amount ?? 0 }
          return acc
        }, {} as ClaimData)
        setClaimData(newClaimData)
        return { success: true, data: newClaimData }
      } catch (error) {
        console.error('Error fetching claim info:', error)
        return { success: false, error }
      }
    },
    [triggerGetClaimInfo, setClaimData],
  )

  return {
    claimData,
    fetchClaimData,
  }
}

export function useClaimInfo(): [ClaimData, (value: ClaimData) => void] {
  const dispatch = useDispatch()
  const claimData = useSelector((state: RootState) => state.vaultsdetail.claimData)

  const setClaimData = useCallback(
    (value: ClaimData) => {
      dispatch(updateClaimData(value))
    },
    [dispatch],
  )

  return [claimData, setClaimData]
}
