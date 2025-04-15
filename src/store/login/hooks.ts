import { useDispatch, useSelector } from "react-redux"
import { LOGIN_STATUS } from "./login.d"
import { useCallback } from "react"
import { updateLoginStatus } from "./reducer"
import { RootState } from "store"
import { useLazyGetQrcodeIdQuery, useLazyGetQrcodeStatusQuery } from "api/qrcode"

export function useIsLogin() {
  const [loginStatus] = useLoginStatus()
  return loginStatus === LOGIN_STATUS.LOGGED
}

export function useLoginStatus() {
  const dispatch = useDispatch()
  const loginStatus = useSelector((state: RootState) => state.login.loginStatus)
  const setLoginStatus = useCallback(
    (loginStatus: LOGIN_STATUS) => {
      dispatch(updateLoginStatus(loginStatus))
    },
    [dispatch]
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
  const [triggerGetQrcodeStatus] = useLazyGetQrcodeStatusQuery()
  return useCallback(async (qrcodeId: string) => {
    try {
      const data = await triggerGetQrcodeStatus({ qrcodeId })
      return data
    } catch (error) {
      return error
    }
  }, [triggerGetQrcodeStatus])
}
