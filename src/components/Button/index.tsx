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
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  padding: 8px;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.textL1};
  border-radius: 60px;
  background: ${({ theme }) => theme.blue200};
  ${({ theme, disabled, pending }) =>
    theme.isMobile
      ? css`
          height: ${vm(60)};
          padding: ${vm(8)};
          font-size: 0.16rem;
          line-height: 0.24rem;
          border-radius: ${vm(60)};
        `
      : css`
          cursor: pointer;
          ${!disabled &&
          !pending &&
          css`
            &:hover {
              opacity: 0.7;
            }
          `}
        `}
  ${({ theme, pending, disabled }) =>
    (pending || disabled) &&
    css`
      color: ${theme.textL3};
      cursor: not-allowed;
      background: ${theme.bgT20};
    `}
`

export const ButtonBorder = styled(BaseButton)<{ pending?: boolean; disabled?: boolean }>`
  width: 100%;
  height: 60px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  padding: 8px;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.textL1};
  border-radius: 60px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.bgT30};
  ${({ theme, disabled, pending }) =>
    theme.isMobile
      ? css`
          height: ${vm(60)};
          padding: ${vm(8)};
          font-size: 0.16rem;
          line-height: 0.24rem;
          border-radius: ${vm(60)};
        `
      : css`
          cursor: pointer;
          ${!disabled &&
          !pending &&
          css`
            &:hover {
              opacity: 0.7;
            }
          `}
        `}
`

export const HomeButton = styled(BaseButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 40px;
  color: #000;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  border-radius: 80px;
  border: 1px solid #fff;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%);
  ${({ theme }) =>
    theme.isMobile
      ? css``
      : css`
          cursor: pointer;
        `}
`
