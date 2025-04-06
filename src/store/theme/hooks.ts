import { useDispatch, useSelector } from "react-redux"
import { ThemeMode, toggleTheme } from "./reducer"
import { useCallback } from "react"
import { RootState } from "store"

export function useThemeManager(): [ThemeMode, () => void] {
  const dispatch = useDispatch()
  const mode = useSelector((state: RootState) => state.theme.mode)

  const setLocale = useCallback(
    () => {
      dispatch(toggleTheme())
    },
    [dispatch]
  )

  return [mode, setLocale]
}
