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
      dispatch(updateMyStrategies(data.data.strategies))
    } else {
      dispatch(updateMyStrategies([]))
    }
  }, [data, dispatch])

  useEffect(() => {
    dispatch(setLoadingMyStrategies(isLoading))
  }, [isLoading, dispatch])

  return { myStrategies, isLoadingMyStrategies, refetch }
}
