import styled, { css } from 'styled-components'
import { ButtonBorder } from 'components/Button'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'

export const SelectWrapper = styled.div<{ disabled: boolean }>`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
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
  width: 160px;
  height: auto;
  margin: 0;
  padding: 4px;
  z-index: 1000;
  border-radius: 4px;
  padding: 4px;
  background-color: ${({ theme }) => theme.black600};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: calc(100% - ${vm(16)});
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

export const PopoverList = styled.div<{ $hideScrollbar?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-right: 0 !important;
  max-height: ${({ $hideScrollbar }) => ($hideScrollbar ? 'none' : '200px')};
  overflow: ${({ $hideScrollbar }) => ($hideScrollbar ? 'visible' : 'auto')};

  /* 隐藏滚动条但保持可滚动 */
  ${({ $hideScrollbar }) =>
    !$hideScrollbar &&
    css`
      scrollbar-width: none;
      -ms-overflow-style: none;
      &::-webkit-scrollbar {
        display: none;
      }
    `}
`

export const PopoverItem = styled.li<{ $isActive: boolean; $popItemHoverBg: string; $activeIconColor?: string }>`
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
  border-radius: 2px;
  cursor: pointer;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.black100};
  &:hover {
    color: ${({ theme }) => theme.black0};
    background-color: ${({ theme, $popItemHoverBg }) => $popItemHoverBg || theme.black500};
  }
  ${({ $isActive }) =>
    $isActive &&
    css`
      color: ${({ theme }) => theme.black0};
      background-color: ${({ theme }) => theme.black500};
    `}
  .icon-circle-success {
    font-size: 18px;
    color: ${({ theme, $activeIconColor }) => $activeIconColor || theme.brand100};
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
  .icon-expand {
    color: ${({ theme }) => theme.black300};
    transition: all ${ANI_DURATION}s;
  }
  &:hover {
    .icon-expand {
      color: ${({ theme }) => theme.black0};
    }
  }
  ${({ $show }) =>
    $show &&
    css`
      .icon-expand {
        color: ${({ theme }) => theme.black0};
        transform: ${$show ? 'rotate(180deg)' : 'rotate(0)'};
      }
    `}
  ${({ $begainToHide }) =>
    $begainToHide &&
    css`
      opacity: 1;
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
