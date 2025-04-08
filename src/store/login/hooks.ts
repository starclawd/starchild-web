import { useDispatch, useSelector } from "react-redux"
import { LOGIN_STATUS } from "./login.d"
import { useCallback } from "react"
import { updateLoginStatus } from "./reducer"
import { RootState } from "store"

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
