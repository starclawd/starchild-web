import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateAuthToken, updateGuestUser, clearGuestUser } from './reducer'
import { updateAuthTokenSession } from 'store/login/reducer'
import { isLocalEnv } from 'utils/url'
import { LOCAL_AUTHTOKEN } from 'constants/index'
import { GuestUserData } from './logincache.d'
export function useAuthToken(): [string, (authToken: string) => void] {
  const dispatch = useDispatch()
  let authToken = useSelector((state: RootState) => state.logincache.authToken)
  const authTokenSession = useSelector((state: RootState) => state.login.authTokenSession)
  const isTempStorageToken = useSelector((state: RootState) => state.logincache.isTempStorageToken)
  if (isTempStorageToken) {
    authToken = authTokenSession
  }
  const setAuthToken = useCallback(
    (authToken: string) => {
      if (isTempStorageToken) {
        dispatch(updateAuthTokenSession(authToken))
      } else {
        dispatch(updateAuthToken(authToken))
      }
    },
    [dispatch, isTempStorageToken],
  )
  return [isLocalEnv ? LOCAL_AUTHTOKEN || authToken : authToken, setAuthToken]
}

export function useGuestUser(): [GuestUserData | null, (guestUser: GuestUserData | null) => void, () => void] {
  const dispatch = useDispatch()
  const guestUser = useSelector((state: RootState) => state.logincache.guestUser)

  const setGuestUser = useCallback(
    (guestUser: GuestUserData | null) => {
      dispatch(updateGuestUser(guestUser))
    },
    [dispatch],
  )

  const clearGuestUserData = useCallback(() => {
    dispatch(clearGuestUser())
  }, [dispatch])

  return [guestUser, setGuestUser, clearGuestUserData]
}
