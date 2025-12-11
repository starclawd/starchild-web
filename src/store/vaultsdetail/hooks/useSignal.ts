import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { resetSignalList, setLoadingSignalList, updateSignalList } from '../reducer'
import { StrategySignalDataType, useGetStrategySignalQuery } from 'api/strategy'
import { useIsLogin } from 'store/login/hooks'

export function useSetSignalList() {
  const dispatch = useDispatch()
  const setSignalList = useCallback(
    (signalList: StrategySignalDataType[]) => {
      dispatch(updateSignalList(signalList))
    },
    [dispatch],
  )
  return setSignalList
}

export function useSignalList({ strategyId }: { strategyId: string }) {
  const dispatch = useDispatch()
  const isLogin = useIsLogin()
  const signalList = useSelector((state: RootState) => state.vaultsdetail.signalList)
  const isLoadingSignalList = useSelector((state: RootState) => state.vaultsdetail.isLoadingSignalList)

  const { data, isLoading, error, refetch } = useGetStrategySignalQuery(
    { strategyId, page: 1, size: 20 },
    {
      skip: !strategyId || !isLogin,
    },
  )

  useEffect(() => {
    dispatch(resetSignalList())
    if (data !== undefined) {
      if (data.length > 0) {
        dispatch(updateSignalList(data))
      }
    }
  }, [data, dispatch])

  useEffect(() => {
    dispatch(setLoadingSignalList(isLoading))
  }, [isLoading, dispatch])

  const vaultSignalList = useMemo(() => {
    return signalList.filter((signal) => signal.type)
  }, [signalList])

  const paperTradingSignalList = useMemo(() => {
    return signalList.filter((signal) => signal.type)
  }, [signalList])

  return { vaultSignalList, paperTradingSignalList, isLoadingSignalList, error, refetch }
}
