import styled, { css } from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'

// Dropdown 模式的样式 - 只包含操作列表内容
export const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 160px;
  padding: 4px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.black700};
  box-shadow: 0px 4px 4px 0px ${({ theme }) => theme.systemShadow};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(160)};
      padding: ${vm(4)};
      border-radius: ${vm(12)};
    `}
`

export const DropdownItem = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  width: 100%;
  height: 36px;
  padding: 8px;
  border-radius: 8px;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.black0};

  i {
    font-size: 18px;
    color: ${({ theme, $color }) => $color || theme.black200};
  }

  span {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme, $color }) => $color || theme.black100};
  }

  ${({ theme }) =>
    theme.isMobile
      ? css`
          height: ${vm(36)};
          padding: ${vm(8)};
          border-radius: ${vm(8)};
          gap: ${vm(6)};
          i {
            font-size: 0.18rem;
          }
          span {
            font-size: 0.14rem;
            font-weight: 400;
            line-height: 0.2rem;
          }
        `
      : css`
          cursor: pointer;
          &:hover {
            background-color: ${({ theme }) => theme.bgT20};
          }
        `}
`

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  font-size: 18px;
  color: ${({ theme }) => theme.black200};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(24)};
      height: ${vm(24)};
      font-size: 0.18rem;
    `}
`

// Toolbar 模式的样式
export const ToolbarWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      position: sticky;
      bottom: 0;
      z-index: 5;
      justify-content: space-between;
      background-color: ${({ theme }) => theme.bgL0};
      padding: ${vm(8)} ${vm(20)};
      gap: ${vm(8)};
    `}
`
