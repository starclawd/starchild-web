
import { useDispatch, useSelector } from "react-redux"
import { updateIsFixMenu } from "./reducer"
import { useCallback } from "react"
import { RootState } from "store"

export function useIsFixMenu(): [boolean, (newIsFixMenu: boolean) => void] {
  const dispatch = useDispatch()
  const isFixMenu = useSelector((state: RootState) => state.headercache.isFixMenu)

  const setIsFixMenu = useCallback(
    (newIsFixMenu: boolean) => {
      dispatch(updateIsFixMenu(newIsFixMenu))
    },
    [dispatch]
  )

  return [isFixMenu, setIsFixMenu]
}
