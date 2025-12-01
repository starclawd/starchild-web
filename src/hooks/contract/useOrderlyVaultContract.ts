import { Address, Hex } from 'viem'
import { useWriteOrderlyVaultDeposit, useWriteOrderlyVaultWithdraw } from './useGeneratedHooks'

/**
 * Deposit 参数类型定义
 */
export interface DepositParams {
  contractAddress: Address // Orderly Vault 合约地址
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
  contractAddress: Address // Orderly Vault 合约地址
  payloadType: number // enum PayloadType (0-255)
  token: Address
  amount: bigint
  brokerHash: Hex // bytes32
}

/**
 * 使用 Orderly Vault 的 deposit 函数
 *
 * @example
 * const deposit = useOrderlyVaultDeposit()
 *
 * const handleDeposit = async () => {
 *   await deposit({
 *     contractAddress: '0x...',
 *     payloadType: 0,
 *     receiver: '0x...',
 *     token: '0x...',
 *     amount: BigInt(1000000), // 1 USDC (6 decimals)
 *     brokerHash: '0x...'
 *   })
 * }
 */
export function useOrderlyVaultDeposit() {
  const { writeContractAsync } = useWriteOrderlyVaultDeposit()

  const deposit = async (params: DepositParams) => {
    if (!params.contractAddress) {
      throw new Error('Orderly Vault contract address is required')
    }

    return writeContractAsync({
      address: params.contractAddress,
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
 * const withdraw = useOrderlyVaultWithdraw()
 *
 * const handleWithdraw = async () => {
 *   await withdraw({
 *     contractAddress: '0x...',
 *     payloadType: 0,
 *     token: '0x...',
 *     amount: BigInt(1000000), // 1 USDC (6 decimals)
 *     brokerHash: '0x...'
 *   })
 * }
 */
export function useOrderlyVaultWithdraw() {
  const { writeContractAsync } = useWriteOrderlyVaultWithdraw()

  const withdraw = async (params: WithdrawParams) => {
    if (!params.contractAddress) {
      throw new Error('Orderly Vault contract address is required')
    }

    return writeContractAsync({
      address: params.contractAddress,
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
