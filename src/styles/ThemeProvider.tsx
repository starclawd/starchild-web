import { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider as StyledThemeProvider, createGlobalStyle } from 'styled-components';
import { RootState } from 'store';
import { getTheme } from 'styles/theme';

// 创建全局样式，根据当前主题设置基本样式
const GlobalStyle = createGlobalStyle<{ theme: ReturnType<typeof getTheme> }>`
  
`;

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { mode } = useSelector((state: RootState) => state.theme);
  const theme = getTheme(mode);
  
  // 设置HTML data-theme属性，可用于CSS选择器
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  return (
    <StyledThemeProvider theme={theme}>
      <>
        <GlobalStyle theme={theme} />
        {children}
      </>
    </StyledThemeProvider>
  );
}; 