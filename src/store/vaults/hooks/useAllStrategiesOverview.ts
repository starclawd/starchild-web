import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateAllStrategies, setLoadingAllStrategies } from '../reducer'
import { StrategiesOverviewDataType, useGetAllStrategiesOverviewQuery } from 'api/strategy'

/**
 * AllStrategies数据管理和API获取hook
 */
export function useAllStrategiesOverview() {
  const dispatch = useDispatch()
  const allStrategies = useSelector((state: RootState) => state.vaults.allStrategies)
  const isLoadingAllStrategies = useSelector((state: RootState) => state.vaults.isLoadingAllStrategies)

  const { data, isLoading, error, refetch } = useGetAllStrategiesOverviewQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  const setAllStrategies = useCallback(
    (value: StrategiesOverviewDataType[]) => {
      dispatch(updateAllStrategies(value))
    },
    [dispatch],
  )

  useEffect(() => {
    if (data?.strategies) {
      dispatch(updateAllStrategies(data.strategies))
    }
  }, [data, dispatch])

  useEffect(() => {
    dispatch(setLoadingAllStrategies(isLoading))
  }, [isLoading, dispatch])

  return {
    allStrategies,
    isLoading: isLoadingAllStrategies,
    error,
    refetch,
    setAllStrategies,
  }
}

/**
 * 获取特定vault下的所有策略
 */
export function useStrategiesByVaultId(vaultId: string): StrategiesOverviewDataType[] {
  const allStrategies = useSelector((state: RootState) => state.vaults.allStrategies)

  return allStrategies.filter((strategy) => strategy.vault_id === vaultId)
}

/**
 * 根据strategyId获取策略
 */
export function useStrategiesById(strategyId: string): StrategiesOverviewDataType[] {
  const allStrategies = useSelector((state: RootState) => state.vaults.allStrategies)

  return allStrategies.filter((strategy) => strategy.strategy_id === strategyId)
}
