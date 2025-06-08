import { memo, useCallback, useEffect, useMemo, useRef, useState, useImperativeHandle } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickSeries, UTCTimestamp, createSeriesMarkers, LineStyle } from 'lightweight-charts';
import styled, { css } from 'styled-components';
import { useGetHistoryKlineData, useGetCoinData } from 'store/insights/hooks';
import { formatNumber } from 'utils/format';
import { vm } from 'pages/helper';
import { toFix, toPrecision } from 'utils/calc';
import { useIsMobile } from 'store/application/hooks';
import { ANI_DURATION } from 'constants/index';
import { useGetConvertPeriod } from 'store/insightscache/hooks';
import { ChartDataItem, CryptoChartProps, KlineDataParams, KlineSubDataType, TradeMarker } from 'store/insights/insights';
import Pending from 'components/Pending';
import { useTimezone } from 'store/timezonecache/hooks';
import { useTheme } from 'store/themecache/hooks';
import ChartHeader from '../../../../components/ChartHeader';
import PeridSelector from '../../../../components/ChartHeader/components/PeridSelector';
import { PERIOD_OPTIONS } from 'store/insightscache/insightscache';
import { useBacktestData, useIsShowPrice, useKlineSubData } from 'store/backtest/hooks';
import DataList from '../DataList';
import VolumeChart from '../VolumeChart';

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

const ChartContentWrapper = styled.div<{ $isShowPrice: boolean, $isMobileBackTestPage?: boolean }>`
  position: relative;
  flex-shrink: 0;
  height: 218px;
  ${({ theme, $isMobileBackTestPage, $isShowPrice }) => theme.isMobile && css`
    width: 100%;
    gap: 12px;
    height: calc(100% - 54px);
    transition: height ${ANI_DURATION}s;
    ${!$isMobileBackTestPage && ($isShowPrice ? css`
      height: ${vm(243)};
    ` : css`
      height: ${vm(356)};
    `)}
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
}: CryptoChartProps) {
  const isMobile = useIsMobile();
  const [isShowPrice] = useIsShowPrice()
  const [{ details: marksDetailData }] = useBacktestData()
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<PERIOD_OPTIONS>('1d')
  const getConvertPeriod = useGetConvertPeriod()
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [klinesubData, setKlinesubData] = useKlineSubData()
  const triggerGetKlineData = useGetHistoryKlineData();
  const triggerGetCoinData = useGetCoinData();
  const [historicalDataLoaded, setHistoricalDataLoaded] = useState<boolean>(false);
  const [reachedDataLimit, setReachedDataLimit] = useState<boolean>(false);
  const paramSymbol = `${symbol}USDT`
  const [timezone] = useTimezone(); // 使用时区hook获取当前时区设置
  const theme = useTheme();
 
  // 获取币安API格式的时区
  const binanceTimeZone = useMemo(() => {
    try {
      if (!timezone) return '0'; // 没有时区时返回UTC
      
      // 获取指定时区的当前偏移量（分钟）
      const date = new Date();
      
      // 创建指定时区的日期时间格式化器
      const formatter = new Intl.DateTimeFormat('en', {
        timeZone: timezone,
        timeZoneName: 'longOffset'
      });
      
      // 获取时区偏移信息
      const timeZoneParts = formatter.formatToParts(date);
      const timeZoneOffsetPart = timeZoneParts.find(part => part.type === 'timeZoneName');
      
      if (!timeZoneOffsetPart) return '0';
      
      // 提取偏移字符串，例如 "GMT+08:00" 或 "GMT-05:00"
      const offsetMatch = timeZoneOffsetPart.value.match(/GMT([+-])(\d{2}):?(\d{2})?/);
      
      if (!offsetMatch) return '0';
      
      // 解析偏移组件
      const sign = offsetMatch[1]; // + 或 -
      const hours = parseInt(offsetMatch[2], 10);
      const minutes = offsetMatch[3] ? parseInt(offsetMatch[3], 10) : 0;
      
      // 确保在有效范围内 [-12:00 to +14:00]
      const absHours = hours + (minutes / 60);
      if ((sign === '+' && absHours > 14) || (sign === '-' && absHours > 12)) {
        return '0'; // 超出范围时返回UTC
      }
      
      // 构建时区字符串
      // 对于REST API，不带+号; 对于WebSocket，保留+号
      let formattedOffset;
      if (sign === '-') {
        // WebSocket需要完整格式或者负数时保留符号
        formattedOffset = sign + hours;
      } else {
        // REST API的正数时区不需要+号
        formattedOffset = hours.toString();
      }
      
      // 如果有分钟，添加分钟部分
      if (minutes > 0) {
        formattedOffset += ':' + (minutes < 10 ? '0' : '') + minutes;
      }
      
      return formattedOffset;
    } catch (error) {
      console.error('error:', error);
      return '0'; // 出错时返回UTC
    }
  }, [timezone]);

  // 自定义时间格式化器，根据用户时区显示时间
  const customTimeFormatter = useCallback((time: UTCTimestamp) => {
    try {
      // 将时间戳转换为毫秒
      const date = new Date(time * 1000);
      
      // 如果没有设置时区，使用UTC
      if (!timezone) {
        return date.toISOString().slice(0, 16).replace('T', ' '); // 返回 YYYY-MM-DD HH:MM 格式
      }
      
      // 使用用户设置的时区格式化时间，显示完整的日期和时间
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      return formatter.format(date).replace(',', ''); // 移除逗号，格式如：12/25/2024 14:30
    } catch (error) {
      console.error('时间格式化错误:', error);
      // 出错时返回UTC时间
      const date = new Date(time * 1000);
      return date.toISOString().slice(0, 16).replace('T', ' ');
    }
  }, [timezone]);

  // 生成模拟买卖标签数据
  const generateMockTradeMarkers = useCallback((): TradeMarker[] => {
    if (marksDetailData.length === 0) return [];
    
    const markers: TradeMarker[] = [];
    marksDetailData.forEach((item) => {
      const isBuy = item.side === 'buy';
      markers.push({
        time: Number(item.timestamp) as UTCTimestamp,
        position: isBuy ? 'belowBar' : 'aboveBar',
        color: isBuy ? theme.jade40 : theme.ruby40,
        shape: isBuy ? 'arrowUp' : 'arrowDown',
        text: isBuy ? 'Buy' : 'Sell',
        size: 0.5
      });
    });
    
    return markers;
  }, [theme.jade40, theme.ruby40, marksDetailData]);

  // 创建一个可以从外部调用的 handleResize 函数
  const handleResize = useCallback(() => {
    if (chartContainerRef.current && chartRef.current) {
      chartRef.current.applyOptions({ 
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight 
      });
    }
  }, []);

  // 暴露 handleResize 方法给父组件
  useImperativeHandle(ref, () => ({
    handleResize
  }), [handleResize]);

  // 创建一个函数，将获取的CoinGecko数据转换为klinesubData格式
  const createKlineSubData = useCallback((
    coinData: any, 
    symbol: string, 
    period: string
  ) => {
    if (!coinData || !coinData.market_data) return null;
    
    const now = Date.now();
    const marketData = coinData.market_data;
    
    // 获取当前价格和24小时前价格
    const currentPrice = marketData.current_price?.usd || 0;
    const high24h = marketData.high_24h?.usd || currentPrice;
    const low24h = marketData.low_24h?.usd || currentPrice;
    const priceChange24h = marketData.price_change_24h || 0;
    const priceChangePercentage24h = marketData.price_change_percentage_24h || 0;
    
    // 使用CoinGecko提供的1小时价格变化数据
    const priceChangePercentage1h = marketData.price_change_percentage_1h_in_currency?.usd || 0;
    // 根据1小时价格变化百分比计算价格变化值
    const priceChange1h = currentPrice * priceChangePercentage1h / 100;
    
    // 根据周期选择不同的价格变化数据
    let openPrice = currentPrice;
    let period_change = 0;
    
    // 根据getConvertPeriod转换的周期选择价格变化
    const convertedPeriod = getConvertPeriod(period as any, false);
    if (convertedPeriod === '1h') {
      // 1小时价格变化
      openPrice = currentPrice - priceChange1h;
      period_change = priceChangePercentage1h;
    } else if (convertedPeriod === '1d') {
      // 24小时价格变化
      openPrice = currentPrice - priceChange24h;
      period_change = priceChangePercentage24h;
    }
    
    // 确保openPrice不为负数
    openPrice = Math.max(0.000001, openPrice);

    
    // 创建模拟的K线数据
    const klineData: KlineSubDataType = {
      stream: `${symbol.toLowerCase()}@kline_${period}`,
      data: {
        e: 'kline', // 事件类型
        E: now, // 事件时间
        s: symbol.toUpperCase(), // 交易对
        k: {
          t: now - (convertedPeriod === '1h' ? 3600000 : 86400000), // 开盘时间
          T: now, // 收盘时间
          s: symbol.toUpperCase(), // 交易对
          i: convertedPeriod, // 间隔
          f: 0, // 第一笔成交ID
          L: 0, // 最后一笔成交ID
          o: openPrice.toString(), // 开盘价
          c: currentPrice.toString(), // 收盘价
          h: high24h.toString(), // 最高价，使用24h最高价
          l: low24h.toString(), // 最低价，使用24h最低价
          v: '0', // 成交量，CoinGecko不提供
          n: 0, // 成交笔数
          x: false, // K线是否完结
          q: '0', // 成交额
          V: '0', // 主动买入成交量
          Q: '0', // 主动买入成交额
          B: '0' // 忽略
        }
      }
    };
    
    return klineData;
  }, [getConvertPeriod]);

  // Handle period change
  const handlePeriodChange = useCallback(async (period: string) => {
    if (marksDetailData.length === 0) return;
    setHistoricalDataLoaded(false); // Reset historical data loaded flag
    setChartData([])
    try {
      // 获取转换后的周期，用于CoinGecko数据源
      const convertedPeriod = getConvertPeriod(period as any, isBinanceSupport);
      
      // Call API to get K-line data
      const response = await triggerGetKlineData({
        isBinanceSupport,
        symbol: paramSymbol, 
        interval: isBinanceSupport ? period : convertedPeriod, // 如果是CoinGecko数据源，使用转换后的周期
        limit: 500, // Increase data points to ensure sufficient data
        timeZone: binanceTimeZone // 使用转换后的时区格式
      } as KlineDataParams);
      
      if (response.data && response.data.length > 0) {
        // Directly use the API return data, keep all data points
        const formattedData = response.data.map((item: any) => {
          // Format time based on different periods
          const timeFormat =  Math.floor(new Date(item.time).getTime() / 1000) as UTCTimestamp
          
          return {
            time: timeFormat,
            open: item.open || item.close || item.value,
            high: item.high || item.close || item.value,
            low: item.low || item.close || item.value,
            close: item.close || item.value,
            volume: item.volume || 0
          };
        });
        setChartData(formattedData);
        
        if (seriesRef.current) {
          seriesRef.current.setData(formattedData);
          
          // 生成并添加买卖标签
          const tradeMarkers = generateMockTradeMarkers();
          
          // 改进标记匹配逻辑 - 根据K线周期将交易时间映射到正确的K线柱子
          const adjustedMarkers: TradeMarker[] = [];
          
          // 获取当前周期对应的秒数
          const getPeriodSeconds = (period: string): number => {
            switch (period) {
              case '1m': return 60;
              case '3m': return 3 * 60;
              case '5m': return 5 * 60;
              case '15m': return 15 * 60;
              case '30m': return 30 * 60;
              case '1h': return 60 * 60;
              case '2h': return 2 * 60 * 60;
              case '4h': return 4 * 60 * 60;
              case '6h': return 6 * 60 * 60;
              case '8h': return 8 * 60 * 60;
              case '12h': return 12 * 60 * 60;
              case '1d': return 24 * 60 * 60;
              case '3d': return 3 * 24 * 60 * 60;
              case '1w': return 7 * 24 * 60 * 60;
              case '1M': return 30 * 24 * 60 * 60;
              default: return 24 * 60 * 60; // 默认1天
            }
          };
          
          const periodSeconds = getPeriodSeconds(selectedPeriod);
          
          tradeMarkers.forEach(marker => {
            const markerTime = marker.time;
            
            // 计算交易时间应该落在哪个K线周期的开始时间
            const periodStartTime = Math.floor(markerTime / periodSeconds) * periodSeconds;
            // 在formattedData中查找匹配的K线柱子
            const matchingKline = formattedData.find((dataPoint: ChartDataItem) => {
              const klineTime = Number(dataPoint.time);
              // 对于K线数据，时间戳通常是该周期的开始时间
              return klineTime === periodStartTime;
            });
            
            if (matchingKline) {
              adjustedMarkers.push({
                time: matchingKline.time as UTCTimestamp,
                position: marker.position,
                color: marker.color,
                shape: marker.shape,
                text: marker.text,
                size: marker.size
              });
            } else {
              let closestKline = formattedData[0];
              let minTimeDiff = Math.abs(Number(formattedData[0]?.time) - periodStartTime);
              
              formattedData.forEach((dataPoint: ChartDataItem) => {
                const klineTime = Number(dataPoint.time);
                const timeDiff = Math.abs(klineTime - periodStartTime);
                
                if (timeDiff < minTimeDiff) {
                  minTimeDiff = timeDiff;
                  closestKline = dataPoint;
                }
              });
              
              if (closestKline && minTimeDiff < periodSeconds) { // 误差不超过一个周期
                adjustedMarkers.push({
                  time: closestKline.time as UTCTimestamp,
                  position: marker.position,
                  color: marker.color,
                  shape: marker.shape,
                  text: marker.text,
                  size: marker.size
                });
              }
            }
          });
          
          if (chartRef.current) {
            createSeriesMarkers(seriesRef.current, adjustedMarkers);
          }
        }
        
        setHistoricalDataLoaded(true); // Mark historical data as loaded
      }
    } catch (error) {
      setHistoricalDataLoaded(false); // Reset on error
    }
  }, [paramSymbol, isBinanceSupport, binanceTimeZone, marksDetailData.length, selectedPeriod, triggerGetKlineData, getConvertPeriod, generateMockTradeMarkers]);

  useEffect(() => {
    if (!klinesubData || !seriesRef.current || !historicalDataLoaded || !chartRef.current || !isBinanceSupport) return;
    
    try {
      // Format the real-time data to match chart format
      const time = Math.floor(new Date(klinesubData?.k?.t).getTime() / 1000) as UTCTimestamp;
      const latestData: ChartDataItem = {
        time,
        open: Number(klinesubData.k.o),
        high: Number(klinesubData.k.h),
        low: Number(klinesubData.k.l),
        close: Number(klinesubData.k.c),
        volume: Number(klinesubData.k.v)
      };
      // Check if this is an update to the last point or a new point
      if (chartData.length > 0) {
        // Use update method for real-time updates instead of setData
        // This preserves the chart's view position
        seriesRef.current.update(latestData);
      }
    } catch (error) {
      console.log('subError', error);
      // Silent error handling for real-time updates
    }
  }, [klinesubData, selectedPeriod, historicalDataLoaded, chartData.length, isBinanceSupport]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Remove previous chart instance
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      seriesRef.current = null;
    }

    // Chart configuration
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#07080A' },
        textColor: 'rgba(255, 255, 255, 0.54)',
        fontSize: isMobile ? 11 : 12,
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.06)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.06)' },
      },
      localization: {
        locale: 'en-US',
        dateFormat: 'yyyy/MM/dd',
        timeFormatter: customTimeFormatter, // 使用自定义时间格式化器
        priceFormatter: (price: number) => {
          if (price >= 1) {
            return formatNumber(toFix(price, 2))
          } else {
            return toPrecision(price, 2)
          }
        },
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.06)',
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: UTCTimestamp, tickMarkType: any, locale: string) => {
          try {
            const date = new Date(time * 1000);
            
            if (!timezone) {
              // 没有时区设置时使用UTC，根据tickMarkType显示不同格式
              if (tickMarkType === 3) { // Time (用于crosshair hover)
                return date.toISOString().slice(0, 16).replace('T', ' '); // 完整日期时间
              }
              return date.toISOString().slice(0, 16).replace('T', ' ');
            }
            
            // 根据tickMarkType显示不同的时间格式
            const options: Intl.DateTimeFormatOptions = {
              timeZone: timezone,
            };
            
            // 根据图表的缩放级别显示不同的时间格式
            if (tickMarkType === 0) { // Year
              options.year = 'numeric';
            } else if (tickMarkType === 1) { // Month
              options.year = 'numeric';
              options.month = 'short';
            } else if (tickMarkType === 2) { // DayOfMonth
              options.month = '2-digit';
              options.day = '2-digit';
            } else if (tickMarkType === 3) { // Time (crosshair hover时使用)
              // 显示完整的日期和时间
              options.year = 'numeric';
              options.month = '2-digit';
              options.day = '2-digit';
              options.hour = '2-digit';
              options.minute = '2-digit';
              options.hour12 = false;
            } else {
              // 默认显示日期和时间
              options.year = 'numeric';
              options.month = '2-digit';
              options.day = '2-digit';
              options.hour = '2-digit';
              options.minute = '2-digit';
              options.hour12 = false;
            }
            
            const formatter = new Intl.DateTimeFormat('en-US', options);
            return formatter.format(date).replace(',', ''); // 移除逗号
          } catch (error) {
            console.error('时间轴格式化错误:', error);
            const date = new Date(time * 1000);
            return date.toISOString().slice(0, 16).replace('T', ' ');
          }
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.06)',
        textColor: 'rgba(255, 255, 255, 0.54)',
        entireTextOnly: true,
      },
      crosshair: {
        // Modify crosshair line style
        vertLine: {
          color: 'rgba(255, 255, 255, 0.54)',
          width: 1,
          style: LineStyle.LargeDashed, // Dashed line style
          labelVisible: true, // 显示垂直线标签
          labelBackgroundColor: '#20252F', // 标签背景色
        },
        horzLine: {
          color: 'rgba(255, 255, 255, 0.54)',
          width: 1,
          style: LineStyle.LargeDashed, // Dashed line style
          labelVisible: true, // 显示水平线标签
          labelBackgroundColor: '#20252F', // 标签背景色
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    chartRef.current = chart;

    // Create candlestick chart
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: theme.jade40, // 上涨蜡烛颜色（theme.jade40）
      downColor: theme.ruby40, // 下跌蜡烛颜色（theme.ruby40）
      borderVisible: false, // 不显示边框
      wickUpColor: theme.jade40, // 上涨影线颜色（theme.jade40）
      wickDownColor: theme.ruby40, // 下跌影线颜色（theme.ruby40）
      priceLineVisible: true,
      lastValueVisible: true, // 显示最新价格标签
      priceLineSource: 0, // 使用收盘价作为价格线来源
      priceLineWidth: 1, // 价格线宽度
      priceLineStyle: LineStyle.LargeDashed, // 价格线样式为虚线
    });

    seriesRef.current = candlestickSeries;
    // Adjust time axis
    chart.timeScale().fitContent();

    // Handle window size change - create local function that calls external handleResize
    const handleWindowResize = () => {
      handleResize();
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [isMobile, paramSymbol, selectedPeriod, theme.jade40, theme.ruby40, triggerGetKlineData, handleResize, customTimeFormatter, timezone]);

  useEffect(() => {
    if (chartData.length > 0 && seriesRef.current && chartRef.current) {
      // 使用一个独立变量来跟踪图表的滚动行为
      let isLoadingMoreData = false;
      // 计算初始数据中最早的时间戳
      let lastLoadedTimestamp = chartData.length > 0 ? 
        Math.min(...chartData.map((item: {time: string | number; close?: number}) => 
          typeof item.time === 'string' ? new Date(item.time).getTime() / 1000 : Number(item.time)
        )) : 0;
      
      // 记录用户滚动方向，使用数值类型
      let lastVisibleFrom = 0; 
      // 将图表位置重置到最近的数据
      // 周期切换后，确保查看的是最新数据
      chartRef.current.timeScale().fitContent();
      // 定义处理器函数
      const handleVisibleRangeChange = () => {
        // 如果正在加载数据或已经到达数据边界，不再继续加载
        if (isLoadingMoreData || reachedDataLimit || !chartRef.current) return;
        
        // 获取逻辑范围，这是数值类型
        const logicalRange = chartRef.current.timeScale().getVisibleLogicalRange();
        if (!logicalRange) return;
        
        // 判断滚动方向：使用逻辑范围中的数值
        const currentFrom = logicalRange.from;
        const isScrollingLeft = typeof currentFrom === 'number' && typeof lastVisibleFrom === 'number' && currentFrom < lastVisibleFrom;
        
        // 更新上次位置
        if (typeof currentFrom === 'number') {
          lastVisibleFrom = currentFrom;
        }
        
        // 只有在向左滚动且接近图表左边缘时才加载更多历史数据
        if (isScrollingLeft && logicalRange.from < 10) {
          // 确保我们不会重复加载相同的数据
          if (!lastLoadedTimestamp) return;
          
          isLoadingMoreData = true;
          
          // 使用最早的时间戳作为下一批数据的结束时间
          const endTime = new Date(lastLoadedTimestamp * 1000);
          
          // 加载更多历史数据
          triggerGetKlineData({
            symbol: paramSymbol,
            interval: isBinanceSupport ? selectedPeriod : getConvertPeriod(selectedPeriod as any, isBinanceSupport),
            endTime: endTime.getTime(),
            limit: 500,
            timeZone: binanceTimeZone, // 使用转换后的时区格式
            isBinanceSupport
          } as KlineDataParams).then(response => {
            if (response.data && response.data.length > 0) {
              // 检查是否已到达数据边界
              if (response.data.length < 500) {
                setReachedDataLimit(true);
              }
              
              // 格式化新数据
              const newData = response.data.map((item: { 
                time: number | string; 
                close?: number; 
                value?: number; 
                open?: number; 
                high?: number; 
                low?: number;
                volume?: number;
              }) => {
                const utcTime = Math.floor(new Date(item.time).getTime() / 1000) as UTCTimestamp;
                
                return {
                  time: utcTime,
                  value: item.close || item.value,
                  open: item.open,
                  high: item.high,
                  low: item.low,
                  close: item.close || item.value,
                  volume: item.volume || 0
                };
              });
              
              // 找出新数据中最早的时间戳
              const newEarliestTimestamp = Math.min(...newData.map((item: {time: string | number; close?: number}) => Number(item.time)));
              
              // 只有当新数据确实比现有数据更早时才更新
              if (newEarliestTimestamp < lastLoadedTimestamp) {
                lastLoadedTimestamp = newEarliestTimestamp;
                
                // 处理重复数据
                if (seriesRef.current) {
                  // 创建时间戳集合用于去重
                  const existingTimestamps = new Set(chartData.map((item: {time: string | number; close?: number}) => 
                    typeof item.time === 'string' ? item.time : String(item.time)
                  ));
                  
                  // 过滤掉重复的数据点
                  const uniqueNewData = newData.filter((item: {time: string | number; close?: number}) => 
                    !existingTimestamps.has(typeof item.time === 'string' ? item.time : String(item.time))
                  );
                  
                  if (uniqueNewData.length > 0) {
                    // 合并新旧数据
                    const combinedData = [...uniqueNewData, ...chartData];
                    
                    // 记录当前可见的时间范围
                    let fromTime: number | undefined, toTime: number | undefined;
                    if (chartRef.current) {
                      fromTime = chartRef.current.timeScale().getVisibleLogicalRange()?.from;
                      toTime = chartRef.current.timeScale().getVisibleLogicalRange()?.to;
                    }
                    
                    // 更新数据
                    seriesRef.current.setData(combinedData);
                    setChartData(combinedData);
                    
                    // 使用 setTimeout 确保在数据渲染后恢复视图
                    setTimeout(() => {
                      if (fromTime !== undefined && toTime !== undefined && chartRef.current) {
                        // 计算当前视图位置的偏移量
                        const offset = uniqueNewData.length;
                        // 调整视图范围，考虑新增的数据点
                        chartRef.current.timeScale().setVisibleLogicalRange({
                          from: fromTime + offset,
                          to: toTime + offset
                        });
                      }
                    }, 0);
                  }
                }
              } else {
                // 如果没有获取到更早的数据，认为已经到达边界
                setReachedDataLimit(true);
              }
            } else {
              // 无数据返回，认为已经到达边界
              setReachedDataLimit(true);
            }
            
            isLoadingMoreData = false;
          }).catch(error => {
            console.error('加载历史数据失败:', error);
            isLoadingMoreData = false;
          });
        }
      };

      // 监听图表滚动事件
      const timeScale = chartRef.current.timeScale();
      timeScale.subscribeVisibleTimeRangeChange(handleVisibleRangeChange);
      
      // 清理订阅
      return () => {
        if (chartRef.current) {
          const timeScale = chartRef.current.timeScale();
          timeScale.unsubscribeVisibleTimeRangeChange(handleVisibleRangeChange);
        }
      };
    }
  }, [chartData, paramSymbol, selectedPeriod, reachedDataLimit, binanceTimeZone, isBinanceSupport, triggerGetKlineData, getConvertPeriod]);

  // 重置数据边界状态当周期改变时
  useEffect(() => {
    setReachedDataLimit(false);
  }, [selectedPeriod]);

  // 当时区变化时重新加载数据
  useEffect(() => {
    if (selectedPeriod) {
      handlePeriodChange(selectedPeriod);
    }
  }, [timezone, selectedPeriod, handlePeriodChange]);


  // 使用定时器轮询获取CoinGecko价格数据
  useEffect(() => {
    // 只有在不支持币安且已加载历史数据时才启动轮询
    if (!isBinanceSupport && historicalDataLoaded && symbol) {
      const convertedPeriod = getConvertPeriod(selectedPeriod as any, false);
      
      // 首次获取数据
      const fetchCoinData = async () => {
        try {
          const response: any = await triggerGetCoinData(symbol);
          if (response?.data?.data) {
            const formattedData = createKlineSubData(
              response.data.data, 
              paramSymbol, 
              convertedPeriod
            );
            if (formattedData) {
              setKlinesubData(formattedData);
            }
          }
        } catch (error) {
          console.error('获取CoinGecko价格数据错误:', error);
        }
      };
      
      // 首次执行
      fetchCoinData();
      
      // 设置定时器，每5秒轮询一次
      const intervalId = setInterval(fetchCoinData, 60000);
      
      // 组件卸载时清除定时器
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [
    isBinanceSupport, 
    historicalDataLoaded, 
    symbol, 
    paramSymbol,
    selectedPeriod, 
    triggerGetCoinData, 
    createKlineSubData, 
    setKlinesubData,
    getConvertPeriod
  ]);

  // 使用定时器轮询获取币安最新K线数据
  useEffect(() => {
    // 只有在支持币安且已加载历史数据时才启动轮询
    if (isBinanceSupport && historicalDataLoaded && symbol) {
      // 首次获取数据
      const fetchLatestKlineData = async () => {
        try {
          const response = await triggerGetKlineData({
            isBinanceSupport,
            symbol: paramSymbol, 
            interval: selectedPeriod,
            limit: 1, // 只获取最新的一条K线数据
            timeZone: binanceTimeZone // 使用转换后的时区格式
            // 不传endTime，获取最新数据
          } as KlineDataParams);
          
          if (response.data && response.data.length > 0) {
            const latestItem = response.data[0];
            // 格式化为klinesubData格式
            const now = Date.now();
            const formattedKlineData: KlineSubDataType = {
              stream: `${paramSymbol.toLowerCase()}@kline_${selectedPeriod}`,
              data: {
                e: 'kline',
                E: now,
                s: paramSymbol.toUpperCase(),
                k: {
                  t: new Date(latestItem.time).getTime(),
                  T: now,
                  s: paramSymbol.toUpperCase(),
                  i: selectedPeriod,
                  f: 0,
                  L: 0,
                  o: (latestItem.open || latestItem.close || latestItem.value).toString(),
                  c: (latestItem.close || latestItem.value).toString(),
                  h: (latestItem.high || latestItem.close || latestItem.value).toString(),
                  l: (latestItem.low || latestItem.close || latestItem.value).toString(),
                  v: (latestItem.volume || 0).toString(),
                  n: 0,
                  x: false,
                  q: '0',
                  V: '0',
                  Q: '0',
                  B: '0'
                }
              }
            };
            setKlinesubData(formattedKlineData);
          }
        } catch (error) {
          console.error('获取币安最新K线数据错误:', error);
        }
      };
      
      // 首次执行
      fetchLatestKlineData();
      
      // 设置定时器，每60秒轮询一次
      const intervalId = setInterval(fetchLatestKlineData, 60000);
      
      // 组件卸载时清除定时器
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [
    isBinanceSupport, 
    historicalDataLoaded, 
    symbol, 
    paramSymbol,
    selectedPeriod, 
    triggerGetKlineData, 
    setKlinesubData,
    binanceTimeZone
  ]);

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
        klineSubData={klinesubData}
        isMobileBackTestPage={isMobileBackTestPage}
        isBinanceSupport={isBinanceSupport}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
      />
      <ChartContentWrapper className="chart-content-wrapper" $isShowPrice={isShowPrice} $isMobileBackTestPage={isMobileBackTestPage}>
        {isMobile && isShowPrice && <PeridSelector
          isBinanceSupport={isBinanceSupport}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          isMobileBackTestPage={isMobileBackTestPage}
        />}
        <ChartContainer style={{ display: isShowPrice ? 'block' : 'none' }} ref={chartContainerRef}>
          {chartData.length === 0 && <Pending />}
        </ChartContainer>
        {isMobile && !isShowPrice && <VolumeWrapper $isMobileBackTestPage={isMobileBackTestPage}>
          <DataList isMobileBackTestPage={isMobileBackTestPage} />
          <VolumeChart />
        </VolumeWrapper>}
      </ChartContentWrapper>
    </ChartWrapper>
  );
};

export default memo(CryptoChart);