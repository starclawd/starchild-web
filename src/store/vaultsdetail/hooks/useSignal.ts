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

export function useSignalList({ strategyId, mode }: { strategyId: string; mode: 'paper_trading' | 'live' }) {
  const dispatch = useDispatch()
  const isLogin = useIsLogin()
  const signalList = useSelector((state: RootState) => state.vaultsdetail.signalList)
  const isLoadingSignalList = useSelector((state: RootState) => state.vaultsdetail.isLoadingSignalList)

  const { data, isLoading, error, refetch } = useGetStrategySignalQuery(
    { strategyId, page: 1, size: 20, mode },
    {
      skip: !strategyId || !isLogin,
    },
  )

  useEffect(() => {
    dispatch(resetSignalList())
    const items: StrategySignalDataType[] = [...(data?.items || [])]
    if (items.length > 0) {
      items.sort((a, b) => a.timestamp - b.timestamp)
      dispatch(updateSignalList(items))
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
