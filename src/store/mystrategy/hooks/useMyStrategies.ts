import dayjs from 'dayjs'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { useEffect } from 'react'
import { updateMyStrategies, setLoadingMyStrategies } from '../reducer'
import { useGetMyStrategiesQuery } from 'api/createStrategy'
import { useUserInfo } from 'store/login/hooks'

export function useMyStrategies() {
  const dispatch = useDispatch()
  const [{ userInfoId }] = useUserInfo()
  const myStrategies = useSelector((state: RootState) => state.mystrategy.myStrategies)
  const isLoadingMyStrategies = useSelector((state: RootState) => state.mystrategy.isLoadingMyStrategies)
  const { data, isLoading, refetch } = useGetMyStrategiesQuery(undefined, {
    skip: !userInfoId,
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    if (data?.status === 'success') {
      const strategies = [...data.data.strategies]
      strategies.sort((a, b) => dayjs(b.created_at).unix() - dayjs(a.created_at).unix())
      dispatch(updateMyStrategies(strategies))
    } else {
      dispatch(updateMyStrategies([]))
    }
  }, [data, dispatch])

  useEffect(() => {
    dispatch(setLoadingMyStrategies(isLoading))
  }, [isLoading, dispatch])

  return { myStrategies, isLoadingMyStrategies, refetch }
}
