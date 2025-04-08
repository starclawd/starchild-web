import styled, { css } from 'styled-components'
import { ANI_DURATION } from 'constants/index'

export const TradeAiWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  z-index: 1000;
  z-index: 1000;
  padding: 0 8px;
  ${({ theme }) => theme.isMobile && css`
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0;
    border-radius: 12px;
    overflow: hidden;
  `}
`

export const InnerContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  .file-drag-wrapper {
    background-color: ${({ theme }) => theme.bg3};
  }
  ${({ theme }) => theme.isMobile && css`
    border-radius: 0;
    .file-drag-wrapper {
      border-radius: 0;
    }
  `}
`

export const ThreadListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-grow: 1;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.bg3};
`

export const TopOperator = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 16px 12px;
  border-radius: 16px 16px 0 0;
  background-color: ${({ theme }) => theme.bg3};
  ${({ theme}) =>
    theme.isMobile &&
    css`
      border-radius: 0;
    `
  }
`

export const ControlWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  z-index: 100000;
  user-select: none;
  span {
    font-size: 14px;
    font-weight: 800;
    line-height: 18px;
    color: ${({ theme }) => theme.text3};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      span {
        font-size: 18px;
        font-weight: 800;
        line-height: 24px;
        color: ${({ theme }) => theme.text1};
      }
    `
  }
`

export const ControlButton = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2px;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  padding: 3px 5px;
  user-select: none;
  span {
    width: 2px;
    height: 2px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.text4};
  }
`

export const Mask = styled.div`
  position: absolute;
  width: 1000px;
  height: 1000px;
  left: -500px;
  top: -500px;
  z-index: 99999;
`

export const OperatorWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  .icon-add,
  .icon-close,
  .icon-disconnect {
    transition: all ${ANI_DURATION}s;
    color: ${({ theme }) => theme.text4};
  }
  .icon-add,
  .icon-disconnect {
    font-size: 16px;
    font-weight: 800;
    cursor: pointer;
    &:hover {
      color: ${({ theme }) => theme.green};
    }
  }
  .icon-disconnect {
    font-size: 18px;
  }
  .icon-ai-his {
    cursor: pointer;
    path {
      transition: all ${ANI_DURATION}s;
    }
    &:hover {
      path:first-child {
        stroke: ${({ theme }) => theme.green};
      }
      path:last-child {
        fill: ${({ theme }) => theme.green};
      }
    }
  }
  .icon-fullscreen {
    cursor: pointer;
    path {
      transition: all ${ANI_DURATION}s;
    }
    &:hover {
      path {
        fill: ${({ theme }) => theme.green};
      }
    }
  }
  .line {
    width: 1px;
    height: 12px;
    background-color: ${({ theme }) => theme.line1};
  }
`
