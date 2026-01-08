import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { resetVaultDetail } from '../reducer'
import { updateCurrentDepositAndWithdrawVault } from 'store/vaults/reducer'
import { vaultsApi } from 'api/vaults'
import { strategyApi } from 'api/strategy'
import { strategyApi as createStrategyApi } from 'api/createStrategy'

export function useResetAllState() {
  const dispatch = useDispatch()
  return useCallback(() => {
    // 重置 Redux store 中的 vaultsdetail 状态
    dispatch(resetVaultDetail())
    // 重置 vaults 中 VaultDetail 使用的状态
    dispatch(updateCurrentDepositAndWithdrawVault(null))
    // 重置 RTK Query 缓存（vaultsApi 包括 vault 相关数据）
    dispatch(vaultsApi.util.resetApiState())
    // 重置 RTK Query 缓存（strategyApi 包括 strategy 相关数据）
    dispatch(strategyApi.util.resetApiState())
    // 重置 RTK Query 缓存（createStrategyApi 包括 PaperTradingPublic 等数据）
    dispatch(createStrategyApi.util.resetApiState())
  }, [dispatch])
}
