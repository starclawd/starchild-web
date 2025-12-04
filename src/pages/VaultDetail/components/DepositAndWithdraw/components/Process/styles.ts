import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import { ANI_DURATION } from 'constants/index'

export const ProcessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: 0 ${vm(20)} ${vm(20)};
    `}
`

export const Title = styled.div`
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 153.846% */
  letter-spacing: 0.39px;
  color: ${({ theme }) => theme.textL3};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.13rem;
      line-height: 0.2rem;
    `}
`
export const LatestDepositWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
    `}
`
export const LatestWithdrawalWrapper = styled(LatestDepositWrapper)``

export const DepositContent = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.bgT20};
  transition: all ${ANI_DURATION}s;
  &:hover {
    opacity: 0.7;
  }
  > span {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL3};
  }
  ${({ theme }) =>
    theme.isMobile
      ? css`
          padding: ${vm(12)};
          border-radius: ${vm(8)};
          > span {
            font-size: 0.12rem;
            line-height: 0.18rem;
          }
        `
      : css`
          cursor: pointer;
          &:hover {
            opacity: 0.7;
          }
        `}
`

export const WithdrawContent = styled(DepositContent)``

export const Status = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.green100};
  span {
    width: 4px;
    height: 4px;
    border-radius: 1px;
    background-color: ${({ theme }) => theme.green100};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.12rem;
      line-height: 0.18rem;
      span {
        font-size: 0.12rem;
        line-height: 0.18rem;
      }
    `}
`

export const Amount = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  img {
    width: 16px;
    height: 16px;
  }
  span {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL4};
  }
  .amount {
    color: ${({ theme }) => theme.textL2};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      img {
        width: ${vm(16)};
        height: ${vm(16)};
      }
      span {
        font-size: 0.12rem;
        line-height: 0.18rem;
      }
    `}
`

export const WithdrawProcessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.bgT20};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)};
      border-radius: ${vm(8)};
    `}
`

export const TopContent = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  span {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    &:first-child {
      color: ${({ theme }) => theme.textDark54};
    }
    &:last-child {
      color: ${({ theme }) => theme.brand100};
    }
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin-bottom: ${vm(8)};
      span {
        font-size: 0.12rem;
        line-height: 0.18rem;
      }
    `}
`

export const CenterContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  span:first-child,
  span:nth-child(4),
  span:nth-child(5) {
    flex-shrink: 0;
    width: 8px;
    height: 8px;
    border-radius: 2px;
    border: 1px solid ${({ theme }) => theme.black300};
    background: ${({ theme }) => theme.black800};
  }
  span:nth-child(4) {
    position: absolute;
    top: 0;
    left: 50%;
  }
  span:nth-child(2),
  span:nth-child(3) {
    width: 50%;
    height: 2px;
    background-color: ${({ theme }) => theme.black500};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin-bottom: ${vm(4)};
      span:first-child,
      span:nth-child(4),
      span:nth-child(5) {
        width: ${vm(8)};
        height: ${vm(8)};
        border-radius: ${vm(2)};
      }
      span:nth-child(2),
      span:nth-child(3) {
        height: ${vm(2)};
      }
    `}
`

export const BottomContent = styled.div`
  display: flex;
  justify-content: space-between;
  span {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL4};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      span {
        font-size: 0.12rem;
        line-height: 0.18rem;
      }
    `}
`
