// for create page
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { useGetUserConfigQuery } from 'api/createStrategy'
import { useUserInfo } from 'store/login/hooks'
import { useEffect } from 'react'
import { updateUserConfig, changeIsLoadingUserConfig } from '../reducer'

export function useUserConfig() {
  const dispatch = useDispatch()
  const [{ userInfoId }] = useUserInfo()
  const userConfig = useSelector((state: RootState) => state.createstrategy.userConfig)
  const isLoadingUserConfig = useSelector((state: RootState) => state.createstrategy.isLoadingUserConfig)
  const { data, isLoading, error, refetch } = useGetUserConfigQuery(undefined, {
    skip: !userInfoId,
    refetchOnMountOrArgChange: true,
  })
  useEffect(() => {
    if (data?.status === 'success') {
      dispatch(updateUserConfig(data.data))
    }
  }, [data, dispatch])

  useEffect(() => {
    dispatch(changeIsLoadingUserConfig({ isLoadingUserConfig: isLoading }))
  }, [isLoading, dispatch])

  return {
    userConfig,
    isLoadingUserConfig,
    error,
    refetch,
  }
}
