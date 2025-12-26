import { useLazyApproveAgentQuery, SignatureObject, useLazyDepositToHyperliquidVaultQuery } from 'api/hyperliquid'
import { useCallback } from 'react'

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
