import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateAllFollowedStrategies, setLoadingAllFollowedStrategies } from '../reducer'
import { StrategiesOverviewDataType, useGetAllFollowedStrategiesOverviewQuery } from 'api/strategy'
import { useUserInfo } from 'store/login/hooks'

/**
 * AllFollowedStrategies数据管理和API获取hook
 */
export function useAllFollowedStrategiesOverview() {
  const dispatch = useDispatch()
  const [{ userInfoId }] = useUserInfo()
  const allFollowedStrategies = useSelector((state: RootState) => state.mystrategy.allFollowedStrategies)
  const isLoadingAllFollowedStrategies = useSelector(
    (state: RootState) => state.mystrategy.isLoadingAllFollowedStrategies,
  )

  const { data, isLoading, error, refetch } = useGetAllFollowedStrategiesOverviewQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !userInfoId,
  })

  const setAllFollowedStrategies = useCallback(
    (value: StrategiesOverviewDataType[]) => {
      dispatch(updateAllFollowedStrategies(value))
    },
    [dispatch],
  )

  useEffect(() => {
    if (data?.strategies) {
      // 按 all_time_apr 倒序排列
      const sortedStrategies = [...data.strategies].sort((a, b) => {
        const aprA = a.all_time_apr ?? 0
        const aprB = b.all_time_apr ?? 0
        return aprB - aprA
      })
      dispatch(updateAllFollowedStrategies(sortedStrategies))
    }
  }, [data, dispatch])

  useEffect(() => {
    dispatch(setLoadingAllFollowedStrategies(isLoading))
  }, [isLoading, dispatch])

  return {
    allFollowedStrategies,
    isLoading: isLoadingAllFollowedStrategies,
    error,
    refetch,
    setAllFollowedStrategies,
  }
}
