import { createGlobalStyle, css } from 'styled-components'
import { getTheme } from 'theme'

export const GlobalStyle = createGlobalStyle<{ theme: ReturnType<typeof getTheme> }>`
  input, textarea {
    caret-color: ${({ theme }) => theme.brand100};
  }
  .scroll-style {
    overflow: auto;
    
    &:hover {
      /* 这是WebKit浏览器的一个已知渲染bug，滚动条伪元素（::-webkit-scrollbar-thumb）的样式有时不会在hover状态下正确重绘 */
      transform: translateZ(0);
       &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.brand100};
      }
    }

    /* 非 textarea 元素添加固定的 padding-right */
    &:not(textarea) {
      ${({ theme }) =>
        !theme.isMobile &&
        css`
          padding-right: 14px;
        `}
    }

    /* textarea 元素在有滚动条时的样式 */
    &.has-scrollbar {
      ${({ theme }) =>
        !theme.isMobile &&
        css`
          padding-right: 14px;
          margin-right: 4px;
        `}
    }
  }

  ${({ theme }) =>
    theme.isMobile
      ? css`
          .scroll-style {
            scrollbar-width: none;
          }

          .scroll-style::-webkit-scrollbar {
            display: none;
          }

          /* 修复第三方钱包modal字体大小问题 */
          w3m-modal,
          wui-modal,
          wcm-modal,
          appkit-modal {
            font-size: 16px !important;
          }

          /* 针对shadow DOM内的元素 */
          w3m-modal *,
          wui-modal *,
          wcm-modal *,
          appkit-modal * {
            font-size: 16px !important;
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
            background: ${({ theme }) => theme.text10};
          }
        `}
`
