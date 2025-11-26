import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from 'store'
import { updateWalletInfo, setWalletAddress, setWalletNetwork, disconnectWallet } from '../reducer'
import { WalletInfo } from '../vaults'

// 获取钱包信息的 hook
export const useVaultWalletInfo = () => {
  return useSelector((state: RootState) => state.vaults.walletInfo)
}

// 管理钱包状态的 hook
export const useVaultWallet = () => {
  const dispatch = useDispatch()
  const walletInfo = useVaultWalletInfo()

  const updateWallet = useCallback(
    (walletData: Partial<WalletInfo>) => {
      dispatch(updateWalletInfo(walletData))
    },
    [dispatch],
  )

  const setAddress = useCallback(
    (address: string | null) => {
      dispatch(setWalletAddress(address))
    },
    [dispatch],
  )

  const setNetwork = useCallback(
    (network: string | null, chainId: number | null) => {
      dispatch(setWalletNetwork({ network, chainId }))
    },
    [dispatch],
  )

  const disconnect = useCallback(() => {
    dispatch(disconnectWallet())
  }, [dispatch])

  const connectWallet = useCallback(
    (address: string, network: string, chainId: number) => {
      dispatch(
        updateWalletInfo({
          address,
          network,
          chainId,
        }),
      )
    },
    [dispatch],
  )

  return {
    walletInfo,
    updateWallet,
    setAddress,
    setNetwork,
    disconnect,
    connectWallet,
  }
}
