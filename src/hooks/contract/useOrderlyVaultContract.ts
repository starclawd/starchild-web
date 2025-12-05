import { Address, Hex } from 'viem'
import {
  useWriteOrderlyVaultDeposit,
  useWriteOrderlyVaultWithdraw,
  useWriteOrderlyVaultClaimWithFee,
} from './useGeneratedHooks'

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
  value?: bigint // 交易附带的 ETH（用于支付跨链手续费）
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
  value?: bigint // 交易附带的 ETH（用于支付跨链手续费）
}

/**
 * ClaimWithFee 参数类型定义
 */
export interface ClaimWithFeeParams {
  contractAddress: Address // Orderly Vault 合约地址
  roleType: number // enum RoleType (0-255)
  token: Address
  brokerHash: Hex // bytes32
  value?: bigint // 交易附带的 ETH（用于支付手续费）
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
      value: params.value,
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
      value: params.value,
    })
  }

  return withdraw
}

/**
 * 使用 Orderly Vault 的 claimWithFee 函数
 *
 * @example
 * const claimWithFee = useOrderlyVaultClaimWithFee()
 *
 * const handleClaim = async () => {
 *   await claimWithFee({
 *     contractAddress: '0x...',
 *     roleType: 0, // LP = 0, SP = 1
 *     token: '0x...',
 *     brokerHash: '0x...',
 *     value: BigInt(0), // 可选：手续费
 *   })
 * }
 */
export function useOrderlyVaultClaimWithFee() {
  const { writeContractAsync } = useWriteOrderlyVaultClaimWithFee()

  const claimWithFee = async (params: ClaimWithFeeParams) => {
    if (!params.contractAddress) {
      throw new Error('Orderly Vault contract address is required')
    }

    return writeContractAsync({
      address: params.contractAddress,
      args: [
        {
          roleType: params.roleType,
          token: params.token,
          brokerHash: params.brokerHash,
        },
      ],
      value: params.value,
    })
  }

  return claimWithFee
}
