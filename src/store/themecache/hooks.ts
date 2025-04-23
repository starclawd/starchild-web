import { RootState } from "store"
import { useDispatch, useSelector } from "react-redux"
import { ThemeMode, toggleTheme } from "./reducer"
import { useCallback, useContext } from "react"
import { ThemeContext } from "styled-components"
import { getTheme } from "styles/theme"

export function useThemeManager(): [ThemeMode, () => void] {
  const dispatch = useDispatch()
  const mode = useSelector((state: RootState) => state.themecache.mode)

  const setLocale = useCallback(
    () => {
      dispatch(toggleTheme())
    },
    [dispatch]
  )

  return [mode, setLocale]
}

export function useTheme() {
  const [mode] = useThemeManager()
  return useContext(ThemeContext) || getTheme(mode)
}

export function useIsDarkMode(): boolean {
  const mode = useSelector((state: RootState) => state.themecache.mode)
  const isDark = mode === 'dark'
  window.isDark = isDark
  return isDark
}