import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { resetSignalList, setLoadingSignalList, updateSignalList } from '../reducer'
import { CombinedSignalType, SIGNAL_TYPE, StrategySignalDataType, useGetStrategySignalQuery } from 'api/strategy'
import { useIsLogin } from 'store/login/hooks'

export function useSetSignalList() {
  const dispatch = useDispatch()
  const setSignalList = useCallback(
    (signalList: StrategySignalDataType[]) => {
      dispatch(
        updateSignalList(
          signalList.filter((item) => item.type === SIGNAL_TYPE.COMBINED_SIGNAL || item.type === SIGNAL_TYPE.LOG),
        ),
      )
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
    const items: CombinedSignalType[] = [
      ...(data?.items || []).filter(
        (item: CombinedSignalType) => item.type === SIGNAL_TYPE.COMBINED_SIGNAL || item.type === SIGNAL_TYPE.LOG,
      ),
    ]
    if (items.length > 0) {
      items.sort((a, b) => b.timestamp - a.timestamp)
      dispatch(updateSignalList(items))
    }
  }, [data, dispatch])

  useEffect(() => {
    dispatch(setLoadingSignalList(isLoading))
  }, [isLoading, dispatch])

  return {
    signalList,
    isLoadingSignalList,
    error,
    refetch,
  }
}
