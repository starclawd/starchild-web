import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateStrategyDetail, changeIsLoadingStrategyDetail } from '../reducer'
import { useEffect } from 'react'
import { useGetStrategyDetailQuery } from 'api/createStrategy'
import useParsedQueryString from 'hooks/useParsedQueryString'

export function useStrategyDetail() {
  const dispatch = useDispatch()
  const { strategyId } = useParsedQueryString()
  const strategyDetail = useSelector((state: RootState) => state.createstrategy.strategyDetail)
  const isLoadingStrategyDetail = useSelector((state: RootState) => state.createstrategy.isLoadingStrategyDetail)
  const { data, isLoading, error, refetch } = useGetStrategyDetailQuery(
    { strategyId: strategyId || '' },
    {
      skip: !strategyId,
      refetchOnMountOrArgChange: true,
    },
  )

  useEffect(() => {
    if (data !== undefined) {
      dispatch(updateStrategyDetail(data))
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
