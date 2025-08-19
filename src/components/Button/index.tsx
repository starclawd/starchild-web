/**
 * 通用的button处理
 */
import { memo, ComponentPropsWithoutRef } from 'react'
import styled, { css } from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'
import Pending from 'components/Pending'

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
  background: ${({ theme }) => theme.brand200};
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
  white-space: nowrap;
  border: 1px solid #fff;
  transition: all ${ANI_DURATION}s;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%);
  ${({ theme }) =>
    theme.isMobile
      ? css`
          width: ${vm(160)};
          height: ${vm(32)};
          font-size: 0.13rem;
          line-height: 0.2rem;
          border-radius: ${vm(80)};
        `
      : css`
          cursor: pointer;
          &:hover {
            opacity: 0.7;
          }
        `}
`

// Styled component for IconButton
const StyledIconButton = styled(ButtonCommon)<{
  $color?: string
  size?: 'small' | 'medium' | 'large'
}>`
  display: flex;
  align-items: center;
  width: fit-content;
  background: transparent;
  color: ${({ theme, $color }) => ($color ? $color : theme.textL3)};

  /* Size variations - 目前都使用 medium 尺寸 */
  ${({ size = 'medium' }) => {
    switch (size) {
      case 'small':
        // TODO: 待定义 small 尺寸
        return css`
          gap: 6px;
          height: 40px;
          padding: 8px;
          border-radius: 32px;
          font-size: 24px;

          .pending-wrapper {
            .icon-loading {
              font-size: 24px;
            }
          }
        `
      case 'large':
        // TODO: 待定义 large 尺寸
        return css`
          gap: 6px;
          height: 40px;
          padding: 8px;
          border-radius: 32px;
          font-size: 24px;

          .pending-wrapper {
            .icon-loading {
              font-size: 24px;
            }
          }
        `
      case 'medium':
      default:
        return css`
          gap: 6px;
          height: 40px;
          padding: 8px;
          border-radius: 32px;
          font-size: 24px;

          .pending-wrapper {
            .icon-loading {
              font-size: 24px;
            }
          }
        `
    }
  }}

  .pending-wrapper {
    .icon-loading {
      color: ${({ theme }) => theme.textL3};
    }
  }

  &:hover {
    background: ${({ theme }) => theme.bgT30};
    opacity: 1;
  }

  ${({ theme, size = 'medium' }) =>
    theme.isMobile &&
    css`
      &:hover {
        background: transparent;
      }
      /* Mobile size variations - 目前都使用 medium 尺寸 */
      ${size === 'small' &&
      css`
        /* TODO: 待定义 mobile small 尺寸 */
        padding: ${vm(5)};
        height: ${vm(28)};
        gap: ${vm(4)};
        font-size: 0.18rem;
      `}
      ${size === 'medium' &&
      css`
        padding: ${vm(5)};
        height: ${vm(28)};
        gap: ${vm(4)};
        font-size: 0.18rem;
      `}
      ${size === 'large' &&
      css`
        /* TODO: 待定义 mobile large 尺寸 */
        padding: ${vm(5)};
        height: ${vm(28)};
        gap: ${vm(4)};
        font-size: 0.18rem;
      `}
      .pending-wrapper {
        .icon-loading {
          font-size: 0.18rem !important;
        }
      }
    `}
`

// IconButton 组件属性类型
export interface IconButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'color'> {
  icon: string // icon className，如 'icon-chat-share'（必需）
  size?: 'small' | 'medium' | 'large' // 默认 medium 尺寸
  color?: string // 图标颜色
  pending?: boolean
}

// IconButton React 组件
export const IconButton = memo<IconButtonProps>(
  ({ icon, size = 'medium', color, pending, onClick, disabled, ...restProps }) => {
    return (
      <StyledIconButton
        as='button'
        size={size}
        $color={color}
        pending={pending}
        disabled={disabled}
        onClick={onClick}
        {...restProps}
      >
        {pending ? <Pending /> : <IconBase className={icon} />}
      </StyledIconButton>
    )
  },
)

IconButton.displayName = 'IconButton'
