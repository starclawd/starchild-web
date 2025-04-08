import styled, { css } from 'styled-components'
import { ROLE_TYPE, TRADE_AI_TYPE } from 'store/tradeai/tradeai.d'

export const ContentItemWrapper = styled.div<{ role: ROLE_TYPE, isInputDislikeContent: boolean, isRendering?: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  padding-bottom: 26px;
  .user-operator-wrapper,
  .feedback-wrapper {
    display: none;
  }
  &:hover {
    .user-operator-wrapper,
    .feedback-wrapper {
      display: ${({ isRendering }) => isRendering ? 'none' : 'flex'};
    }
  }
  ${({ isRendering }) => isRendering && css`
    padding-bottom: 10px;
  `}
  ${({ role }) =>
    role === ROLE_TYPE.USER &&
    css`
      align-self: flex-end;
      width: fit-content;
      max-width: 70%;
    `
  }
  ${({ isInputDislikeContent }) => isInputDislikeContent && css`
    .feedback-wrapper {
      display: flex;
    }
  `}
`

export const ContentItem = styled.div<{ role: ROLE_TYPE, tradeAiTypeProp: TRADE_AI_TYPE }>`
  position: relative;
  display: flex;
  padding: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
  gap: 10px;
  width: 100%;
  word-break: break-word;
  color: ${({ theme }) => theme.text1};
  > img {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }
  a {
    color: ${({ theme }) => theme.green};
    &:hover {
      background: ${({ theme }) => theme.greenHover};
      -webkit-background-clip: text;
      color: transparent;
    }
  }
  ol, ul, dl, li, p {
    list-style: revert;
    padding: revert;
  }
  p, li, ol, ul {
    margin-bottom: 14px;
  }
  pre {
    padding: 12px;
    border-radius: 12px;
    overflow: auto;
    background-color: ${({ theme }) => theme.depthGreen};
    &::-webkit-scrollbar {
      width: auto;
      height: 3px;
    }
    &::-webkit-scrollbar-thumb {
      background: transparent;
      border-radius: 3px;
    }
    &::-webkit-scrollbar-track {
      -webkit-border-radius: 0px;
      border-radius: 0px;
      background: transparent;
    }
    &::-webkit-scrollbar-corner {
      background: ${({ theme }) => theme.text1};
    }
    &:hover {
      &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.text4};
        border-radius: 3px;
      }
    }
  }
  ${({ role }) =>
    role === ROLE_TYPE.USER &&
    css`
      align-self: flex-end;
      width: fit-content;
      padding: 10px 14px;
      border-radius: 12px;
      background: ${({ theme }) => theme.bg10};
    `
  }
  ${({ tradeAiTypeProp }) =>
    tradeAiTypeProp === TRADE_AI_TYPE.ORDER_TYPE &&
    css` 
      ol, ul {
        padding-left: 16px;
      }
    `
  }
  ${({ tradeAiTypeProp }) =>
    tradeAiTypeProp === TRADE_AI_TYPE.PAGE_TYPE &&
    css` 
        font-size: 16px;
        font-weight: 600;
        line-height: 20px;
    `
  }
`

export const Content = styled.div`
  width: fit-content;
  flex-grow: 1;
  ${({ role }) =>
    role === ROLE_TYPE.ASSISTANT &&
    css`
      padding-top: 2px;
      h4 {
        margin: 10px 0;
        &:first-child {
          margin-top: 0;
        }
      }
    `
  }
  ${({ role }) =>
    role === ROLE_TYPE.USER &&
    css`
      p {
        margin: 0;
      }
    `
  }
`