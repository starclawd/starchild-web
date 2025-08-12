import styled, { css } from 'styled-components'
import { ROLE_TYPE } from 'store/chat/chat.d'
import { vm } from 'pages/helper'

export const ContentItemWrapper = styled.div<{ role: ROLE_TYPE }>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  padding-bottom: 12px;
  gap: 4px;
  ${({ role }) =>
    role === ROLE_TYPE.USER &&
    css`
      align-self: flex-end;
      width: fit-content;
      max-width: 70%;
    `}

  ${({ theme, role }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
      max-width: 100%;
      padding-bottom: ${vm(12)};
      ${role === ROLE_TYPE.USER &&
      css`
        max-width: ${vm(346)};
      `}
    `}
`

export const ContentItem = styled.div<{ role: ROLE_TYPE }>`
  position: relative;
  display: flex;
  padding: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  gap: 4px;
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
          border-radius: 16px;
          color: ${({ theme }) => theme.white};
          background: ${({ theme }) => theme.brand100};
        `
      : css`
          flex-direction: column;
          align-items: flex-start;
        `}
  ${({ theme, role }) =>
    theme.isMobile &&
    css`
      ${role === ROLE_TYPE.USER &&
      css`
        gap: ${vm(4)};
        padding: ${vm(8)};
        border-radius: ${vm(16)};
        background: ${theme.brand100};
        color: ${theme.white};
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
      padding: 16px;
      border-radius: 24px;
      background: ${({ theme }) => theme.bgL1};
      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
      color: ${({ theme }) => theme.textL2};
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
        padding: ${vm(16)};
        border-radius: ${vm(24)};
        background: ${theme.bgL1};
        font-size: 0.16rem;
        font-weight: 400;
        line-height: 0.22rem;
        color: ${theme.textL2};
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
    color: ${({ theme }) => theme.textL3};
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
