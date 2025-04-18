import styled, { css } from 'styled-components'
import { ROLE_TYPE, TRADE_AI_TYPE } from 'store/tradeai/tradeai.d'
import { vm } from 'pages/helper'

export const ContentItemWrapper = styled.div<{ role: ROLE_TYPE, isInputDislikeContent: boolean, isRendering?: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  padding-bottom: 12px;
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
  ${({ theme, role }) => theme.isMobile && css`
    max-width: 100%;
    padding-bottom: ${vm(12)};
    ${role === ROLE_TYPE.USER && css`
      max-width: ${vm(320)};
    `}
  `}
`

export const ContentItem = styled.div<{ role: ROLE_TYPE }>`
  position: relative;
  display: flex;
  padding: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
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
    role === ROLE_TYPE.USER
    ? css`
      align-self: flex-end;
      width: fit-content;
      padding: 10px 14px;
      border-radius: 12px;
      background: ${({ theme }) => theme.bg10};
    `
    : css`
      flex-direction: column;
      align-items: flex-start;
    `
  }
  ${({ theme, role }) => theme.isMobile && css`
    ${role === ROLE_TYPE.USER
    && css`
      padding: ${vm(12)};
      border-radius: ${vm(16)};
      background: #335FFC;
      color: #fff;
      font-size: 0.13rem;
      font-weight: 400;
      line-height: 0.2rem;
    `}
  `}
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
  ${({ theme, role }) => theme.isMobile && css`
    ${role === ROLE_TYPE.ASSISTANT && css`
      padding: ${vm(12)};
      border-radius: ${vm(24)};
      background: ${theme.bgL2};
      font-size: 0.14rem;
      font-weight: 400;
      line-height: 0.2rem;
      color: #FFF;
    `}
  `}
`