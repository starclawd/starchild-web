import { ReactNode, useEffect, useMemo } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { getTheme } from 'theme'
import { useActiveLocale } from 'hooks/useActiveLocale'
import { useIsMobile } from 'store/application/hooks'
import { useThemeManager } from 'store/themecache/hooks'
import { GlobalStyle } from 'styles/globalStyled'

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const isMobile = useIsMobile()
  const local = useActiveLocale()
  const [mode] = useThemeManager()

  // 缓存theme对象，避免频繁重新创建导致所有使用useTheme的组件重渲染
  const theme = useMemo(
    () => ({
      ...getTheme(mode),
      local,
      isMobile,
    }),
    [mode, local, isMobile],
  )

  // 设置HTML data-theme属性，可用于CSS选择器
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode])

  return (
    <StyledThemeProvider theme={theme}>
      <>
        <GlobalStyle theme={theme} />
        {children}
      </>
    </StyledThemeProvider>
  )
}
