import { useDispatch, useSelector } from 'react-redux'
import { updateCurrentActiveNavKey, updateIsFixMenu } from './reducer'
import { useCallback } from 'react'
import { RootState } from 'store'

export function useIsFixMenu(): [boolean, (newIsFixMenu: boolean) => void] {
  const dispatch = useDispatch()
  const isFixMenu = useSelector((state: RootState) => state.headercache.isFixMenu)

  const setIsFixMenu = useCallback(
    (newIsFixMenu: boolean) => {
      dispatch(updateIsFixMenu(newIsFixMenu))
    },
    [dispatch],
  )

  return [isFixMenu, setIsFixMenu]
}

export function useCurrentActiveNavKey(): [string, (newCurrentActiveNavKey: string) => void] {
  const dispatch = useDispatch()
  const currentActiveNavKey = useSelector((state: RootState) => state.headercache.currentActiveNavKey)

  const setCurrentActiveNavKey = useCallback(
    (newCurrentActiveNavKey: string) => {
      dispatch(updateCurrentActiveNavKey(newCurrentActiveNavKey))
    },
    [dispatch],
  )

  return [currentActiveNavKey, setCurrentActiveNavKey]
}
