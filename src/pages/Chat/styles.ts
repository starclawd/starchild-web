import styled, { css } from 'styled-components'
import { ROLE_TYPE } from 'store/chat/chat.d'
import { vm } from 'pages/helper'

export const ContentItemWrapper = styled.div<{ role: ROLE_TYPE }>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  padding-bottom: 40px;
  gap: 4px;
  ${({ role }) =>
    role === ROLE_TYPE.USER &&
    css`
      align-self: flex-end;
      width: fit-content;
      max-width: 82.5%;
    `}

  ${({ theme, role }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
      max-width: 100%;
      padding-bottom: ${vm(20)};
      ${role === ROLE_TYPE.USER &&
      css`
        max-width: ${vm(280)};
      `}
    `}
`

export const ContentItem = styled.div<{ role: ROLE_TYPE }>`
  position: relative;
  display: flex;
  padding: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
  gap: 28px;
  width: 100%;
  word-break: break-word;
  > img {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }
  ${({ role }) =>
    role === ROLE_TYPE.USER
      ? css`
          align-self: flex-end;
          width: fit-content;
          padding: 16px;
          border-radius: 12px;
          color: ${({ theme }) => theme.black100};
          background: ${({ theme }) => theme.black600};
        `
      : css`
          flex-direction: column;
          align-items: flex-start;
        `}
  ${({ theme, role }) =>
    theme.isMobile &&
    css`
      ${role === ROLE_TYPE.USER
        ? css`
            padding: ${vm(8)};
            border-radius: ${vm(8)};
            font-size: 0.16rem;
            font-weight: 400;
            line-height: 0.22rem;
          `
        : css`
            gap: ${vm(20)};
          `}
    `}
`

export const Content = styled.div`
  width: fit-content;
  flex-grow: 1;
  ${({ role }) =>
    role === ROLE_TYPE.ASSISTANT &&
    css`
      width: 100%;
      border-radius: 24px;
      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
      color: ${({ theme }) => theme.black100};
      .markdown-wrapper {
        width: 100%;
      }
    `}
  ${({ role }) =>
    role === ROLE_TYPE.USER &&
    css`
      p {
        margin: 0;
      }
    `}
  ${({ theme, role }) =>
    theme.isMobile &&
    css`
      ${role === ROLE_TYPE.ASSISTANT &&
      css`
        border-radius: ${vm(24)};
        font-size: 0.16rem;
        font-weight: 400;
        line-height: 0.22rem;
        color: ${theme.black100};
      `}
    `}
`

export const ItemImgWrapper = styled.span`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  width: 100%;
  height: auto;
  gap: 8px;
  img {
    width: 540px;
    border-radius: 12px;
  }
  span {
    width: 100%;
    text-align: right;
    font-size: 11px;
    font-weight: 400;
    line-height: 16px;
    color: ${({ theme }) => theme.black200};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin-top: ${vm(8)};
      gap: ${vm(8)};
      border-radius: ${vm(24)};
      img {
        width: 100%;
        border-radius: ${vm(12)};
      }
      span {
        font-size: 0.11rem;
        font-weight: 400;
        line-height: 0.16rem;
      }
    `}
`
