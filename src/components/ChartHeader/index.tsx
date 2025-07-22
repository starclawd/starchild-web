import { IconBase } from 'components/Icons'
import { vm } from 'pages/helper'
import { useMemo } from 'react'
import { useGetTokenImg, useIsMobile } from 'store/application/hooks'
import styled, { css } from 'styled-components'
import { div, isGt, sub, toFix, toPrecision } from 'utils/calc'
import { formatNumber } from 'utils/format'
import { useGetConvertPeriod } from 'store/insightscache/hooks'
import ImgLoad from 'components/ImgLoad'
import PeridSelector from './components/PeridSelector'
import { PERIOD_OPTIONS } from 'store/insightscache/insightscache'
import { KlineSubInnerDataType } from 'store/insights/insights'
import { BacktestDataType } from 'store/agentdetail/agentdetail'

const ChartHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  .tab-list-wrapper {
    flex-grow: 1;
    width: calc(100% - 185px);
    max-width: 270px;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      img {
        width: ${vm(32)};
        height: ${vm(32)};
      }
      .tab-list-wrapper {
        width: calc(100% - ${vm(185)});
        max-width: ${vm(270)};
      }
    `}
`

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  .symbol-info {
    display: flex;
    align-items: center;
    gap: 4px;
    height: fit-content;
    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
    span {
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      color: ${({ theme }) => theme.textL1};
    }
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
      .symbol-info {
        img {
          width: ${vm(24)};
          height: ${vm(24)};
        }
        span {
          font-size: 0.14rem;
          line-height: 0.2rem;
        }
      }
    `}
`

const PriceInfo = styled.div<{
  $isPositive: boolean
  $change: string
}>`
  display: flex;
  flex-direction: column;
  .price {
    font-size: 26px;
    font-style: normal;
    font-weight: 700;
    line-height: 34px;
    color: ${({ theme }) => theme.textL1};
  }
  .price-change {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL1};
    ${({ $isPositive, $change }) =>
      Number($change) !== 0 &&
      ($isPositive
        ? css`
            color: ${({ theme }) => theme.jade10};
          `
        : css`
            color: ${({ theme }) => theme.ruby50};
          `)}
    span {
      color: ${({ theme }) => theme.textL2};
    }
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      .price {
        font-size: 0.2rem;
        line-height: 0.28rem;
        text-align: right;
      }
      .price-change {
        font-size: 0.12rem;
        line-height: 0.18rem;
        text-align: right;
      }
    `}
`

export default function ChartHeader({
  symbol,
  disabledToggle,
  backtestData,
  klineSubData,
  showFullScreen,
  changeShowCharts,
  isBinanceSupport,
  selectedPeriod,
  setSelectedPeriod,
}: {
  symbol: string
  disabledToggle?: boolean
  changeShowCharts?: () => void
  isBinanceSupport: boolean
  showFullScreen?: boolean
  backtestData?: BacktestDataType
  selectedPeriod: PERIOD_OPTIONS
  klineSubData: KlineSubInnerDataType | null
  setSelectedPeriod: (period: PERIOD_OPTIONS) => void
}) {
  const isMobile = useIsMobile()
  const getTokenImg = useGetTokenImg()
  const getConvertPeriod = useGetConvertPeriod()
  // 计算价格变化和变化百分比
  const priceChange = useMemo(() => {
    if (!klineSubData) return { change: '0', percentage: '0%' }

    const currentPrice = Number(klineSubData.k.c)
    const openPrice = Number(klineSubData.k.o)

    if (isNaN(currentPrice) || isNaN(openPrice) || openPrice === 0) {
      return { change: '0', percentage: '0%' }
    }
    const gap = sub(currentPrice, openPrice)
    const change = isGt(gap, 1) ? toFix(gap, 2) : toFix(gap, 4)
    const percentage = toPrecision(div(sub(currentPrice, openPrice), openPrice) * 100, 2)

    return {
      change,
      percentage: `${percentage}%`,
      isPositive: currentPrice >= openPrice,
    }
  }, [klineSubData])
  return (
    <ChartHeaderWrapper>
      <Left>
        <span className='symbol-info'>
          <ImgLoad src={getTokenImg(symbol)} alt={symbol} />
          <span>{symbol}</span>
        </span>
        <PriceInfo $isPositive={!!priceChange.isPositive} $change={priceChange.change}>
          <span onClick={isMobile && !disabledToggle ? changeShowCharts : undefined} className='price'>
            {klineSubData?.k.c ? '$' : ''}
            {formatNumber(Number(klineSubData?.k.c))}
            {isMobile && !disabledToggle && <IconBase className='icon-chat-expand-down' />}
          </span>
          <span className='price-change'>
            {priceChange.change} ({priceChange.percentage})
            <span>&nbsp;/&nbsp;{getConvertPeriod(selectedPeriod, isBinanceSupport)}</span>
          </span>
        </PriceInfo>
      </Left>
      {!isMobile && (
        <PeridSelector
          showFullScreen={showFullScreen}
          isBinanceSupport={isBinanceSupport}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          backtestData={backtestData}
        />
      )}
    </ChartHeaderWrapper>
  )
}
