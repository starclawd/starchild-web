import styled, { css } from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'

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
`

export const TopOperatorWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 0 ${vm(12)};
`

export const TopOperator = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  ${({ theme}) =>
    theme.isMobile &&
    css`
      align-items: center;
      justify-content: space-between;
      padding: ${vm(8)};
      height: ${vm(60)};
      border-radius: ${vm(36)};
      background-color: ${({ theme }) => theme.bgL1};
      span {
        font-size: 0.16rem;
        font-weight: 500;
        line-height: 0.24rem;
        color: ${({ theme }) => theme.textL1};
      }
    `
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

export const ShowHistoryIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(44)};
    height: ${vm(44)};
    border-radius: 50%;
    background-color: ${({ theme }) => theme.bgL2};
    .icon-chat-history,
    .icon-chat-back {
      font-size: 0.24rem;
      color: ${({ theme }) => theme.textL1};
    }
  `}
`
export const NewThreadButton = styled(ShowHistoryIcon)`
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(44)};
    height: ${vm(44)};
    border-radius: 50%;
    background-color: ${({ theme }) => theme.bgL2};
    .icon-chat-new {
      font-size: 0.24rem;
      color: ${({ theme }) => theme.textL1};
    }
  `}
`