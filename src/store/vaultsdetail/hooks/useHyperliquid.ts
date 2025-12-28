import {
  useLazyApproveAgentQuery,
  SignatureObject,
  useLazyDepositToHyperliquidVaultQuery,
  useLazyWithdrawFromHyperliquidVaultQuery,
  useGetClearinghouseStateQuery,
  useGetVaultDetailsQuery,
} from 'api/hyperliquid'
import { useCallback, useMemo } from 'react'

export function useApproveAgent() {
  const [triggerApproveAgent] = useLazyApproveAgentQuery()
  return useCallback(
    async (signatureChainId: string, agentAddress: string, nonce: number, signature: SignatureObject) => {
      try {
        const result = await triggerApproveAgent({
          signatureChainId,
          agentAddress,
          nonce,
          signature,
        })
        return result
      } catch (error) {
        console.error('Error approving agent:', error)
        return null
      }
    },
    [triggerApproveAgent],
  )
}

export function useDepositToHyperliquidVault() {
  const [triggerDepositToHyperliquidVault] = useLazyDepositToHyperliquidVaultQuery()
  return useCallback(
    async (vaultAddress: string, amount: number, nonce: number, signature: SignatureObject) => {
      try {
        const result = await triggerDepositToHyperliquidVault({
          vaultAddress,
          amount,
          nonce,
          signature,
        })
        return result
      } catch (error) {
        console.error('Error depositing to hyperliquid vault:', error)
        return null
      }
    },
    [triggerDepositToHyperliquidVault],
  )
}

export function useWithdrawFromHyperliquidVault() {
  const [triggerWithdrawFromHyperliquidVault] = useLazyWithdrawFromHyperliquidVaultQuery()
  return useCallback(
    async (vaultAddress: string, amount: number, nonce: number, signature: SignatureObject) => {
      try {
        const result = await triggerWithdrawFromHyperliquidVault({
          vaultAddress,
          amount,
          nonce,
          signature,
        })
        return result
      } catch (error) {
        console.error('Error withdrawing from hyperliquid vault:', error)
        return null
      }
    },
    [triggerWithdrawFromHyperliquidVault],
  )
}

// 获取 Hyperliquid 账户余额（可 deposit 的数量）
export function useHyperliquidAccountBalance(user: string | undefined) {
  const { data, isLoading, refetch } = useGetClearinghouseStateQuery({ user: user || '' }, { skip: !user })

  const availableBalance = useMemo(() => {
    if (!data) return 0
    // withdrawable 是可用余额
    return parseFloat(data.withdrawable || '0')
  }, [data])

  return {
    data,
    availableBalance,
    isLoading,
    refetch,
  }
}

// 获取用户在 Vault 中的存款信息（可 withdraw 的数量）
export function useHyperliquidVaultPosition(vaultAddress: string, user: string | undefined) {
  const { data, isLoading, refetch } = useGetVaultDetailsQuery({ vaultAddress, user }, { skip: !vaultAddress || !user })

  // vaultEquity 是用户在 vault 中的权益（已存入的总数量）
  const depositedAmount = useMemo(() => {
    if (!data?.followerState) return 0
    return parseFloat(data.followerState.vaultEquity || '0')
  }, [data])

  // maxWithdrawable 是最大可提取金额
  const withdrawableAmount = useMemo(() => {
    if (!data) return 0
    return data.maxWithdrawable || 0
  }, [data])

  // lockupUntil 是锁定期结束时间
  const lockupUntil = useMemo(() => {
    if (!data?.followerState) return 0
    return data.followerState.lockupUntil || 0
  }, [data])

  // 是否仍在锁定期内
  const isLocked = useMemo(() => {
    if (!lockupUntil) return false
    return Date.now() < lockupUntil
  }, [lockupUntil])

  return {
    data,
    depositedAmount,
    withdrawableAmount,
    lockupUntil,
    isLocked,
    isLoading,
    refetch,
  }
}
