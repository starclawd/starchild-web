import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"
import { updateAuthToken } from "./reducer"
import { updateAuthTokenSession } from "store/login/reducer"

export function useAuthToken(): [string, (authToken: string) => void] {
  const dispatch = useDispatch()
  let authToken = useSelector((state: RootState) => state.userCache.authToken)
  const authTokenSession = useSelector((state: RootState) => state.login.authTokenSession)
  const tempStorageToken = useSelector((state: RootState) => state.userCache.tempStorageToken)
  if (tempStorageToken) {
    authToken = authTokenSession
  }
  const setAuthToken = useCallback((authToken: string) => {
    if (tempStorageToken) {
      dispatch(updateAuthTokenSession(authToken))
    } else {
      dispatch(updateAuthToken(authToken))
    }
  }, [dispatch, tempStorageToken])
  return [authToken, setAuthToken]
}