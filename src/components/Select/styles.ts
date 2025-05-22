import styled, { css } from 'styled-components'
import { Placement } from '@popperjs/core'
import { ButtonBorder } from 'components/Button'
import { ANI_DURATION } from 'constants/index'

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
    `
  }
`

export const PopoverContainer = styled.ul<{
  $begainToHide: boolean,
  $usePortal: boolean,
  $disableDisappearAni: boolean,
}>`
  position: absolute;
  top: 46px;
  left: 0;
  width: 540px;
  height: auto;
  margin: 0;
  padding: 8px;
  z-index: 1000;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  background-color: ${({ theme }) => theme.bgL1};
  backdrop-filter: blur(8px);
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
      `
  }
  
  ${({ $begainToHide, $disableDisappearAni }) =>
    $begainToHide && !$disableDisappearAni
      ? css`
        opacity: 0;
        animation: opacityDisappear ${ANI_DURATION}s;
      `
      : $begainToHide &&
        css`
          display: none;
        `
  }
`

export const PopoverList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 200px;
  overflow: auto;
`

export const PopoverItem = styled.li<{ $isActive: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  height: 32px;
  font-size: 14px;
  font-weight: 600;
  padding: 0 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.textL2};
  &:hover {
    background-color: ${({ theme }) => theme.bgL2};
  }
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
    `
  }
  ${({ $begainToHide }) =>
    $begainToHide &&
    css`
      opacity: 1;
    `
  }
`

export const SelectBorderWrapper = styled(ButtonBorder)`
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0 16px;
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
`
