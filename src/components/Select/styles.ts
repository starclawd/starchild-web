import styled, { css } from 'styled-components'
import { Placement } from '@popperjs/core'
import { ButtonBorder } from 'components/Button'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'

export const SelectWrapper = styled.div<{ disabled: boolean }>`
  position: relative;
  display: flex;
  width: 100%;
  height: 44px;
  outline: none;
  cursor: pointer;
  &:hover {
    z-index: 1000;
  }
  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
    `}
`

export const PopoverContainer = styled.ul<{
  $begainToHide: boolean
  $usePortal: boolean
  $disableDisappearAni: boolean
}>`
  position: absolute;
  top: 46px;
  left: 0;
  width: 540px;
  height: auto;
  margin: 0;
  padding: 8px;
  z-index: 1000;
  border-radius: 12px;
  padding: 4px;
  background-color: ${({ theme }) => theme.black700};
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.5);
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(4)};
    `}
  ${({ $usePortal }) =>
    $usePortal
      ? css`
          &.top,
          &.top-start,
          &.top-end {
            animation: opacityTopShow ${ANI_DURATION}s;
          }
          &.left,
          &.left-start,
          &.left-end {
            animation: opacityLeftShow ${ANI_DURATION}s;
          }
          &.right,
          &.right-start,
          &.right-end {
            animation: opacityRightShow ${ANI_DURATION}s;
          }
          &.bottom,
          &.bottom-start,
          &.bottom-end {
            animation: opacityBottomShow ${ANI_DURATION}s;
          }
        `
      : css`
          animation: selectNoPortalShow ${ANI_DURATION}s;
        `}
  ${({ $begainToHide, $disableDisappearAni }) =>
    $begainToHide && !$disableDisappearAni
      ? css`
          opacity: 0;
          animation: opacityDisappear ${ANI_DURATION}s;
        `
      : $begainToHide &&
        css`
          display: none;
        `};
`

export const PopoverList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 200px;
  overflow: auto;
`

export const PopoverItem = styled.li<{ $isActive: boolean; $popItemHoverBg: string }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  height: 36px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.textL2};
  &:hover {
    background-color: ${({ theme, $popItemHoverBg }) => $popItemHoverBg || theme.bgT20};
  }
  .icon-chat-complete {
    font-size: 18px;
    color: ${({ theme }) => theme.brand100};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(36)};
      padding: ${vm(8)};
      border-radius: ${vm(8)};
      font-size: 0.14rem;
      font-weight: 400;
      line-height: 0.2rem;
      .icon-chat-complete {
        font-size: 0.18rem;
      }
    `}
`

export const ReferenceElement = styled.div<{
  $show: boolean
  $begainToHide?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  .icon-chat-expand {
    transition: transform ${ANI_DURATION}s;
  }
  ${({ $show }) => css`
    .icon-chat-expand {
      transform: ${$show ? 'rotate(-90deg)' : 'rotate(-270deg)'};
    }
  `}
  ${({ $begainToHide }) =>
    $begainToHide &&
    css`
      opacity: 1;
    `}
`

export const SelectBorderWrapper = styled(ButtonBorder)`
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0 8px 0 12px;
  border-radius: 12px;
  backdrop-filter: blur(8px);
  background-color: ${({ theme }) => theme.black700};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: 0 ${vm(8)} 0 ${vm(12)};
    `}
`

export const InputWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 28px;
  margin-bottom: 4px;
  input {
    width: 100%;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    border-radius: 6px;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(28)};
      margin-bottom: ${vm(4)};
      input {
        font-size: 0.12rem;
        font-weight: 600;
        line-height: 0.16rem;
        border-radius: ${vm(6)};
      }
    `}
`
