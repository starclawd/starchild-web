import { createGlobalStyle } from 'styled-components';
import { getTheme } from 'theme';

export const GlobalStyle = createGlobalStyle<{ theme: ReturnType<typeof getTheme> }>`
  .scroll-style {
    overflow: auto;
    &:hover {
      &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.textL5};
      }
    }
  }

  .scroll-style::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  .scroll-style::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 4px;
  }

  .scroll-style::-webkit-scrollbar-track {
    -webkit-border-radius: 0px;
    border-radius: 0px;
    background: transparent;
  }
  .scroll-style::-webkit-scrollbar-corner {
    background: ${({ theme }) => theme.textL5};
  }
`;