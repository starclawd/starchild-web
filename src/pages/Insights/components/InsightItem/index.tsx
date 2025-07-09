import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import TransitionWrapper from 'components/TransitionWrapper'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ANI_DURATION } from 'constants/index'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import ArcBg from '../ArcBg'
import { useGetTokenImg, useIsMobile } from 'store/application/hooks'
import {
  ALERT_TYPE,
  InsightsDataType,
  InstitutionalTradeOptions,
  PriceAlertOptions,
  PriceChange24hOptions,
} from 'store/insights/insights.d'
import topBorder from 'assets/insights/top-border.png'
import bottomBorder from 'assets/insights/bottom-border.png'
import bottomBorderPc from 'assets/insights/bottom-border-pc.png'
import topBorderPc from 'assets/insights/top-border-pc.png'
import {
  useAutoMarkAsRead,
  useCurrentInsightDetailData,
  useCurrentShowId,
  useGetFormatDisplayTime,
  useIsInViewport,
  useIsShowInsightsDetail,
  useMarkerScrollPoint,
  useTokenList,
} from 'store/insights/hooks'
import Markdown from 'components/Markdown'
import { div, sub } from 'utils/calc'
import { formatKMBNumber, formatNumber, formatPercent } from 'utils/format'
import ImgLoad from 'components/ImgLoad'
import { getInsightTitle } from 'pages/Insights/components/CryptoChart/components/Tooltip'
import { useCurrentInsightTokenData } from 'store/insightscache/hooks'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { getInsightSide, getIsInsightLong } from 'store/insights/util'

const InsightItemWrapper = styled.div<{ $isInsightsDetail: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  width: 100%;
  gap: 16px;
  padding: 20px 0;
  border-radius: 36px;
  transition: all ${ANI_DURATION}s;
  background-color: ${({ theme }) => theme.bgL1};
  ${({ theme }) =>
    theme.isMobile
      ? css`
          gap: ${vm(16)};
          padding: ${vm(20)} 0;
          border-radius: ${vm(36)};
        `
      : css`
          display: grid;
          grid-template-rows: auto 1fr;
          gap: 0;
          border: 1px solid ${theme.bgT30};
          background-color: transparent;
          cursor: pointer;
          &:hover {
            background-color: ${theme.bgL2};
          }
        `}
  ${({ $isInsightsDetail }) =>
    $isInsightsDetail &&
    css`
      height: calc(100% - 64px);
      padding: 0 6px 0 0;
      border-radius: 0;
      background-color: transparent;
      border: none;
      cursor: unset;
      overflow: auto;
      &:hover {
        background-color: transparent;
      }
    `}
`

const HeaderWrapper = styled.div<{ $isInsightsDetail: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 24px;
  padding: 0 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(24)};
      padding: 0 ${vm(20)};
    `}
  ${({ $isInsightsDetail }) =>
    $isInsightsDetail &&
    css`
      padding: 0;
      margin-bottom: 20px;
    `}
`

const Left = styled.div<{ $isRead: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  > span:first-child {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    ${({ $isRead }) =>
      !$isRead
        ? css`
            background: ${({ theme }) => theme.jade10};
            box-shadow: 0px 0px 8px ${({ theme }) => theme.jade10};
            animation: breathe 5s infinite ease-in-out;
            @keyframes breathe {
              0% {
                box-shadow: 0px 0px 4px ${({ theme }) => theme.jade10};
              }
              50% {
                box-shadow: 0px 0px 15px ${({ theme }) => theme.jade10};
              }
              100% {
                box-shadow: 0px 0px 4px ${({ theme }) => theme.jade10};
              }
            }
          `
        : css`
            background: ${({ theme }) => theme.text20};
          `}
  }
  ${({ theme, $isRead }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      > span:first-child {
        width: ${vm(8)};
        height: ${vm(8)};
        ${!$isRead &&
        css`
          animation: mobileBreathe 5s infinite ease-in-out;
          @keyframes mobileBreathe {
            0% {
              box-shadow: 0px 0px ${vm(4)} ${theme.jade10};
            }
            50% {
              box-shadow: 0px 0px ${vm(15)} ${theme.jade10};
            }
            100% {
              box-shadow: 0px 0px ${vm(4)} ${theme.jade10};
            }
          }
        `}
      }
    `}
  .time-text {
    font-size: 11px;
    font-weight: 400;
    line-height: 16px;
    white-space: nowrap;
    color: ${({ theme }) => theme.textL3};
  }
`

const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  line-height: 16px;
  color: ${({ theme }) => theme.textL2};
  background-color: ${({ theme }) => theme.bgT20};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(20)};
      padding: ${vm(2)} ${vm(6)};
      border-radius: ${vm(4)};
      font-size: 0.11rem;
      font-weight: 500;
      line-height: 0.16rem;
    `}
`

const PredictionWrapper = styled.div<{ $isLong: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
  }
  .icon-chat-arrow-long {
    font-size: 24px;
    color: ${({ theme }) => theme.jade10};
  }
  .icon-chat-arrow-short {
    font-size: 24px;
    color: ${({ theme }) => theme.ruby50};
  }
  ${({ theme, $isLong }) =>
    $isLong
      ? css`
          span {
            color: ${theme.jade10};
          }
        `
      : css`
          span {
            color: ${theme.ruby50};
          }
        `}
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
      span {
        font-size: 0.16rem;
        font-weight: 500;
        line-height: 0.24rem;
      }
      .icon-chat-arrow-long {
        font-size: 0.24rem;
      }
      .icon-chat-arrow-short {
        font-size: 0.24rem;
      }
    `}
`

const CenterWrapper = styled.div<{ $isInsightsDetail: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
  padding: 0 20px;
  z-index: 1;
  overflow: hidden;
  transition: all ${ANI_DURATION}s;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
      padding: 0 ${vm(20)};
    `}
  ${({ $isInsightsDetail }) =>
    $isInsightsDetail &&
    css`
      padding: 0;
      overflow: unset;
    `}
`

const TopContent = styled.div<{ $isLong: boolean; $shortContent?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
  .top-content-left {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .time-text {
    font-size: 11px;
    font-weight: 400;
    line-height: 16px;
    white-space: nowrap;
    color: ${({ theme }) => theme.textL3};
  }
  ${({ $shortContent }) =>
    $shortContent
      ? css`
          flex: 1;
          padding-right: 24px;
          .price-direction-text {
            font-size: 14px;
            font-weight: 500;
            line-height: 20px;
            margin-left: 6px;
            color: ${({ theme }) => theme.textL1};
          }
        `
      : css`
          .price-direction-text {
            font-size: 18px;
            font-weight: 500;
            line-height: 26px;
            color: ${({ theme }) => theme.textL1};
          }
        `}
  ${({ theme }) =>
    theme.isMobile
      ? css`
          gap: ${vm(6)};
          justify-content: flex-start;
          img {
            width: ${vm(32)};
            height: ${vm(32)};
          }
          .price-direction-text {
            font-size: 0.18rem;
            font-weight: 500;
            line-height: 0.26rem;
          }
        `
      : css`
          .top-content-left {
            cursor: pointer;
          }
        `}
`

const TimeWrapper = styled.div<{ $showDetailCoin: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ theme, $showDetailCoin }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
      > span {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.11rem;
        font-weight: 400;
        line-height: 0.16rem;
        color: ${theme.textL3};
        .icon-chat-expand-down {
          font-size: 0.14rem;
          color: ${theme.textL1};
          transition: transform ${ANI_DURATION}s;
        }
        ${$showDetailCoin &&
        css`
          .icon-chat-expand-down {
            transform: rotate(180deg);
          }
        `}
      }
    `}
`

const CoinDetail = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 12px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex-direction: column;
      gap: ${vm(4)};
      padding: ${vm(8)} ${vm(12)};
      border-radius: ${vm(16)};
      background-color: ${theme.bgT20};
    `}
`

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  span:last-child {
    color: ${({ theme }) => theme.textL3};
  }
  span:first-child {
    color: ${({ theme }) => theme.textL1};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(2)};
      font-size: 0.11rem;
      font-weight: 500;
      line-height: 0.16rem;
    `}
`

const CoinItem = styled.div<{ $alertType: string }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: calc(100% / 2);
  padding: 8px 12px;
  gap: 8px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.bgT20};
  .title {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL3};
  }
  ${({ $alertType }) =>
    $alertType === 'institutional_trade' &&
    css`
      width: 100%;
    `}
  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0;
      background-color: transparent;
      border-radius: 0;
      .title {
        font-size: 0.11rem;
        font-weight: 500;
        line-height: 0.16rem;
      }
    `}
`

const AnalysisWrapper = styled.div<{ $isInsightsDetail: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  .analysis-title {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL1};
    .icon-chat-analyze-agent {
      font-size: 18px;
      color: ${({ theme }) => theme.jade10};
    }
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
      .analysis-title {
        gap: ${vm(2)};
        font-size: 0.11rem;
        font-weight: 400;
        line-height: 0.16rem;
        .icon-chat-analyze-agent {
          font-size: 0.14rem;
        }
      }
    `}
  ${({ $isInsightsDetail }) =>
    $isInsightsDetail &&
    css`
      margin-top: 8px;
    `}
`

const AnalysisContent = styled(BorderAllSide1PxBox)<{ $isInsightsDetail: boolean }>`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  padding: 16px;
  color: ${({ theme }) => theme.textL2};
  background: ${({ theme }) => theme.bgT10};
  box-shadow: 0px 0px 12px 0px rgba(255, 255, 255, 0.1) inset;
  backdrop-filter: blur(2px);
  overflow: unset;
  .top-border {
    position: absolute;
    left: 0;
    top: 0;
    width: 600px;
  }
  .bottom-border {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 600px;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(16)};
      font-size: 0.14rem;
      font-weight: 400;
      line-height: 0.2rem;
      box-shadow: 0px 0px ${vm(12)} 0px rgba(255, 255, 255, 0.1) inset;
      backdrop-filter: blur(${vm(2)});
      .top-border {
        width: 100%;
      }
      .bottom-border {
        width: 100%;
      }
    `}
  ${({ $isInsightsDetail }) =>
    $isInsightsDetail &&
    css`
      border: none;
      background-color: unset;
      box-shadow: none;
      padding: 0;
    `}
`

const MarkdownWrapper = styled.div`
  display: block;
  position: relative;
  z-index: 2;
`

const BottomContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: 0 ${vm(20)};
    `}
`

const ShareWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(44)};
      height: ${vm(44)};
      border-radius: 50%;
      .icon-chat-share {
        font-size: 0.24rem;
        color: ${theme.textL2};
      }
    `}
`

const ButtonAgent = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(44)};
      padding: 0 ${vm(18)};
      gap: ${vm(8)};
      font-size: 0.13rem;
      font-weight: 400;
      line-height: 0.2rem;
      color: ${theme.textL1};
      .icon-chat-robot {
        font-size: 0.24rem;
        color: ${theme.jade10};
      }
    `}
`

export default function InsightItem({
  data,
  isActive,
  isInsightsDetail = false,
}: {
  data: InsightsDataType
  isActive: boolean
  isInsightsDetail?: boolean
}) {
  const isMobile = useIsMobile()
  const getTokenImg = useGetTokenImg()
  const itemRef = useScrollbarClass<HTMLDivElement>()
  const isVisible = useIsInViewport(itemRef)
  const tokenList = useTokenList()
  const [, setCurrentShowId] = useCurrentShowId()
  const [, setIsShowInsightsDetail] = useIsShowInsightsDetail()
  const [, setCurrentInsightToken] = useCurrentInsightTokenData()
  const [, setCurrentInsightDetailData] = useCurrentInsightDetailData()
  const getFormatDisplayTime = useGetFormatDisplayTime()
  const [timeDisplay, setTimeDisplay] = useState<string>('')
  const { id, aiContent, createdAt, isRead, alertType, alertOptions } = data
  const { currentPrice, priceChange } = alertOptions as PriceAlertOptions
  const { priceChange24h, currentPrice: currentPrice24h } = alertOptions as PriceChange24hOptions
  useAutoMarkAsRead(String(id), !!isRead, isVisible && (isMobile || (isActive && !isMobile)))
  const [, setMarkerScrollPoint] = useMarkerScrollPoint()
  const isLong = getIsInsightLong(data)

  const changeToDetailView = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setCurrentInsightDetailData(data)
      setIsShowInsightsDetail(true)
      if (!isActive) {
        setCurrentShowId(String(id))
        if (createdAt) {
          setMarkerScrollPoint(createdAt)
        }
      }
    },
    [
      id,
      isActive,
      createdAt,
      data,
      setCurrentShowId,
      setCurrentInsightDetailData,
      setMarkerScrollPoint,
      setIsShowInsightsDetail,
    ],
  )

  const symbol = data.marketId.toUpperCase()
  const [showDetailCoin, setShowDetailCoin] = useState(false)
  const detailList = useMemo(() => {
    if (alertType === ALERT_TYPE.PRICE_ALERT) {
      return [
        {
          key: 'price',
          title: <Trans>Price</Trans>,
          value: (
            <ValueWrapper>
              <span>{formatNumber(currentPrice)}</span>
              <span>USDC</span>
            </ValueWrapper>
          ),
        },
        {
          key: 'Price change %',
          title: <Trans>Price change %</Trans>,
          value: (
            <ValueWrapper>
              <span>{formatPercent({ value: div(priceChange, 100) })}</span>
            </ValueWrapper>
          ),
        },
      ]
    } else if (alertType === ALERT_TYPE.PRICE_CHANGE_24H) {
      return [
        {
          key: 'price',
          title: <Trans>Price</Trans>,
          value: (
            <ValueWrapper>
              <span>{formatNumber(currentPrice24h)}</span>
              <span>USDC</span>
            </ValueWrapper>
          ),
        },
        {
          key: 'Price change %',
          title: <Trans>Price change %</Trans>,
          value: (
            <ValueWrapper>
              <span>{formatPercent({ value: div(priceChange24h, 100) })}</span>
            </ValueWrapper>
          ),
        },
      ]
    } else if (alertType === ALERT_TYPE.INSTITUTIONAL_TRADE) {
      return []
    }
    return []
  }, [currentPrice, alertType, priceChange, priceChange24h, currentPrice24h])
  const toggleShowDetailCoin = useCallback(() => {
    setShowDetailCoin(!showDetailCoin)
  }, [showDetailCoin])

  // 格式化时间显示
  const formatTimeDisplay = useCallback(() => {
    const time = getFormatDisplayTime(createdAt)
    setTimeDisplay(time)
  }, [getFormatDisplayTime, createdAt])

  const changeToken = useCallback(() => {
    const { marketId } = data
    const token = tokenList.find((item) => item.symbol.toUpperCase() === marketId.toUpperCase())
    if (token) {
      setCurrentInsightToken(token)
    }
  }, [data, tokenList, setCurrentInsightToken])

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
    <InsightItemWrapper
      ref={itemRef}
      className={isInsightsDetail ? 'scroll-style' : ''}
      onClick={changeToDetailView}
      data-timestamp={createdAt.toString()}
      $isInsightsDetail={isInsightsDetail}
    >
      <HeaderWrapper $isInsightsDetail={isInsightsDetail}>
        <Left $isRead={isRead}>
          <ActionWrapper>{getInsightSide(data)}</ActionWrapper>
          {isInsightsDetail && <span className='time-text'>{timeDisplay}</span>}
        </Left>
        {!isMobile && !isInsightsDetail && (
          <TopContent $shortContent={true} $isLong={isLong}>
            <span className='top-content-left'>
              <span className='price-direction-text'>{getInsightTitle(data, true)}</span>
            </span>
            <span className='time-text'>{timeDisplay}</span>
          </TopContent>
        )}
        <PredictionWrapper $isLong={isLong}>
          <span>{isLong ? <Trans>Long</Trans> : <Trans>Short</Trans>}</span>
          <IconBase className={isLong ? 'icon-chat-arrow-long' : 'icon-chat-arrow-short'} />
        </PredictionWrapper>
      </HeaderWrapper>
      {(isMobile || isInsightsDetail) && (
        <CenterWrapper $isInsightsDetail={isInsightsDetail}>
          {isMobile ? (
            <TopContent $isLong={isLong} onClick={changeToken}>
              <ImgLoad src={getTokenImg(symbol)} alt={symbol} />
              <span className='price-direction-text'>{getInsightTitle(data, true)}</span>
            </TopContent>
          ) : (
            <TopContent $isLong={isLong}>
              <span className='top-content-left' onClick={changeToken}>
                <ImgLoad src={getTokenImg(symbol)} alt={symbol} />
                <span className='price-direction-text'>{getInsightTitle(data, true)}</span>
              </span>
              {!isInsightsDetail && <span className='time-text'>{timeDisplay}</span>}
            </TopContent>
          )}
          {isMobile ? (
            <TimeWrapper $showDetailCoin={showDetailCoin} onClick={toggleShowDetailCoin}>
              <span>
                <span>{timeDisplay}</span>
                <IconBase className='icon-chat-expand-down' />
              </span>
              {detailList.length > 0 && (
                <TransitionWrapper visible={showDetailCoin}>
                  <CoinDetail>
                    {detailList.map((item) => {
                      const { key, title, value } = item
                      return (
                        <CoinItem $alertType={alertType} key={key}>
                          <span className='title'>{title}</span>
                          <span className='value'>{value}</span>
                        </CoinItem>
                      )
                    })}
                  </CoinDetail>
                </TransitionWrapper>
              )}
            </TimeWrapper>
          ) : detailList.length > 0 ? (
            <CoinDetail>
              {detailList.map((item) => {
                const { key, title, value } = item
                return (
                  <CoinItem $alertType={alertType} key={key}>
                    <span className='title'>{title}</span>
                    <span className='value'>{value}</span>
                  </CoinItem>
                )
              })}
            </CoinDetail>
          ) : null}
          <AnalysisWrapper $isInsightsDetail={isInsightsDetail}>
            <span className='analysis-title'>
              <IconBase className='icon-chat-analyze-agent' />
              <Trans>Analysis</Trans>
            </span>
            <AnalysisContent
              $borderColor='rgba(47, 245, 130, 0.10)'
              $borderRadius={24}
              className='analysis-content'
              $isInsightsDetail={isInsightsDetail}
            >
              {!isInsightsDetail && (
                <img className='top-border' src={isMobile ? topBorder : topBorderPc} alt='top-border' />
              )}
              <MarkdownWrapper>
                <Markdown>{aiContent}</Markdown>
              </MarkdownWrapper>
              {!isInsightsDetail && (
                <img className='bottom-border' src={isMobile ? bottomBorder : bottomBorderPc} alt='bottom-border' />
              )}
            </AnalysisContent>
          </AnalysisWrapper>
        </CenterWrapper>
      )}
      {isMobile && <ArcBg isLong={isLong} />}
    </InsightItemWrapper>
  )
}
