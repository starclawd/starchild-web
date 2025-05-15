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
import { ALERT_TYPE, InsightsDataType, InstitutionalTradeOptions, PriceAlertOptions, PriceChange24hOptions } from 'store/insights/insights.d'
import topBorder from 'assets/insights/top-border.png'
import bottomBorder from 'assets/insights/bottom-border.png'
import bottomBorderPc from 'assets/insights/bottom-border-pc.png'
import topBorderPc from 'assets/insights/top-border-pc.png'
import { getInsightSide, getIsInsightLong, useAutoMarkAsRead, useGetFormatDisplayTime, useIsInViewport, useMarkerScrollPoint } from 'store/insights/hooks'
import Markdown from 'react-markdown'
import { div, sub } from 'utils/calc'
import { formatKMBNumber, formatNumber, formatPercent } from 'utils/format'

const InsightItemWrapper = styled.div<{ $isActive: boolean }>`
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
  ${({ theme, $isActive }) => theme.isMobile
  ? css`
    gap: ${vm(16)};
    padding: ${vm(20)} 0;
    border-radius: ${vm(36)};
  ` : css`
    display: grid;
    grid-template-rows: auto ${$isActive ? '1fr' : '0fr'};
    ${!$isActive && css`
      gap: 0;
      border: 1px solid ${theme.bgT30};
      background-color: transparent;
      &:hover {
        background-color: ${theme.bgL2};
      }
    `}
    cursor: pointer;
  `}
`

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 24px;
  padding: 0 20px;
  ${({ theme }) => theme.isMobile && css`
    height: ${vm(24)};
    padding: 0 ${vm(20)};
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
    ${({ $isRead }) => !$isRead
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
      background: ${({ theme }) => theme.textL6};
    `}
  }
  ${({ theme, $isRead }) => theme.isMobile && css`
    gap: ${vm(8)};
    > span:first-child {
      width: ${vm(8)};
      height: ${vm(8)};
      ${!$isRead && css`
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
  ${({ theme }) => theme.isMobile && css`
    height: ${vm(20)};
    padding: ${vm(2)} ${vm(6)};
    border-radius: ${vm(4)};
    font-size: .11rem;
    font-weight: 500;
    line-height: .16rem;
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
  ${({ theme, $isLong }) => $isLong
      ? css`
        span {
          color: ${theme.jade10};
        }
      `
      : css`
        span {
          color: ${theme.ruby50};
        }
      `
    }
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(4)};
    span {
      font-size: .16rem;
      font-weight: 500;
      line-height: .24rem;
    }
    .icon-chat-arrow-long {
      font-size: .24rem;
    }
    .icon-chat-arrow-short {
      font-size: .24rem;
    }
  `}
`

const CenterWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
  padding: 0 20px;
  z-index: 1;
  overflow: hidden;
  transition: all ${ANI_DURATION}s;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(12)};
    padding: 0 ${vm(20)};
  `}
`

const TopContent = styled.div<{ $isLong: boolean, $shortContent?: boolean }>`
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
  ${({ $shortContent }) => $shortContent && css`
    flex: 1;
    padding-right: 24px;
    .price-direction-text {
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      margin-left: 6px;
    }
  `}
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(6)};
    justify-content: flex-start;
    img {
      width: ${vm(32)};
      height: ${vm(32)};
    }
  `}
`

const TimeWrapper = styled.div<{ $showDetailCoin: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ theme, $showDetailCoin }) => theme.isMobile && css`
    gap: ${vm(12)};
    > span {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: .11rem;
      font-weight: 400;
      line-height: .16rem;
      color: ${theme.textL3};
      .icon-chat-expand-down {
        font-size: .14rem;
        color: ${theme.textL1};
        transition: transform ${ANI_DURATION}s;
      }
      ${$showDetailCoin && css`
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
  ${({ theme }) => theme.isMobile && css`
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
  span:first-child {
    color: ${({ theme }) => theme.textL1};
  }
  span:last-child {
    color: ${({ theme }) => theme.textL3};
  }
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(2)};
    font-size: .11rem;
    font-weight: 500;
    line-height: .16rem;
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
  ${({ $alertType }) => $alertType === 'institutional_trade' && css`
    width: 100%;
  `}
  ${({ theme }) => theme.isMobile && css`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0;
    background-color: transparent;
    border-radius: 0;
    .title {
      font-size: .11rem;
      font-weight: 500;
      line-height: .16rem;
    }
  `}
`

const AnalysisWrapper = styled.div`
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
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(4)};
    .analysis-title {
      gap: ${vm(2)};
      font-size: .11rem;
      font-weight: 400;
      line-height: .16rem;
      .icon-chat-analyze-agent {
        font-size: .14rem;
      }
    }
  `}
`

const AnalysisContent = styled(BorderAllSide1PxBox)`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  padding: 16px;
  color: ${({ theme }) => theme.textL2};
  background: ${({ theme }) => theme.bgT10};
  box-shadow: 0px 0px 12px 0px rgba(255, 255, 255, 0.10) inset;
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
  ${({ theme }) => theme.isMobile && css`
    padding: ${vm(16)};
    font-size: .14rem;
    font-weight: 400;
    line-height: .2rem;
    box-shadow: 0px 0px ${vm(12)} 0px rgba(255, 255, 255, 0.10) inset;
    backdrop-filter: blur(${vm(2)});
    .top-border {
      width: 100%;
    }
    .bottom-border {
      width: 100%;
    }
  `}
`

const MarkdownWrapper = styled.div`
  display: block;
  position: relative;
  z-index: 2;
  a {
    color: ${({ theme }) => theme.brand6};
  }
`

const BottomContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ theme }) => theme.isMobile && css`
    padding: 0 ${vm(20)};
  `}
`

const ShareWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(44)};
    height: ${vm(44)};
    border-radius: 50%;
    .icon-chat-share {
      font-size: .24rem;
      color: ${theme.textL2};
    }
  `}
`

const ButtonAgent = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.isMobile && css`
    height: ${vm(44)};
    padding: 0 ${vm(18)};
    gap: ${vm(8)};
    font-size: .13rem;
    font-weight: 400;
    line-height: .2rem;
    color: ${theme.textL1};
    .icon-chat-robot {
      font-size: .24rem;
      color: ${theme.jade10};
    }
  `}
`

const TitleWrapper = styled.div<{ $isLong: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
  color: ${({ theme }) => theme.textL3};
  .symbol {
    color: ${({ theme }) => theme.textL1};
  }
  .change {
    color: ${({ theme, $isLong }) => $isLong ? theme.jade10 : theme.ruby50};
  }
  ${({ theme }) => theme.isMobile && css`
    font-size: .18rem;
    font-weight: 500;
    line-height: .26rem;
    gap: ${vm(4)};
  `}
`

function getInsightTitle(data: InsightsDataType) {
  const { alertType, alertOptions, marketId, alertQuery } = data;
  const { priceChange } = alertOptions as PriceAlertOptions;
  const { value } = alertOptions as InstitutionalTradeOptions;
  const { priceChange24h } = alertOptions as PriceChange24hOptions;
  const isLong = getIsInsightLong(data)
  const symbol = marketId.toUpperCase()
  const change = formatPercent({ value: div(priceChange, 100), mark: priceChange > 0 ? '+' : '' })
  const change24h = formatPercent({ value: div(priceChange24h, 100), mark: priceChange24h > 0 ? '+' : '' })
  const formatValue = formatKMBNumber(value)
  const sideText = isLong ? <Trans>Buy</Trans> : <Trans>Sell</Trans>
  if (alertType === ALERT_TYPE.PRICE_ALERT) {
    return <TitleWrapper $isLong={isLong}>
      <Trans><span className="symbol">{symbol}</span> <span className="change">{change}</span> within 15m</Trans>
    </TitleWrapper>
  } else if (alertType === ALERT_TYPE.PRICE_CHANGE_24H) {
    return <TitleWrapper $isLong={isLong}>
      <Trans><span className="symbol">{symbol}</span> <span className="change">{change24h}</span> within 24H</Trans>
    </TitleWrapper>
  } else if (alertType === ALERT_TYPE.INSTITUTIONAL_TRADE) {
    return <TitleWrapper $isLong={isLong}>
      <Trans><span className="symbol">{symbol}</span> <span className="change">{formatValue}</span> <span>{sideText}</span></Trans>
    </TitleWrapper>
  } 
  return alertQuery
}

export default function InsightItem({
  data,
  isActive,
  currentShowId,
  setCurrentShowId,
}: {
  data: InsightsDataType
  isActive: boolean
  currentShowId: string
  setCurrentShowId: (id: string) => void
}) {
  const isMobile = useIsMobile()
  const getTokenImg = useGetTokenImg()
  const itemRef = useRef<HTMLDivElement>(null);
  const isVisible = useIsInViewport(itemRef);
  const getFormatDisplayTime = useGetFormatDisplayTime()
  const [timeDisplay, setTimeDisplay] = useState<string>('')
  const { id, alertQuery, aiContent, createdAt, isRead, alertType, alertOptions } = data
  const { currentPrice, priceChange, openPrice, movementType } = alertOptions as PriceAlertOptions
  const { priceChange24h, currentPrice: currentPrice24h } = alertOptions as PriceChange24hOptions
  useAutoMarkAsRead(String(id), !!isRead, isVisible && (isMobile || (isActive && !isMobile)));
  const [, setMarkerScrollPoint] = useMarkerScrollPoint()
  const isLong = getIsInsightLong(data)

  const changeToDetailView = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isActive) {
      setCurrentShowId(String(id));
      if (createdAt) {
        setMarkerScrollPoint(createdAt);
      }
    }
  }, [id, isActive, setCurrentShowId, createdAt, setMarkerScrollPoint]);
  
  const symbol = data.marketId.toUpperCase()
  const [showDetailCoin, setShowDetailCoin] = useState(false)
  const showShortContent = useMemo(() => {
    return !isActive && !isMobile
  }, [isActive, isMobile])
  const detailList = useMemo(() => {
    if (alertType === ALERT_TYPE.PRICE_ALERT) {
      return [
        {
          key: 'price',
          title: <Trans>Price</Trans>,
          value: <ValueWrapper>
            <span>{formatNumber(currentPrice)}</span>
            <span>USDC</span>
          </ValueWrapper>,
        },
        {
          key: 'Price change %',
          title: <Trans>Price change %</Trans>,
          value: <ValueWrapper>
            <span>{formatPercent({ value: div(priceChange, 100) })}</span>
          </ValueWrapper>,
        },
      ]
    } else if (alertType === ALERT_TYPE.PRICE_CHANGE_24H) {
      return [
        {
          key: 'price',
          title: <Trans>Price</Trans>,
          value: <ValueWrapper>
            <span>{formatNumber(currentPrice24h)}</span>
            <span>USDC</span>
          </ValueWrapper>,
        },
        {
          key: 'Price change %',
          title: <Trans>Price change %</Trans>,
          value: <ValueWrapper>
            <span>{formatPercent({ value: div(priceChange24h, 100) })}</span>
          </ValueWrapper>,
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
  return <InsightItemWrapper
    $isActive={isActive}
    onClick={changeToDetailView}
    ref={itemRef}
    data-timestamp={createdAt.toString()}
  >
    <HeaderWrapper>
      <Left $isRead={isRead}>
        <span></span>
        <ActionWrapper>{getInsightSide(data)}</ActionWrapper>
      </Left>
      {showShortContent && <TopContent $shortContent={true} $isLong={isLong}>
        <span className="top-content-left">
          <span className="price-direction-text">{getInsightTitle(data)}</span>
        </span>
        <span className="time-text">{timeDisplay}</span>
      </TopContent>}
      <PredictionWrapper $isLong={isLong}>
        <span>
          {isLong ? <Trans>Long</Trans> : <Trans>Short</Trans>}
        </span>
        <IconBase className={isLong ? 'icon-chat-arrow-long' : 'icon-chat-arrow-short'} />
      </PredictionWrapper>
    </HeaderWrapper>
    {!showShortContent && <CenterWrapper>
      {isMobile ? <TopContent $isLong={isLong}>
        <img src={getTokenImg(symbol)} alt={symbol} />
        <span className="price-direction-text">{getInsightTitle(data)}</span>
      </TopContent> : <TopContent $isLong={isLong}>
        <span className="top-content-left">
          <img src={getTokenImg(symbol)} alt={symbol} />
          <span className="price-direction-text">{getInsightTitle(data)}</span>
        </span>
        <span className="time-text">{timeDisplay}</span>
      </TopContent>}
      {isMobile ? <TimeWrapper $showDetailCoin={showDetailCoin} onClick={toggleShowDetailCoin}>
        <span>
          <span>{timeDisplay}</span>
          <IconBase className="icon-chat-expand-down" />
        </span>
        {detailList.length > 0 && <TransitionWrapper visible={showDetailCoin}>
          <CoinDetail>
            {detailList.map((item) => {
              const { key, title, value } = item
              return <CoinItem $alertType={alertType} key={key}>
                <span className="title">{title}</span>
                <span className="value">{value}</span>
              </CoinItem>
            })}
          </CoinDetail>
        </TransitionWrapper>}
      </TimeWrapper> : detailList.length > 0 ? <CoinDetail>
        {detailList.map((item) => {
          const { key, title, value } = item
          return <CoinItem $alertType={alertType} key={key}>
            <span className="title">{title}</span>
            <span className="value">{value}</span>
          </CoinItem>
        })}
      </CoinDetail> : null}
      <AnalysisWrapper>
        <span className="analysis-title">
          <IconBase className="icon-chat-analyze-agent" />
          <Trans>Analysis</Trans>
        </span>
        <AnalysisContent
          $borderColor="rgba(47, 245, 130, 0.10)"
          $borderRadius={24}
          className="analysis-content"
        >
          <img className="top-border" src={isMobile ? topBorder :topBorderPc} alt="top-border" />
          <MarkdownWrapper>
            <Markdown
              components={{
                a: ({node, ...props}) => {
                  return <a target="_blank" rel="noopener noreferrer" {...props}/>
                }
              }}
            >{aiContent}</Markdown>
          </MarkdownWrapper>
          <img className="bottom-border" src={isMobile ? bottomBorder : bottomBorderPc} alt="bottom-border" />
        </AnalysisContent>
      </AnalysisWrapper>
    </CenterWrapper>}
    {!showShortContent && <ArcBg isLong={isLong} />}
  </InsightItemWrapper>
}
