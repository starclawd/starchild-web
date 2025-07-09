/**
 * 通用的button处理
 */
import styled, { css } from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'

export const BaseButton = styled.span<{
  padding?: string
  width?: string
  $borderRadius?: string
  altDisabledStyle?: boolean
}>`
  padding: ${({ padding }) => padding ?? '16px'};
  width: ${({ width }) => width ?? '100%'};
  font-weight: 500;
  text-align: center;
  border-radius: ${({ $borderRadius }) => $borderRadius ?? '20px'};
  outline: none;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: ${({ theme }) => (theme.isMobile ? 'default' : 'pointer')};
  position: relative;
  user-select: none;
  z-index: 1;
  &:disabled {
    opacity: 50%;
    cursor: auto;
    pointer-events: none;
  }

  will-change: transform;
  transition: transform 450ms ease;
  transform: perspective(1px) translateZ(0);

  > * {
    user-select: none;
  }

  > a {
    text-decoration: none;
  }
`

export const ButtonCommon = styled(BaseButton)<{ pending?: boolean; disabled?: boolean }>`
  width: 100%;
  height: 60px;
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
  padding: 8px;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.black};
  border-radius: 60px;
  background: ${({ theme }) => theme.jade10};
  ${({ theme }) =>
    theme.isMobile
      ? css`
          font-size: 0.18rem;
          font-weight: 500;
          line-height: 0.26rem;
          border-radius: ${vm(60)};
          /* &:active {
          background: ${theme.jade10};
        } */
        `
      : css`
          /* &:hover {
          background: ${theme.jade10};
        } */
        `}
  ${({ theme, pending, disabled }) =>
    (pending || disabled) &&
    css`
      color: ${theme.textL4};
      cursor: not-allowed;
      background: ${theme.sfC2};
      ${theme.isMobile
        ? css`
            /* &:active {
              background: ${theme.sfC2};
            } */
          `
        : css`
            /* &:hover {
              background: ${theme.sfC2};
            } */
          `}
    `}
`

export const ButtonBorder = styled(BaseButton)<{ pending?: boolean; disabled?: boolean }>`
  width: 100%;
  height: 60px;
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
  padding: 8px;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.textL1};
  border-radius: 60px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.bgT30};
`
