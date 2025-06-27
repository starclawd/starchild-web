import { memo, useCallback, useEffect, useMemo, useRef, useState, useImperativeHandle } from 'react';
import { IChartApi, ISeriesApi } from 'lightweight-charts';
import styled, { css } from 'styled-components';
import { vm } from 'pages/helper';
import { useIsMobile } from 'store/application/hooks';
import { ANI_DURATION } from 'constants/index';
import { ChartDataItem, CryptoChartProps, KlineSubInnerDataType } from 'store/insights/insights';
import Pending from 'components/Pending';
import { useTimezone } from 'store/timezonecache/hooks';
import { useTheme } from 'store/themecache/hooks';
import ChartHeader from '../../../../components/ChartHeader';
import PeridSelector from '../../../../components/ChartHeader/components/PeridSelector';
import { PERIOD_OPTIONS } from 'store/insightscache/insightscache';
import { useMobileBacktestType } from 'store/backtest/hooks';
import DataList from '../DataList';
import VolumeChart from '../VolumeChart';
import { MOBILE_BACKTEST_TYPE } from 'store/backtest/backtest';
import BuySellTable from '../BuySellTable';
import { useCoinGeckoPolling } from './hooks/useCoinGeckoPolling';
import { useBinanceKlinePolling } from './hooks/useBinanceKlinePolling';
import { useTradeMarkers } from './hooks/useTradeMarkers';
import { useChartDataLoader } from './hooks/useChartDataLoader';
import { useChartConfiguration } from './hooks/useChartConfiguration';
import { convertToBinanceTimeZone } from 'utils/timezone';
import { createCustomTimeFormatter, createChartResizeHandler } from 'utils/chartUtils';

const ChartWrapper = styled.div<{ $isMobileBackTestPage?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: auto;
  ${({ theme, $isMobileBackTestPage }) => theme.isMobile && css`
    height: 100%;
    gap: ${vm(8, $isMobileBackTestPage)};
  `}
`;

const ChartContentWrapper = styled.div<{ $mobileBacktestType: MOBILE_BACKTEST_TYPE, $isMobileBackTestPage?: boolean }>`
  position: relative;
  flex-shrink: 0;
  height: 218px;
  ${({ theme, $isMobileBackTestPage, $mobileBacktestType }) => theme.isMobile && css`
    width: 100%;
    gap: 12px;
    height: calc(100% - 54px);
    transition: height ${ANI_DURATION}s;
    ${!$isMobileBackTestPage && $mobileBacktestType === MOBILE_BACKTEST_TYPE.PRICE && css`
      height: ${vm(243)};
    `}
    ${!$isMobileBackTestPage && $mobileBacktestType === MOBILE_BACKTEST_TYPE.EQUITY && css`
      height: ${vm(356)};
    `}
    ${!$isMobileBackTestPage && $mobileBacktestType === MOBILE_BACKTEST_TYPE.TRADES && css`
      height: auto;
    `}
  `}
`;

const ChartContainer = styled.div`
  position: relative;
  flex-shrink: 0;
  height: 100%;
  .pending-wrapper {
    position: absolute;
    justify-content: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    .icon-loading {
      font-size: 36px;
    }
  }
  
  ${({ theme }) => theme.isMobile && css`
    width: 100%;
    height: calc(100% - 28px);
    transition: height ${ANI_DURATION}s;
    .pending-wrapper {
      .icon-loading {
        font-size: 36px;
      }
    }
  `}
`;

const VolumeWrapper = styled.div<{ $isMobileBackTestPage?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 12px;
  padding-bottom: 12px;
  .volume-chart-wrapper {
    height: calc(100% - 132px);
    .chart-content {
      /* height: calc(100% - 18px); */
      height: 100%;
    }
    .icon-wrapper {
      justify-content: flex-end;
    }
  }
  ${({ theme, $isMobileBackTestPage }) => theme.isMobile && !$isMobileBackTestPage && css`
    padding-bottom: 0;
    .volume-chart-wrapper {
      height: calc(100% - ${vm(168)});
      .icon-wrapper {
        justify-content: flex-start;
      }
    }
  `}
`

const CryptoChart = function CryptoChart({
  ref,
  symbol = 'BTC',
  isBinanceSupport,
  isMobileBackTestPage,
  backtestData,
  showFullScreen = false,
}: CryptoChartProps) {
  const isMobile = useIsMobile();
  const [mobileBacktestType] = useMobileBacktestType()
  const { details: marksDetailData } = backtestData
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<PERIOD_OPTIONS>('1d')
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [klinesubData, setKlinesubData] = useState<KlineSubInnerDataType | null>(null)
  const [historicalDataLoaded, setHistoricalDataLoaded] = useState<boolean>(false);
  const [reachedDataLimit, setReachedDataLimit] = useState<boolean>(false);
  const paramSymbol = `${symbol}USDT`
  const [timezone] = useTimezone(); // 使用时区hook获取当前时区设置
  const theme = useTheme();
  // 获取币安API格式的时区
  const binanceTimeZone = useMemo(() => {
    return convertToBinanceTimeZone(timezone);
  }, [timezone]);

  // 自定义时间格式化器，根据用户时区显示时间
  const customTimeFormatter = useMemo(() => {
    return createCustomTimeFormatter(timezone);
  }, [timezone]);

  // 使用交易标记hook
  const { getMarksTimeRange, generateMockTradeMarkers, refreshTradeMarkers: refreshTradeMarkersHook } = useTradeMarkers({
    marksDetailData,
    selectedPeriod
  });

  // 包装refreshTradeMarkers方法以传递refs
  const refreshTradeMarkers = useCallback((currentChartData: ChartDataItem[]) => {
    refreshTradeMarkersHook(currentChartData, seriesRef, chartRef);
  }, [refreshTradeMarkersHook]);

  // 创建一个可以从外部调用的 handleResize 函数
  const handleResize = useMemo(() => {
    return createChartResizeHandler(chartContainerRef, chartRef);
  }, []);

  // 暴露 handleResize 方法给父组件
  useImperativeHandle(ref, () => ({
    handleResize
  }), [handleResize]);


  // 使用数据加载器hook
  const { handlePeriodChange } = useChartDataLoader({
    marksDetailData,
    paramSymbol,
    isBinanceSupport,
    binanceTimeZone,
    chartData,
    setChartData,
    setHistoricalDataLoaded,
    setReachedDataLimit,
    reachedDataLimit,
    selectedPeriod,
    seriesRef,
    chartRef,
    getMarksTimeRange,
    refreshTradeMarkers
  });

  // 使用图表配置hook
  useChartConfiguration({
    chartContainerRef,
    chartRef,
    seriesRef,
    isMobile,
    paramSymbol,
    selectedPeriod,
    theme,
    handleResize,
    customTimeFormatter,
    timezone,
    klinesubData,
    historicalDataLoaded,
    chartData,
    isBinanceSupport
  });


  // 当时区变化时重新加载数据
  useEffect(() => {
    if (selectedPeriod) {
      handlePeriodChange(selectedPeriod);
    }
  }, [timezone, selectedPeriod, handlePeriodChange]);


  // 使用CoinGecko轮询hook
  useCoinGeckoPolling({
    isBinanceSupport,
    historicalDataLoaded,
    symbol,
    paramSymbol,
    selectedPeriod,
    setKlinesubData
  });

  // 使用币安K线轮询hook
  useBinanceKlinePolling({
    isBinanceSupport,
    historicalDataLoaded,
    symbol,
    paramSymbol,
    selectedPeriod,
    setKlinesubData
  });

  useEffect(() => {
    return () => {
      setChartData([]);
      setKlinesubData(null);
      setHistoricalDataLoaded(false);
      setReachedDataLimit(false);
    }
  }, [setKlinesubData])


  return (
    <ChartWrapper className="chart-wrapper" $isMobileBackTestPage={isMobileBackTestPage}>
      <ChartHeader
        disabledToggle
        symbol={symbol}
        issShowCharts={true}
        isShowChartCheck={true}
        backtestData={backtestData}
        klineSubData={klinesubData}
        showFullScreen={showFullScreen}
        isMobileBackTestPage={isMobileBackTestPage}
        isBinanceSupport={isBinanceSupport}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
      />
      <ChartContentWrapper className="chart-content-wrapper" $mobileBacktestType={mobileBacktestType} $isMobileBackTestPage={isMobileBackTestPage}>
        {isMobile && mobileBacktestType === MOBILE_BACKTEST_TYPE.PRICE && <PeridSelector
          isBinanceSupport={isBinanceSupport}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          forceWebStyle={isMobileBackTestPage}
          backtestData={backtestData}
        />}
        <ChartContainer style={{ display: mobileBacktestType === MOBILE_BACKTEST_TYPE.PRICE ? 'block' : 'none' }} ref={chartContainerRef}>
          {chartData.length === 0 && <Pending />}
        </ChartContainer>
        {isMobile && mobileBacktestType === MOBILE_BACKTEST_TYPE.EQUITY && <VolumeWrapper $isMobileBackTestPage={isMobileBackTestPage}>
          <DataList isMobileBackTestPage={isMobileBackTestPage} backtestData={backtestData} />
          <VolumeChart symbol={symbol} isBinanceSupport={isBinanceSupport} backtestData={backtestData} />
        </VolumeWrapper>}
        {isMobile && mobileBacktestType === MOBILE_BACKTEST_TYPE.TRADES && <BuySellTable backtestData={backtestData} />}
      </ChartContentWrapper>
    </ChartWrapper>
  );
};

export default memo(CryptoChart);