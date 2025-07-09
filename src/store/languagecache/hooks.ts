import { LOCAL_TEXT } from 'constants/locales'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserLocale } from './reducer'
import { useCallback } from 'react'
import { RootState } from 'store'

export function useUserLocaleManager(): [LOCAL_TEXT | null, (newLocale: LOCAL_TEXT) => void] {
  const dispatch = useDispatch()
  const locale = useSelector((state: RootState) => state.languagecache.userLocale)

  const setLocale = useCallback(
    (newLocale: LOCAL_TEXT) => {
      dispatch(updateUserLocale(newLocale))
    },
    [dispatch],
  )

  return [locale, setLocale]
}
