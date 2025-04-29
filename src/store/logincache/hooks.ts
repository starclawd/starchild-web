import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"
import { updateAuthToken } from "./reducer"
import { updateAuthTokenSession } from "store/login/reducer"
import { isLocalEnv } from "utils/url"

export function useAuthToken(): [string, (authToken: string) => void] {
  const dispatch = useDispatch()
  let authToken = useSelector((state: RootState) => state.logincache.authToken)
  const authTokenSession = useSelector((state: RootState) => state.login.authTokenSession)
  const isTempStorageToken = useSelector((state: RootState) => state.logincache.isTempStorageToken)
  if (isTempStorageToken) {
    authToken = authTokenSession
  }
  const setAuthToken = useCallback((authToken: string) => {
    if (isTempStorageToken) {
      dispatch(updateAuthTokenSession(authToken))
    } else {
      dispatch(updateAuthToken(authToken))
    }
  }, [dispatch, isTempStorageToken])
  return [
    isLocalEnv 
      ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldm1BY2NvdW50IjoiMHg1OWJCMzE0NzQzNTI3MjQ1ODNiRUIwMzAyMTBjN0I5NkU5RDBkOGU5IiwiZXhwIjoxNzQ4MjM5ODE3LCJpYXQiOjE3NDU2NDc4MTcsInNvbEFjY291bnQiOiIweDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAifQ.gG6Hn8rHmuQenRhU1HQofX8cQOPKthxtoq_sefcaudY'
      : authToken,
    setAuthToken]
}