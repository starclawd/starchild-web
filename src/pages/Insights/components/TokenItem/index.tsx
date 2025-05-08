import { vm } from 'pages/helper'
import { ANI_DURATION } from 'constants/index'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { getTokenImg } from 'utils'
import { IconBase } from 'components/Icons'

const TokenItemWrapper = styled(BorderAllSide1PxBox)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  flex-shrink: 0;
  height: 64px;
  transition: border-color ${ANI_DURATION}s;
  > span {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
    > span:first-child {
      display: flex;
      align-items: center;
      img {
        width: 32px;
        height: 32px;
        margin-right: 8px;
        border-radius: 50%;
      }
      span:nth-child(2) {
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        margin-right: 4px;
        color: ${({ theme }) => theme.textL1};
      }
      span:nth-child(3) {
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
        color: ${({ theme }) => theme.textL3};
      }
    }
    > span:nth-child(2) {
      display: flex;
      align-items: center;
      gap: 8px;
      .update-time {
        font-size: 11px;
        font-weight: 400;
        line-height: 16px;
        color: ${({ theme }) => theme.textL3};
        }
      .insight-count {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: ${({ theme }) => theme.jade10};
        font-size: 12px;
        font-weight: 500;
        line-height: 18px;
        color: ${({ theme }) => theme.black};
      }
    }
  }
  ${({ theme, $isActive }) => theme.isMobile
  ? css`
    gap: ${vm(8)};
    height: ${vm(48)};
    padding: ${vm(8)};
    background-color: ${theme.bgL1};
    > span {
      > span:first-child {
        img {
          width: ${vm(32)};
          height: ${vm(32)};
          margin-right: ${vm(8)};
          border-radius: 50%;
        }
        span:nth-child(2) {
          font-size: .16rem;
          font-weight: 500;
          line-height: .24rem;
          margin-right: ${vm(4)};
          color: ${theme.textL1};
        }
        span:nth-child(3) {
          font-size: .12rem;
          font-weight: 400;
          line-height: .18rem;
          color: ${theme.textL3};
        }
      }
      > span:last-child {
        display: flex;
        align-items: center;
        gap: ${vm(8)};
        .update-time {
          font-size: .11rem;
          font-weight: 400;
          line-height: .16rem;
          color: ${theme.textL3};
        }
        .insight-count {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: ${vm(24)};
          height: ${vm(24)};
          border-radius: 50%;
          background-color: ${theme.jade10};
          font-size: .12rem;
          font-weight: 500;
          line-height: .18rem;
          color: ${theme.black};
        }
      }
    }
    
  ` : css`
    cursor: pointer;
    ${!$isActive && css`
      &:hover {
        border: 1px solid ${theme.textL6};
      }
    `}
  `}
`

const SwitchWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(32)};
    height: ${vm(32)};
    .icon-chat-switch {
      font-size: .18rem;
      color: ${theme.textL2};
    }
  `}
`

export default function TokenItem({
  symbol,
  des,
  size,
  isActive,
  isSwitchFunc,
  changeToken
}: {
  symbol: string
  des: string
  size: number
  isActive: boolean
  isSwitchFunc?: boolean
  changeToken: (symbol?: string) => void
}) {
  const theme = useTheme()
  return <TokenItemWrapper
    $hideBorder={!isActive}
    $borderColor={theme.jade10}
    $borderRadius={36}
    $isActive={isActive}
    onClick={() => changeToken(symbol)}
  >
    <span>
      <span>
        <img src={getTokenImg(symbol)} alt={symbol} />
        <span>{symbol.toUpperCase()}</span>
        <span>{des}</span>
      </span>
      <span>
        {/* <span className="update-time">10 minutes ago</span> */}
        <span className="insight-count">{size}</span>
      </span>
    </span>
    {isSwitchFunc && <SwitchWrapper
      $borderColor={theme.bgT30}
      $borderRadius="50%"
    >
      <IconBase className="icon-chat-switch" />
    </SwitchWrapper>}
  </TokenItemWrapper>
}
