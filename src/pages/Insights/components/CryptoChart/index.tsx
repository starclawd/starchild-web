import { memo, useCallback, useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { createChart, IChartApi, ISeriesApi, AreaSeries, UTCTimestamp } from 'lightweight-charts';
import styled, { css } from 'styled-components';
import Markers from './components/Marker';
import { useGetHistoryKlineData, useKlineSubData, useKlineSubscription, useInsightsList, useMarkerScrollPoint, useGetCoinData } from 'store/insights/hooks';
import { formatNumber } from 'utils/format';
import { vm } from 'pages/helper';
import { toFix } from 'utils/calc';
import { useIsMobile } from 'store/application/hooks';
import { ANI_DURATION } from 'constants/index';
import PeridSelector from 'components/ChartHeader/components/PeridSelector';
import { useGetConvertPeriod, useIssShowCharts, useSelectedPeriod } from 'store/insightscache/hooks';
import { KlineSubDataType, InsightsDataType, CryptoChartProps, ChartDataItem, KlineDataParams } from 'store/insights/insights';
import Pending from 'components/Pending';
import { useTimezone } from 'store/timezonecache/hooks';
import ChartHeader from 'components/ChartHeader';

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: auto;
  padding: 0 0 20px;
  ${({ theme }) => theme.isMobile && css`
    padding: ${vm(20)} 0 0;
    gap: ${vm(8)};
  `}
`;

const MobileWrapper = styled.div<{ $issShowCharts: boolean }>`
  position: relative;
  flex-shrink: 0;
  height: 218px;
  ${({ theme, $issShowCharts }) => theme.isMobile && css`
    width: 100%;
    gap: ${vm(12)};
    height: ${vm(188)};
    transition: height ${ANI_DURATION}s;
    ${!$issShowCharts && css`
      height: 0;
      overflow: hidden;
    `}
  `}
`;

const ChartContainer = styled.div`
  position: relative;
  flex-shrink: 0;
  height: 218px;
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
    height: ${vm(160)};
    transition: height ${ANI_DURATION}s;
    .pending-wrapper {
      .icon-loading {
        font-size: 0.36rem;
      }
    }
  `}
`;

const CryptoChart = function CryptoChart({
  ref,
  symbol = 'BTC',
  isBinanceSupport,
}: CryptoChartProps) {
  const isMobile = useIsMobile();
  const [issShowCharts, setIsShowCharts] = useIssShowCharts();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const getConvertPeriod = useGetConvertPeriod()
  const [selectedPeriod, setSelectedPeriod] = useSelectedPeriod();
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null);
  const [klinesubData, setKlinesubData] = useKlineSubData()
  const triggerGetKlineData = useGetHistoryKlineData();
  const triggerGetCoinData = useGetCoinData();
  const { subscribe, unsubscribe, isOpen } = useKlineSubscription()
  const [historicalDataLoaded, setHistoricalDataLoaded] = useState<boolean>(false);
  const [reachedDataLimit, setReachedDataLimit] = useState<boolean>(false);
  const paramSymbol = `${symbol}USDT`
  const [markerScrollPoint, setMarkerScrollPoint] = useMarkerScrollPoint();
  const [timezone] = useTimezone(); // 使用时区hook获取当前时区设置

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
  
  // 将Intl时区格式转换为币安API支持的格式
  const getBinanceTimeZone = useCallback((intlTimeZone: string, isForWebSocket: boolean = false): string => {
    try {
      if (!intlTimeZone) return '0'; // 没有时区时返回UTC
      
      // 获取指定时区的当前偏移量（分钟）
      const date = new Date();
      
      // 创建指定时区的日期时间格式化器
      const formatter = new Intl.DateTimeFormat('en', {
        timeZone: intlTimeZone,
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
      if (isForWebSocket || sign === '-') {
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
  }, []);
  
  // 获取币安API格式的时区
  const binanceTimeZone = useMemo(() => getBinanceTimeZone(timezone), [timezone, getBinanceTimeZone]);
  
  // 获取WebSocket订阅使用的时区格式
  const wsTimeZone = useMemo(() => getBinanceTimeZone(timezone, true), [timezone, getBinanceTimeZone]);

  // Handle period change
  const handlePeriodChange = useCallback(async (period: string) => {
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
            value: item.close || item.value, // Compatible with different data formats
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close || item.value,
            volume: item.volume || 0
          };
        });
        setChartData(formattedData);
        
        if (seriesRef.current) {
          seriesRef.current.setData(formattedData);
        }
        
        setHistoricalDataLoaded(true); // Mark historical data as loaded
      }
    } catch (error) {
      setHistoricalDataLoaded(false); // Reset on error
    }
  }, [paramSymbol, isBinanceSupport, binanceTimeZone, triggerGetKlineData, getConvertPeriod]);

  const changeShowCharts = useCallback(() => {
    setIsShowCharts(!issShowCharts)
  }, [issShowCharts, setIsShowCharts])

  // 自定义时间格式化函数，根据当前时区格式化时间显示
  const customTimeFormatter = useCallback((timestamp: UTCTimestamp): string => {
    try {
      // 创建UTC日期对象
      const utcDate = new Date(timestamp * 1000);
      
      // 使用当前时区格式化时间
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };
      
      // 根据选择的时间周期调整显示格式
      if (['1d', '3d', '1w'].includes(selectedPeriod)) {
        // 对于日线以上周期，只显示日期
        return utcDate.toLocaleDateString('en-US', {
          timeZone: timezone,
          month: '2-digit',
          day: '2-digit',
        });
      }
      
      // 返回格式化的时间字符串
      return utcDate.toLocaleString('en-US', options).replace(',', '');
    } catch (error) {
      console.error('时间格式化错误:', error);
      return new Date(timestamp * 1000).toLocaleString(); // 出错时返回默认格式
    }
  }, [timezone, selectedPeriod]);

  useEffect(() => {
    if (isOpen && paramSymbol && selectedPeriod && historicalDataLoaded && isBinanceSupport) {
      subscribe({
        symbol: paramSymbol.toLowerCase(),
        interval: selectedPeriod,
        timeZone: wsTimeZone
      });
    }
    return () => {
      if (isBinanceSupport) {
        unsubscribe({
          symbol: paramSymbol.toLowerCase(),
          interval: selectedPeriod,
          timeZone: wsTimeZone
        });
      }
    }
  }, [isOpen, paramSymbol, selectedPeriod, historicalDataLoaded, subscribe, unsubscribe, wsTimeZone, isBinanceSupport]);
  // Handle real-time data updates
  useEffect(() => {
    if (!klinesubData || !seriesRef.current || !historicalDataLoaded || !chartRef.current || !isBinanceSupport) return;
    
    try {
      // Format the real-time data to match chart format
      const time = Math.floor(new Date(klinesubData?.k?.t).getTime() / 1000) as UTCTimestamp;
      const latestData: ChartDataItem = {
        time,
        value: Number(klinesubData.k.c),
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
          } else if (price >= 0.01) {
            return formatNumber(toFix(price, 4))
          } else if (price >= 0.0001) {
            return formatNumber(toFix(price, 6))
          } else {
            return formatNumber(toFix(price, 8))
          }
        },
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.06)',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.06)',
        textColor: 'rgba(255, 255, 255, 0.54)',
        entireTextOnly: true,
      },
      crosshair: {
        // Modify crosshair line style
        vertLine: {
          color: 'rgba(255, 255, 255, 0.36)',
          width: 1,
          style: 1, // Dashed line style
        },
        horzLine: {
          color: 'rgba(255, 255, 255, 0.36)',
          width: 1,
          style: 1, // Dashed line style
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    chartRef.current = chart;

    // Create area chart
    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: '#335FFC',
      lineWidth: 1,
      topColor: 'rgba(51, 95, 252, 0.36)',
      bottomColor: 'rgba(51, 95, 252, 0.00)',
      priceLineVisible: false,
      lastValueVisible: false,
      // Add curve style to smooth line connection points
      lineType: 0, // Use curve type (0: Simple, 1: Step Line, 2: Curve)
      // Add point marker style when hovering
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 3, // Set radius to 6px (total width and height is 12px)
      crosshairMarkerBackgroundColor: '#000', // Background color is #000
      crosshairMarkerBorderColor: '#335FFC', // Border color
      crosshairMarkerBorderWidth: 3, // Border width is 3px
    });

    seriesRef.current = areaSeries;
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
  }, [isMobile, paramSymbol, selectedPeriod, triggerGetKlineData, customTimeFormatter, handleResize]);

  useEffect(() => {
    if (chartData.length > 0 && seriesRef.current && chartRef.current) {
      // 使用一个独立变量来跟踪图表的滚动行为
      let isLoadingMoreData = false;
      // 计算初始数据中最早的时间戳
      let lastLoadedTimestamp = chartData.length > 0 ? 
        Math.min(...chartData.map((item: ChartDataItem) => 
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
              const newEarliestTimestamp = Math.min(...newData.map((item: {time: string | number; value: number}) => Number(item.time)));
              
              // 只有当新数据确实比现有数据更早时才更新
              if (newEarliestTimestamp < lastLoadedTimestamp) {
                lastLoadedTimestamp = newEarliestTimestamp;
                
                // 处理重复数据
                if (seriesRef.current) {
                  // 创建时间戳集合用于去重
                  const existingTimestamps = new Set(chartData.map((item: ChartDataItem) => 
                    typeof item.time === 'string' ? item.time : String(item.time)
                  ));
                  
                  // 过滤掉重复的数据点
                  const uniqueNewData = newData.filter((item: {time: string | number; value: number}) => 
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

  // 监听markerScrollPoint的变化，滚动图表到对应时间点
  useEffect(() => {
    if (!chartRef.current || !seriesRef.current || !markerScrollPoint || chartData.length === 0) return;
    
    try {
      const chart = chartRef.current;
      const timeScale = chart.timeScale();
      
      // 查找与markerScrollPoint最接近的数据点
      let closestDataPoint = null;
      let minDiff = Infinity;
      let targetIndex = -1;
      
      for (let i = 0; i < chartData.length; i++) {
        const dataPoint = chartData[i];
        const chartTime = typeof dataPoint.time === 'string' 
          ? Math.floor(new Date(dataPoint.time).getTime() / 1000)
          : Number(dataPoint.time);
        
        const diff = Math.abs(chartTime - markerScrollPoint);
        
        if (diff < minDiff) {
          minDiff = diff;
          closestDataPoint = dataPoint;
          targetIndex = i;
        }
      }
      
      if (closestDataPoint && targetIndex !== -1) {
        // 获取当前可见的逻辑范围
        const visibleRange = timeScale.getVisibleLogicalRange();
        
        if (visibleRange) {
          // 计算当前可见区域的宽度
          const rangeWidth = visibleRange.to - visibleRange.from;
          
          // 计算目标位置（使目标点在中央）
          const targetFrom = Math.max(0, targetIndex - rangeWidth / 2);
          const targetTo = targetFrom + rangeWidth;
          
          // 使用动画平滑滚动
          // 1. 获取当前范围
          const currentFrom = visibleRange.from;
          const currentTo = visibleRange.to;
          
          // 2. 设置动画帧数和持续时间
          const totalFrames = 20; // 动画帧数
          let currentFrame = 0;
          const duration = 200; // 动画持续时间（毫秒）
          const frameInterval = duration / totalFrames;
          
          // 3. 创建动画函数
          const animate = () => {
            if (currentFrame >= totalFrames || !chartRef.current) {
              // 动画结束，设置最终位置
              if (chartRef.current) {
                timeScale.setVisibleLogicalRange({
                  from: targetFrom,
                  to: targetTo
                });
              }
              // 重置markerScrollPoint
              setMarkerScrollPoint(null);
              return;
            }
            
            // 计算当前帧的插值位置（使用缓动函数使动画更自然）
            const progress = easeInOutCubic(currentFrame / totalFrames);
            const newFrom = currentFrom + (targetFrom - currentFrom) * progress;
            const newTo = currentTo + (targetTo - currentTo) * progress;
            
            // 设置新的可见范围
            timeScale.setVisibleLogicalRange({
              from: newFrom,
              to: newTo
            });
            
            // 继续下一帧
            currentFrame++;
            setTimeout(animate, frameInterval);
          };
          
          // 4. 启动动画
          animate();
        } else {
          // 如果无法获取当前可见范围，使用备选方法
          timeScale.fitContent();
          
          // 重置markerScrollPoint
          setMarkerScrollPoint(null);
        }
      } else {
        // 如果找不到匹配的数据点，重置markerScrollPoint
        setMarkerScrollPoint(null);
      }
    } catch (error) {
      console.error('滚动图表错误:', error);
      // 发生错误时重置markerScrollPoint
      setMarkerScrollPoint(null);
    }
  }, [markerScrollPoint, chartData, setMarkerScrollPoint]);

  // 缓动函数，使动画更自然
  const easeInOutCubic = (t: number): number => {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  useEffect(() => {
    return () => {
      setChartData([]);
      setKlinesubData(null);
      setHistoricalDataLoaded(false);
      setReachedDataLimit(false);
    }
  }, [setKlinesubData])

  return (
    <ChartWrapper>
      <ChartHeader
        symbol={symbol}
        issShowCharts={issShowCharts}
        changeShowCharts={changeShowCharts}
        isBinanceSupport={isBinanceSupport}
        isShowChartCheck={false}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        klineSubData={klinesubData}
      />
      <MobileWrapper $issShowCharts={issShowCharts}>
        {isMobile && <PeridSelector
          isBinanceSupport={isBinanceSupport}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
        />}
        <ChartContainer ref={chartContainerRef}>
          {chartData.length === 0 && <Pending />}
          {/* Marker component - Only render when all references are valid */}
          {chartRef.current !== null && 
          seriesRef.current !== null && 
          chartContainerRef.current !== null && 
          chartData.length > 0 && (
            <Markers
              chartRef={chartRef as React.RefObject<IChartApi>}
              seriesRef={seriesRef as React.RefObject<ISeriesApi<'Area'>>}
              chartContainerRef={chartContainerRef as React.RefObject<HTMLDivElement>}
              chartData={chartData as any}
              selectedPeriod={selectedPeriod}
            />
          )}
        </ChartContainer>
      </MobileWrapper>
    </ChartWrapper>
  );
};

export default memo(CryptoChart);