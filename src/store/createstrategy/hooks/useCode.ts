import { useLazyGenerateStrategyCodeQuery } from 'api/createStrategy'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateStrategyCode, changeIsLoadingStrategyCode } from '../reducer'
import { useGetStrategyCodeQuery } from 'api/createStrategy'

export function useGenerateStrategyCode() {
  const [triggerGenerateStrategyCode] = useLazyGenerateStrategyCodeQuery()
  return useCallback(
    async (strategyId: string) => {
      try {
        const data = await triggerGenerateStrategyCode({ strategyId })
        return data
      } catch (error) {
        console.error(error)
        return null
      }
    },
    [triggerGenerateStrategyCode],
  )
}

export function useStrategyCode(strategyId: string) {
  const dispatch = useDispatch()
  const strategyCode = useSelector((state: RootState) => state.createstrategy.strategyCode)
  const isLoadingStrategyCode = useSelector((state: RootState) => state.createstrategy.isLoadingStrategyCode)
  const { data, isLoading, error, refetch } = useGetStrategyCodeQuery({ strategyId })
  useEffect(() => {
    if (data !== undefined) {
      dispatch(updateStrategyCode(data))
    }
  }, [data, dispatch])
  useEffect(() => {
    dispatch(changeIsLoadingStrategyCode({ isLoadingStrategyCode: isLoading }))
  }, [isLoading, dispatch])
  return {
    strategyCode,
    isLoadingStrategyCode,
    error,
    refetch,
  }
}
