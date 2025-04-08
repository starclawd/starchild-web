import { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider as StyledThemeProvider, createGlobalStyle } from 'styled-components';
import { RootState } from 'store';
import { getTheme } from 'styles/theme';
import { useActiveLocale } from 'hooks/useActiveLocale';
import { useIsMobile } from 'store/application/hooks';

// 创建全局样式，根据当前主题设置基本样式
const GlobalStyle = createGlobalStyle<{ theme: ReturnType<typeof getTheme> }>`
  .scroll-style-page {
    overflow: auto;
  }
  .scroll-style {
    overflow: auto;
    &:hover {
      &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.text4};
      }
    }
  }

  .scroll-style::-webkit-scrollbar,
  .scroll-style-page::-webkit-scrollbar
   {
    width: 3px;
    height: 3px;
  }
  .scroll-style::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 3px;
  }
  .scroll-style-page::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.text4};
    border-radius: 3px;
  }

  .scroll-style::-webkit-scrollbar-track,
  .scroll-style-page::-webkit-scrollbar-track
   {
    -webkit-border-radius: 0px;
    border-radius: 0px;
    background: transparent;
  }
  .scroll-style::-webkit-scrollbar-corner,
  .scroll-style-page::-webkit-scrollbar-corner
   {
    background: ${({ theme }) => theme.text4};
  }
`;

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const isMobile = useIsMobile()
  const local = useActiveLocale()
  const { mode } = useSelector((state: RootState) => state.theme);
  const theme = {
    ...getTheme(mode),
    local,
    isMobile,
  };
  
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