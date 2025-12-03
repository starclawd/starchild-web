import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateAllStrategies, setLoadingAllStrategies } from '../reducer'
import { AllStrategiesOverview } from '../vaults.d'
import { transformAllStrategiesOverview } from '../dataTransforms'
import { useLazyGetAllStrategiesOverviewQuery } from 'api/strategy'

/**
 * AllStrategies数据管理hook
 */
export function useAllStrategiesOverview(): [AllStrategiesOverview[], (value: AllStrategiesOverview[]) => void] {
  const dispatch = useDispatch()
  const allStrategies = useSelector((state: RootState) => state.vaults.allStrategies)

  const setAllStrategies = useCallback(
    (value: AllStrategiesOverview[]) => {
      dispatch(updateAllStrategies(value))
    },
    [dispatch],
  )

  return [allStrategies, setAllStrategies]
}

/**
 * AllStrategies API数据获取hook
 */
export function useFetchAllStrategiesOverviewData() {
  const [allStrategies, setAllStrategies] = useAllStrategiesOverview()
  const isLoading = useSelector((state: RootState) => state.vaults.isLoadingAllStrategies)
  const [triggerGetAllStrategiesOverview] = useLazyGetAllStrategiesOverviewQuery()
  const dispatch = useDispatch()

  const fetchAllStrategiesOverview = useCallback(async () => {
    dispatch(setLoadingAllStrategies(true))

    try {
      const result = await triggerGetAllStrategiesOverview()
      if (result.data) {
        const transformedData = transformAllStrategiesOverview(result.data.strategies)
        console.log('transformedData', transformedData)
        setAllStrategies(transformedData)
        return { success: true, data: transformedData }
      } else {
        console.error('Failed to fetch all strategies overview:', result.error)
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Error fetching all strategies overview:', error)
      return { success: false, error }
    } finally {
      dispatch(setLoadingAllStrategies(false))
    }
  }, [triggerGetAllStrategiesOverview, setAllStrategies, dispatch])

  return {
    allStrategies,
    isLoading,
    fetchAllStrategiesOverview,
  }
}

/**
 * 获取特定vault下的所有策略
 */
export function useStrategiesByVaultId(vaultId: string): AllStrategiesOverview[] {
  const allStrategies = useSelector((state: RootState) => state.vaults.allStrategies)

  return allStrategies.filter((strategy) => strategy.vaultId === vaultId)
}

/**
 * 根据strategyId获取策略
 */
export function useStrategiesById(strategyId: string): AllStrategiesOverview[] {
  const allStrategies = useSelector((state: RootState) => state.vaults.allStrategies)

  return allStrategies.filter((strategy) => strategy.strategyId === strategyId)
}
