import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateStrategyDetail, changeIsLoadingStrategyDetail } from '../reducer'
import { useCallback, useEffect } from 'react'
import { useGetStrategyDetailQuery, useLazyEditStrategyQuery } from 'api/createStrategy'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useIsLogin, useUserInfo } from 'store/login/hooks'

export function useStrategyDetail() {
  const dispatch = useDispatch()
  const [{ userInfoId }] = useUserInfo()
  const { strategyId } = useParsedQueryString()
  const strategyDetail = useSelector((state: RootState) => state.createstrategy.strategyDetail)
  const isLoadingStrategyDetail = useSelector((state: RootState) => state.createstrategy.isLoadingStrategyDetail)
  const { data, isLoading, error, refetch } = useGetStrategyDetailQuery(
    { strategyId: strategyId || '' },
    {
      skip: !strategyId || !userInfoId,
      refetchOnMountOrArgChange: true,
    },
  )

  useEffect(() => {
    if (data?.status === 'success') {
      dispatch(updateStrategyDetail(data.data))
    }
  }, [data, dispatch])

  useEffect(() => {
    dispatch(changeIsLoadingStrategyDetail({ isLoadingStrategyDetail: isLoading }))
  }, [isLoading, dispatch])

  return {
    strategyDetail,
    isLoadingStrategyDetail,
    error,
    refetch,
  }
}

export function useEditStrategy() {
  const [triggerEditStrategy] = useLazyEditStrategyQuery()
  return useCallback(
    async ({ name, strategyId, description }: { name: string; strategyId: string; description: string }) => {
      try {
        const data = await triggerEditStrategy({ name, strategyId, description })
        return data
      } catch (error) {
        console.error(error)
        return null
      }
    },
    [triggerEditStrategy],
  )
}
