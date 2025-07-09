import { vm } from 'pages/helper'
import { ANI_DURATION } from 'constants/index'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { IconBase } from 'components/Icons'
import { useGetFormatDisplayTime, useInsightsList } from 'store/insights/hooks'
import { useEffect, useState, useCallback } from 'react'
import { useGetTokenImg } from 'store/application/hooks'
import ImgLoad from 'components/ImgLoad'

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
  ${({ theme, $isActive }) =>
    theme.isMobile
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
                font-size: 0.16rem;
                font-weight: 500;
                line-height: 0.24rem;
                margin-right: ${vm(4)};
                color: ${theme.textL1};
              }
              span:nth-child(3) {
                font-size: 0.12rem;
                font-weight: 400;
                line-height: 0.18rem;
                color: ${theme.textL3};
              }
            }
            > span:last-child {
              display: flex;
              align-items: center;
              gap: ${vm(8)};
              .update-time {
                font-size: 0.11rem;
                font-weight: 400;
                line-height: 0.16rem;
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
                font-size: 0.12rem;
                font-weight: 500;
                line-height: 0.18rem;
                color: ${theme.black};
              }
            }
          }
        `
      : css`
          cursor: pointer;
          ${!$isActive &&
          css`
            &:hover {
              border: 1px solid ${theme.text20};
            }
          `}
        `}
`

const SwitchWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(32)};
      height: ${vm(32)};
      .icon-search {
        font-size: 0.18rem;
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
  changeToken,
}: {
  symbol: string
  des: string
  size: number
  isActive: boolean
  isSwitchFunc?: boolean
  changeToken: (symbol?: string) => void
}) {
  const theme = useTheme()
  const getTokenImg = useGetTokenImg()
  const [insightsList] = useInsightsList()
  const [timeDisplay, setTimeDisplay] = useState<string>('')
  const getFormatDisplayTime = useGetFormatDisplayTime()

  // 查找当前symbol最近的未读insight
  const findLatestUnreadInsight = useCallback(() => {
    if (!symbol) return null

    const unreadInsights = insightsList.filter((insight) => insight.marketId.toUpperCase() === symbol.toUpperCase())

    if (unreadInsights.length === 0) return null

    // 按创建时间排序，获取最新的
    return unreadInsights.sort((a, b) => b.createdAt - a.createdAt)[0]
  }, [insightsList, symbol])

  // 格式化时间显示
  const formatTimeDisplay = useCallback(() => {
    const latestInsight = findLatestUnreadInsight()
    if (!latestInsight) {
      setTimeDisplay('')
      return
    }

    const createTime = latestInsight.createdAt
    const time = getFormatDisplayTime(createTime)
    setTimeDisplay(time)
  }, [findLatestUnreadInsight, getFormatDisplayTime])

  // 设置定时器，每秒更新一次时间显示
  useEffect(() => {
    formatTimeDisplay()

    const timer = setInterval(() => {
      formatTimeDisplay()
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [formatTimeDisplay])

  return (
    <TokenItemWrapper
      $hideBorder={!isActive}
      $borderColor={theme.jade10}
      $borderRadius={36}
      $isActive={isActive}
      onClick={() => changeToken(symbol)}
    >
      <span>
        <span>
          <ImgLoad src={getTokenImg(symbol)} alt={symbol} />
          <span>{symbol.toUpperCase()}</span>
          <span>{des}</span>
        </span>
        <span>
          <span className='update-time'>{timeDisplay}</span>
          {size > 0 && <span className='insight-count'>{size}</span>}
        </span>
      </span>
      {isSwitchFunc && (
        <SwitchWrapper $borderColor={theme.bgT30} $borderRadius={16}>
          <IconBase className='icon-search' />
        </SwitchWrapper>
      )}
    </TokenItemWrapper>
  )
}
