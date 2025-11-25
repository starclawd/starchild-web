import { getChainInfo } from 'constants/chainInfo'
import { Address } from 'viem'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import {
  useReadErc20Name,
  useReadErc20Symbol,
  useReadErc20Decimals,
  useReadErc20TotalSupply,
  useReadErc20BalanceOf,
  useReadErc20Allowance,
} from './useGeneratedHooks'

/**
 * USDC 合约 Hook（基于 Wagmi CLI 自动生成）
 * 根据当前连接的链自动获取 USDC 合约地址
 *
 * 使用 Wagmi CLI 官方生成的 hooks，提供完整的类型安全和功能支持
 *
 * @example
 * const usdc = useUsdcContract()
 * console.log(usdc.name.data) // "USD Coin"
 * console.log(usdc.symbol.data) // "USDC"
 */
export function useUsdcContract() {
  const { chainId } = useAppKitNetwork()
  const { address: account, isConnected } = useAppKitAccount({ namespace: 'eip155' })

  // 将 chainId 转换为 number 类型
  const numericChainId = chainId ? Number(chainId) : undefined
  const chainInfo = getChainInfo(numericChainId)
  const contractAddress = chainInfo?.usdcContractAddress as Address | undefined

  // 使用 Wagmi CLI 自动生成的 ERC20 Hooks
  const name = useReadErc20Name({
    address: contractAddress,
  })

  const symbol = useReadErc20Symbol({
    address: contractAddress,
  })

  const decimals = useReadErc20Decimals({
    address: contractAddress,
  })

  const totalSupply = useReadErc20TotalSupply({
    address: contractAddress,
  })

  console.log('💰 USDC Contract Hook:', {
    name: name.data,
    symbol: symbol.data,
    decimals: decimals.data,
    totalSupply: totalSupply.data,
    isLoading: {
      name: name.isLoading,
      symbol: symbol.isLoading,
      decimals: decimals.isLoading,
      totalSupply: totalSupply.isLoading,
    },
  })

  return {
    address: contractAddress,
    name: name.data,
    symbol: symbol.data,
    decimals: decimals.data,
    totalSupply: totalSupply.data,
    isLoading: name.isLoading || symbol.isLoading || decimals.isLoading || totalSupply.isLoading,
    error: name.error || symbol.error || decimals.error || totalSupply.error,
  }
}

/**
 * 查询 USDC 余额
 * @param owner - 账户地址
 */
export function useUsdcBalanceOf(owner: Address) {
  const { chainId } = useAppKitNetwork()
  const numericChainId = chainId ? Number(chainId) : undefined
  const chainInfo = getChainInfo(numericChainId)
  const contractAddress = chainInfo?.usdcContractAddress as Address | undefined

  const result = useReadErc20BalanceOf({
    address: contractAddress,
    args: [owner],
  })

  return {
    balance: result.data,
    isLoading: result.isLoading,
    error: result.error,
  }
}

/**
 * 查询 USDC 授权额度
 * @param owner - 所有者地址
 * @param spender - 被授权者地址
 */
export function useUsdcAllowance(owner: Address, spender: Address) {
  const { chainId } = useAppKitNetwork()
  const numericChainId = chainId ? Number(chainId) : undefined
  const chainInfo = getChainInfo(numericChainId)
  const contractAddress = chainInfo?.usdcContractAddress as Address | undefined

  const result = useReadErc20Allowance({
    address: contractAddress,
    args: [owner, spender],
  })

  return {
    allowance: result.data,
    isLoading: result.isLoading,
    error: result.error,
  }
}
