import { useLazyGenerateStrategyCodeQuery } from 'api/createStrategy'
import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateStrategyCode, changeIsLoadingStrategyCode, setIsGeneratingCode } from '../reducer'
import { useGetStrategyCodeQuery } from 'api/createStrategy'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useUserInfo } from 'store/login/hooks'
import { ParamFun } from 'types/global'
import { useStrategyDetail } from './useStrategyDetail'

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

export function useStrategyCode({ strategyId }: { strategyId: string }) {
  const dispatch = useDispatch()
  const [{ userInfoId }] = useUserInfo()
  const strategyCode = useSelector((state: RootState) => state.createstrategy.strategyCode)
  const isLoadingStrategyCode = useSelector((state: RootState) => state.createstrategy.isLoadingStrategyCode)
  const { data, isLoading, error, refetch } = useGetStrategyCodeQuery(
    { strategyId },
    {
      skip: !strategyId || !userInfoId,
      refetchOnMountOrArgChange: true,
    },
  )
  useEffect(() => {
    if (data?.status === 'success') {
      dispatch(updateStrategyCode(data.data))
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

export function useIsGeneratingCode(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isGeneratingCode = useSelector((state: RootState) => state.createstrategy.isGeneratingCode)
  const updateIsGeneratingCode = useCallback(
    (value: boolean) => {
      dispatch(setIsGeneratingCode(value))
    },
    [dispatch],
  )
  return [isGeneratingCode, updateIsGeneratingCode]
}

export function useHandleGenerateCode() {
  const { strategyId } = useParsedQueryString()
  const { refetch: refetchStrategyCode } = useStrategyCode({ strategyId: strategyId || '' })
  const [isGeneratingCode, setIsGeneratingCode] = useIsGeneratingCode()
  const { strategyDetail } = useStrategyDetail({ strategyId: strategyId || '' })
  const triggerGenerateStrategyCode = useGenerateStrategyCode()
  const isCreateSuccess = useMemo(() => {
    return !!strategyDetail?.strategy_config
  }, [strategyDetail])
  const handleGenerateCode = useCallback(async () => {
    try {
      if (!isCreateSuccess || isGeneratingCode) return
      setIsGeneratingCode(true)
      const data = await triggerGenerateStrategyCode(strategyId || '')
      if (data?.data?.status === 'success') {
        await refetchStrategyCode()
      }
      setIsGeneratingCode(false)
    } catch (error) {
      console.error('handleGenerateCode error', error)
      setIsGeneratingCode(false)
    }
  }, [
    strategyId,
    triggerGenerateStrategyCode,
    refetchStrategyCode,
    setIsGeneratingCode,
    isCreateSuccess,
    isGeneratingCode,
  ])
  return handleGenerateCode
}
