import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { resetSignalList, setLoadingSignalList, updateSignalList } from '../reducer'
import { StrategySignalDataType, useGetStrategySignalQuery } from 'api/vaults'

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
  const signalList = useSelector((state: RootState) => state.vaultsdetail.signalList)
  const isLoadingSignalList = useSelector((state: RootState) => state.vaultsdetail.isLoadingSignalList)

  const { data, isLoading, error, refetch } = useGetStrategySignalQuery(
    { strategyId, page: 1, size: 20 },
    {
      skip: !strategyId,
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

  return { signalList, isLoadingSignalList, error, refetch }
}
