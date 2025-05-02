import { createGlobalStyle, css } from 'styled-components';
import { getTheme } from 'theme';

export const GlobalStyle = createGlobalStyle<{ theme: ReturnType<typeof getTheme> }>`
  .scroll-style {
    overflow: auto;
    ${({ theme }) => !theme.isMobile && css`
      padding-right: 14px;
      margin-right: 4px;
    `}
    &:hover {
      &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.textL5};
      }
    }
  }
  ${({ theme }) => theme.isMobile
  ? css`
    .scroll-style {
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }

    .scroll-style::-webkit-scrollbar {
      display: none;
    }
  `
  : css`
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
  `}
`;