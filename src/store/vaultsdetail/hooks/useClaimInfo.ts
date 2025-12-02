import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { ClaimData } from '../vaultsdetail'
import { updateClaimData } from '../reducer'
import { useLazyGetClaimInfoQuery } from 'api/vaults'
import { CHAIN_ID } from 'constants/chainInfo'

/**
 * ClaimInfo API数据获取hook
 */
export function useFetchClaimInfoData() {
  const [claimData, setClaimData] = useClaimInfo()
  const [triggerGetClaimInfo] = useLazyGetClaimInfoQuery()

  const fetchClaimData = useCallback(
    async ({ vaultId, walletAddress }: { vaultId: string; walletAddress: string }) => {
      try {
        const chainIds = [CHAIN_ID.ARBITRUM, CHAIN_ID.BASE, CHAIN_ID.OPTIMISM, CHAIN_ID.SEI]

        const results = await Promise.all(
          chainIds.map((chainId) =>
            triggerGetClaimInfo({
              vaultId,
              walletAddress,
              chainId: chainId.toString(),
            }),
          ),
        )

        const newClaimData: ClaimData = {
          [CHAIN_ID.ARBITRUM]: {
            claimableAmount: results[0].data?.claimable_amount ?? 0,
          },
          [CHAIN_ID.BASE]: {
            claimableAmount: results[1].data?.claimable_amount ?? 0,
          },
          [CHAIN_ID.OPTIMISM]: {
            claimableAmount: results[2].data?.claimable_amount ?? 0,
          },
          [CHAIN_ID.SEI]: {
            claimableAmount: results[3].data?.claimable_amount ?? 0,
          },
        }
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
