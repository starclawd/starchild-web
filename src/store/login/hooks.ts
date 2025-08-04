import { useDispatch, useSelector } from 'react-redux'
import { LOGIN_STATUS, QRCODE_STATUS, TelegramUser, UserInfoData } from './login.d'
import { useCallback } from 'react'
import { updateLoginStatus, updateUserInfo } from './reducer'
import { RootState } from 'store'
import { useLazyGetQrcodeIdQuery, useLazyGetQrcodeStatusQuery } from 'api/qrcode'
import { useAuthToken } from 'store/logincache/hooks'
import { useLazyGetAuthTokenQuery, useLazyGetUserInfoQuery } from 'api/user'
import { useUpdateLanguageFromAPI } from 'store/language/hooks'

export function useIsLogin() {
  const [loginStatus] = useLoginStatus()
  return loginStatus === LOGIN_STATUS.LOGGED
}

export function useIsLogout() {
  const [loginStatus] = useLoginStatus()
  return loginStatus === LOGIN_STATUS.NO_LOGIN
}

export function useLoginStatus(): [LOGIN_STATUS, (loginStatus: LOGIN_STATUS) => void] {
  const dispatch = useDispatch()
  const loginStatus = useSelector((state: RootState) => state.login.loginStatus)
  const setLoginStatus = useCallback(
    (loginStatus: LOGIN_STATUS) => {
      dispatch(updateLoginStatus(loginStatus))
    },
    [dispatch],
  )
  window.loginStatus = loginStatus
  return [loginStatus, setLoginStatus]
}

export function useGetQrcodeId(): () => Promise<any> {
  const [triggerGetQrcodeId] = useLazyGetQrcodeIdQuery()
  return useCallback(async () => {
    try {
      const data = await triggerGetQrcodeId(1)
      return data
    } catch (error) {
      return error
    }
  }, [triggerGetQrcodeId])
}

export function useGetQrcodeStatus(): (qrcodeId: string) => Promise<any> {
  const [, setAuthToken] = useAuthToken()
  const [triggerGetQrcodeStatus] = useLazyGetQrcodeStatusQuery()
  return useCallback(
    async (qrcodeId: string) => {
      try {
        const data = await triggerGetQrcodeStatus({ qrcodeId })
        if (data.isSuccess) {
          const result = data.data
          if (result.status === QRCODE_STATUS.CONFIRMED) {
            const { authToken } = result
            setAuthToken(authToken as string)
          }
        }
        return data
      } catch (error) {
        return error
      }
    },
    [triggerGetQrcodeStatus, setAuthToken],
  )
}

export function useGetUserInfo(): () => Promise<any> {
  const [, setUserInfo] = useUserInfo()
  const [triggerGetUserInfo] = useLazyGetUserInfoQuery()
  const updateLanguageFromAPI = useUpdateLanguageFromAPI()

  return useCallback(async () => {
    try {
      const data = await triggerGetUserInfo(1)
      if (data.isSuccess) {
        const result = data.data
        const { language, ...rest } = result
        setUserInfo(rest)

        // 更新用户语言
        updateLanguageFromAPI(language)
      }
      return data
    } catch (error) {
      return error
    }
  }, [triggerGetUserInfo, setUserInfo, updateLanguageFromAPI])
}

export function useUserInfo(): [UserInfoData, (userInfo: UserInfoData) => void] {
  const dispatch = useDispatch()
  const userInfo = useSelector((state: RootState) => state.login.userInfo)
  const setUserInfo = useCallback(
    (userInfo: UserInfoData) => {
      dispatch(updateUserInfo(userInfo))
    },
    [dispatch],
  )
  return [userInfo, setUserInfo]
}

export function useGetAuthToken(): (user: TelegramUser) => Promise<any> {
  const [, setAuthToken] = useAuthToken()
  const [triggerGetAuthToken] = useLazyGetAuthTokenQuery()
  return useCallback(
    async (user: TelegramUser) => {
      try {
        const data = await triggerGetAuthToken(user)
        if (data.isSuccess) {
          const result = data.data
          setAuthToken(result.token as string)
        }
        return data
      } catch (error) {
        return error
      }
    },
    [triggerGetAuthToken, setAuthToken],
  )
}
