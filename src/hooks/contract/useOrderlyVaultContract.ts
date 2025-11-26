import { getChainInfo } from 'constants/chainInfo'
import { Address, Hex } from 'viem'
import { useAppKitNetwork } from '@reown/appkit/react'
import { useWriteOrderlyVaultDeposit, useWriteOrderlyVaultWithdraw } from './useGeneratedHooks'

/**
 * Deposit 参数类型定义
 */
export interface DepositParams {
  payloadType: number // enum PayloadType (0-255)
  receiver: Address
  token: Address
  amount: bigint
  brokerHash: Hex // bytes32
}

/**
 * Withdraw 参数类型定义
 */
export interface WithdrawParams {
  payloadType: number // enum PayloadType (0-255)
  token: Address
  amount: bigint
  brokerHash: Hex // bytes32
}

/**
 * 使用 Orderly Vault 的 deposit 函数
 *
 * @example
 * const { writeContract, isPending, isSuccess } = useOrderlyVaultDeposit()
 *
 * const handleDeposit = async () => {
 *   await writeContract({
 *     payloadType: 0,
 *     receiver: '0x...',
 *     token: '0x...',
 *     amount: BigInt(1000000), // 1 USDC (6 decimals)
 *     brokerHash: '0x...'
 *   })
 * }
 */
export function useOrderlyVaultDeposit() {
  const { chainId } = useAppKitNetwork()
  const numericChainId = chainId ? Number(chainId) : undefined
  const chainInfo = getChainInfo(numericChainId)
  const contractAddress = chainInfo?.orderlyVaultContractAddress as Address | undefined

  const { writeContractAsync } = useWriteOrderlyVaultDeposit()

  const deposit = async (params: DepositParams) => {
    if (!contractAddress) {
      throw new Error('Orderly Vault contract address not found for current chain')
    }

    return writeContractAsync({
      address: contractAddress,
      args: [
        {
          payloadType: params.payloadType,
          receiver: params.receiver,
          token: params.token,
          amount: params.amount,
          brokerHash: params.brokerHash,
        },
      ],
    })
  }

  return deposit
}

/**
 * 使用 Orderly Vault 的 withdraw 函数
 *
 * @example
 * const { writeContract, isPending, isSuccess } = useOrderlyVaultWithdraw()
 *
 * const handleWithdraw = async () => {
 *   await writeContract({
 *     payloadType: 0,
 *     token: '0x...',
 *     amount: BigInt(1000000), // 1 USDC (6 decimals)
 *     brokerHash: '0x...'
 *   })
 * }
 */
export function useOrderlyVaultWithdraw() {
  const { chainId } = useAppKitNetwork()
  const numericChainId = chainId ? Number(chainId) : undefined
  const chainInfo = getChainInfo(numericChainId)
  const contractAddress = chainInfo?.orderlyVaultContractAddress as Address | undefined

  const { writeContractAsync } = useWriteOrderlyVaultWithdraw()

  const withdraw = async (params: WithdrawParams) => {
    if (!contractAddress) {
      throw new Error('Orderly Vault contract address not found for current chain')
    }

    return writeContractAsync({
      address: contractAddress,
      args: [
        {
          payloadType: params.payloadType,
          token: params.token,
          amount: params.amount,
          brokerHash: params.brokerHash,
        },
      ],
    })
  }

  return withdraw
}
