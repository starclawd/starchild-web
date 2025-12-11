import { Address } from 'viem'
import { useAppKitAccount } from '@reown/appkit/react'
import { useWaitForTransactionReceipt } from 'wagmi'
import { useWriteVaultDepositTo, useReadVaultGetDepositFee } from './useGeneratedHooks'

/**
 * Vault 合约 DepositTo 数据结构
 */
export interface VaultDepositData {
  accountId: `0x${string}` // bytes32
  brokerHash: `0x${string}` // bytes32
  tokenHash: `0x${string}` // bytes32
  tokenAmount: bigint // uint128
}

/**
 * Vault DepositTo Hook 参数
 */
export interface UseVaultDepositToParams {
  contractAddress?: Address
  receiver: Address
  data: VaultDepositData
  value?: bigint // 如果是原生代币存款，需要传入 ETH 数量
}

/**
 * Vault DepositTo Hook
 * 简洁的存款功能，直接执行 depositTo 交易
 */
export function useVaultDepositTo({ contractAddress, receiver, data, value }: UseVaultDepositToParams) {
  const { address: account } = useAppKitAccount({ namespace: 'eip155' })

  // 写入合约方法
  const { writeContractAsync, data: txHash, isPending } = useWriteVaultDepositTo()

  // 等待交易确认
  const {
    isLoading: isConfirming,
    isSuccess,
    isError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  /**
   * 执行 depositTo 操作
   */
  const depositTo = async () => {
    if (!contractAddress) {
      throw new Error('Vault contract address is required')
    }

    if (!account) {
      throw new Error('Wallet not connected')
    }

    // 直接执行交易
    return await writeContractAsync({
      address: contractAddress,
      args: [receiver, data],
      value,
    })
  }

  return {
    // 状态
    isPending,
    isConfirming,
    isSuccess,
    isError,
    txHash,

    // 执行函数
    depositTo,

    // 原始数据
    receiver,
    data,
    value,
  }
}

/**
 * Vault GetDepositFee Hook 参数
 */
export interface UseVaultGetDepositFeeParams {
  contractAddress?: Address
  receiver?: Address
  data?: VaultDepositData
  enabled?: boolean // 是否启用查询
}

/**
 * Vault GetDepositFee Hook
 * 获取存款手续费
 */
export function useVaultGetDepositFee({
  contractAddress,
  receiver,
  data,
  enabled = true,
}: UseVaultGetDepositFeeParams = {}) {
  const result = useReadVaultGetDepositFee({
    address: contractAddress,
    args: receiver && data ? [receiver, data as any] : undefined,
    query: {
      enabled: enabled && !!contractAddress && !!receiver && !!data,
    },
  })

  return {
    // 费用金额 (bigint)
    depositFee: result.data,

    // 查询状态
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    isSuccess: result.isSuccess,

    // 重新获取函数
    refetch: result.refetch,

    // 原始数据
    receiver,
    data,
  }
}
