import { IconBase } from 'components/Icons';
import { ANI_DURATION } from 'constants/index';
import { vm } from 'pages/helper';
import { useMemo } from 'react';
import { useGetTokenImg, useIsMobile } from 'store/application/hooks';
import styled, { css } from 'styled-components'
import { div, isGt, sub, toFix, toPrecision } from 'utils/calc';
import { formatNumber } from 'utils/format';
import { useGetConvertPeriod } from 'store/insightscache/hooks';
import ImgLoad from 'components/ImgLoad';
import PeridSelector from './components/PeridSelector';
import ChartCheck from 'pages/BackTest/components/ChartCheck';
import { PERIOD_OPTIONS } from 'store/insightscache/insightscache';
import { useKlineSubData } from 'store/backtest/hooks';
import { KlineSubInnerDataType } from 'store/insights/insights';

const ChartHeaderWrapper = styled.div<{ $isMobileBackTestPage?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ theme, $isMobileBackTestPage }) => theme.isMobile && css`
    gap: ${vm(8, $isMobileBackTestPage)};
    img {
      width: ${vm(32, $isMobileBackTestPage)};
      height: ${vm(32, $isMobileBackTestPage)};
    }
  `}
`;

const Left = styled.div<{ $issShowCharts: boolean, $isPositive: boolean, $change: string, $isMobileBackTestPage?: boolean }>`
  display: flex;
  flex-direction: column;
  .symbol-info {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 8px;
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
    ${({ $isPositive, $change }) => Number($change) !== 0 && ($isPositive
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
  ${({ theme, $issShowCharts, $isMobileBackTestPage }) => theme.isMobile
  && ($isMobileBackTestPage ? css`
    width: 100%;
    .price {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      color: ${({ theme }) => theme.textL1};
      .icon-chat-expand-down {
        font-size: 14px;
        color: ${({ theme }) => theme.textL1};
        transition: transform ${ANI_DURATION}s;
        ${$issShowCharts && css`
          transform: rotate(180deg);
        `}
      }
    }
    .price-change {
      font-size: 12px;
      line-height: 18px;
    }
  ` : css`
    width: 100%;
    .price {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      font-size: 0.20rem;
      font-weight: 500;
      line-height: 0.28rem;
      color: ${({ theme }) => theme.textL1};
      .icon-chat-expand-down {
        font-size: 0.14rem;
        color: ${({ theme }) => theme.textL1};
        transition: transform ${ANI_DURATION}s;
        ${$issShowCharts && css`
          transform: rotate(180deg);
        `}
      }
    }
    .price-change {
      font-size: 0.12rem;
      line-height: 0.18rem;
    }
  `)}
`;

export default function ChartHeader({
  symbol,
  disabledToggle,
  issShowCharts,
  klineSubData,
  isShowChartCheck,
  changeShowCharts,
  isBinanceSupport,
  selectedPeriod,
  setSelectedPeriod,
  isMobileBackTestPage,
}: {
  symbol: string
  disabledToggle?: boolean
  issShowCharts: boolean
  changeShowCharts?: () => void
  isBinanceSupport: boolean
  isShowChartCheck: boolean
  selectedPeriod: PERIOD_OPTIONS
  isMobileBackTestPage?: boolean
  klineSubData: KlineSubInnerDataType
  setSelectedPeriod: (period: PERIOD_OPTIONS) => void
}) {
  const isMobile = useIsMobile()
  const getTokenImg = useGetTokenImg()
  const getConvertPeriod = useGetConvertPeriod()
  // 计算价格变化和变化百分比
  const priceChange = useMemo(() => {
    if (!klineSubData) return { change: '0', percentage: '0%' };
    
    const currentPrice = Number(klineSubData.k.c);
    const openPrice = Number(klineSubData.k.o);
    
    if (isNaN(currentPrice) || isNaN(openPrice) || openPrice === 0) {
      return { change: '0', percentage: '0%' };
    }
    const gap = sub(currentPrice, openPrice)
    const change = isGt(gap, 1) ? toFix(gap, 2) : toFix(gap, 4);
    const percentage = toPrecision((div(sub(currentPrice, openPrice), openPrice) * 100), 2);
    
    return {
      change,
      percentage: `${percentage}%`,
      isPositive: currentPrice >= openPrice
    };
  }, [klineSubData]);
  return <ChartHeaderWrapper $isMobileBackTestPage={isMobileBackTestPage}>
    {isMobileBackTestPage && <ImgLoad src={getTokenImg(symbol)} alt={symbol} />}
    <Left $isMobileBackTestPage={isMobileBackTestPage} $issShowCharts={issShowCharts} $isPositive={!!priceChange.isPositive} $change={priceChange.change}>
      {!isMobile && <span className="symbol-info">
        <ImgLoad src={getTokenImg(symbol)} alt={symbol} />
        <span>{symbol}</span>
      </span>}
      <span onClick={(isMobile && !disabledToggle) ? changeShowCharts : undefined} className="price">{klineSubData?.k.c ? '$' : ''}
        {formatNumber(Number(klineSubData?.k.c))}
        {isMobile && !disabledToggle && <IconBase className="icon-chat-expand-down" />}
      </span>
      <span className="price-change">
        {priceChange.change} ({priceChange.percentage})
        <span>&nbsp;/&nbsp;{getConvertPeriod(selectedPeriod, isBinanceSupport)}</span>
      </span>
    </Left>
    {isMobile && isShowChartCheck && <ChartCheck isMobileBackTestPage={isMobileBackTestPage} />}
    {!isMobile && <PeridSelector
      isMobileBackTestPage={isMobileBackTestPage}
      isBinanceSupport={isBinanceSupport}
      selectedPeriod={selectedPeriod}
      setSelectedPeriod={setSelectedPeriod}
    />}
  </ChartHeaderWrapper>
}
