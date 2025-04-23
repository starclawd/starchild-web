import { createGlobalStyle } from 'styled-components';
import { getTheme } from 'theme';

export const GlobalStyle = createGlobalStyle<{ theme: ReturnType<typeof getTheme> }>`
  .scroll-style {
    overflow: auto;
    &:hover {
      &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.text4};
      }
    }
  }

  .scroll-style::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }
  .scroll-style::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 3px;
  }

  .scroll-style::-webkit-scrollbar-track {
    -webkit-border-radius: 0px;
    border-radius: 0px;
    background: transparent;
  }
  .scroll-style::-webkit-scrollbar-corner {
    background: ${({ theme }) => theme.text4};
  }
`;