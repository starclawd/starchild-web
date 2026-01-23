import { useLazyGenerateStrategyCodeQuery, useLazyGetStrategyCodeQuery } from 'api/createStrategy'
import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import {
  updateStrategyCode,
  changeIsLoadingStrategyCode,
  setIsGeneratingCode,
  setCodeLoadingPercent,
  setIsTypewritingCode,
  setIsShowExpandCode,
} from '../reducer'
import { useGetStrategyCodeQuery } from 'api/createStrategy'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useIsLogin, useUserInfo } from 'store/login/hooks'
import { ParamFun } from 'types/global'
import { useCreateStrategyDetail } from './useCreateStrategyDetail'
import { useSendChatUserContent } from './useStream'
import { t } from '@lingui/core/macro'

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
  const isLogin = useIsLogin()
  const [{ userInfoId }] = useUserInfo()
  const strategyCode = useSelector((state: RootState) => state.createstrategy.strategyCode)
  const isLoadingStrategyCode = useSelector((state: RootState) => state.createstrategy.isLoadingStrategyCode)
  const { data, isLoading, error, refetch } = useGetStrategyCodeQuery(
    { strategyId },
    {
      skip: !strategyId || !userInfoId || !isLogin,
      refetchOnMountOrArgChange: true,
    },
  )
  const [triggerGetStrategyCode] = useLazyGetStrategyCodeQuery()

  const fetchStrategyCode = useCallback(
    async (id: string) => {
      try {
        const result = await triggerGetStrategyCode({ strategyId: id })
        if (result.data?.status === 'success') {
          dispatch(updateStrategyCode(result.data.data))
        }
        return result
      } catch (error) {
        console.error(error)
        return null
      }
    },
    [triggerGetStrategyCode, dispatch],
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
    fetchStrategyCode,
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
  const [isGeneratingCode] = useIsGeneratingCode()
  const { strategyDetail } = useCreateStrategyDetail({ strategyId: strategyId || '' })
  const sendChatUserContent = useSendChatUserContent()
  const isCreateSuccess = useMemo(() => {
    return !!strategyDetail?.strategy_config
  }, [strategyDetail])
  const handleGenerateCode = useCallback(
    async (generateMsg?: string) => {
      if (!isCreateSuccess || isGeneratingCode) return
      sendChatUserContent({
        value: generateMsg ? generateMsg : t`Generate Code`,
      })
    },
    [sendChatUserContent, isCreateSuccess, isGeneratingCode],
  )
  return handleGenerateCode
}

export function useCodeLoadingPercent(): [number, ParamFun<number>] {
  const dispatch = useDispatch()
  const codeLoadingPercent = useSelector((state: RootState) => state.createstrategy.codeLoadingPercent)
  const updateCodeLoadingPercent = useCallback(
    (value: number) => {
      dispatch(setCodeLoadingPercent(value))
    },
    [dispatch],
  )
  return [codeLoadingPercent, updateCodeLoadingPercent]
}

export function useIsTypewritingCode(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isTypewritingCode = useSelector((state: RootState) => state.createstrategy.isTypewritingCode)
  const updateIsTypewritingCode = useCallback(
    (value: boolean) => {
      dispatch(setIsTypewritingCode(value))
    },
    [dispatch],
  )
  return [isTypewritingCode, updateIsTypewritingCode]
}

export function useIsShowExpandCode(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isShowExpandCode = useSelector((state: RootState) => state.createstrategy.isShowExpandCode)
  const updateIsShowExpandCode = useCallback(
    (value: boolean) => {
      dispatch(setIsShowExpandCode(value))
    },
    [dispatch],
  )
  return [isShowExpandCode, updateIsShowExpandCode]
}
