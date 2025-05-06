import { useCallback, useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, AreaSeries, UTCTimestamp } from 'lightweight-charts';
import styled, { css } from 'styled-components';
import Markers, { MarkerPoint } from './components/Marker';
import { useGetHistoryKlineData, useKlineSubData, useSubBinanceKlineData, useUnSubBinanceKlineData } from 'store/insights/hooks';
import { useBinanceWebsocketOpenStatusMap } from 'store/websocket/hooks';
import ChartHeader from './components/ChartHeader';
import { formatNumber } from 'utils/format';
import { vm } from 'pages/helper';
import { toFix } from 'utils/calc';
import { useIsMobile } from 'store/application/hooks';
import { ANI_DURATION } from 'constants/index';
import PeridSelector from './components/PeridSelector';
import { useIssShowCharts } from 'store/insightscache/hooks';

// Define chart data type that matches lightweight-charts requirements
type ChartDataItem = {
  time: string | UTCTimestamp;
  value: number;
};

interface CryptoChartProps {
  data?: ChartDataItem[];
  symbol?: string;
  klinesubData?: any; // Real-time kline data
}



const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: auto;
  padding: 20px 0;
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
  ${({ theme }) => theme.isMobile && css`
    width: 100%;
    height: ${vm(160)};
    transition: height ${ANI_DURATION}s;
  `}
`;


const CryptoChart: React.FC<CryptoChartProps> = ({ data: propsData, symbol = 'BTC' }) => {
  const isMobile = useIsMobile();
  const [issShowCharts, setIsShowCharts] = useIssShowCharts();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('1d');
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null);
  const triggerGetKlineData = useGetHistoryKlineData();
  const subBinanceKlineData = useSubBinanceKlineData();
  const unSubBinanceKlineData = useUnSubBinanceKlineData();
  const klinesubData = useKlineSubData();
  const [isWsConnected] = useBinanceWebsocketOpenStatusMap();
  const [historicalDataLoaded, setHistoricalDataLoaded] = useState<boolean>(false);
  const [reachedDataLimit, setReachedDataLimit] = useState<boolean>(false);
  const paramSymbol = `${symbol}USDT`
  
  // Create sample markers
  const [markers, setMarkers] = useState<MarkerPoint[]>([]);
  // Subscribe to K-line data only after historical data is loaded
  useEffect(() => {
    if (isWsConnected && paramSymbol && selectedPeriod && historicalDataLoaded) {
      subBinanceKlineData({
        symbol: paramSymbol.toLowerCase(),
        interval: selectedPeriod
      });
    }
    return () => {
      unSubBinanceKlineData({
        symbol: paramSymbol.toLowerCase(),
        interval: selectedPeriod
      });
    }
  }, [isWsConnected, paramSymbol, selectedPeriod, unSubBinanceKlineData, subBinanceKlineData, historicalDataLoaded]);

  // Handle period change
  const handlePeriodChange = useCallback(async (period: string) => {
    setHistoricalDataLoaded(false); // Reset historical data loaded flag
    
    try {
      // Call API to get K-line data
      const response = await triggerGetKlineData({
        symbol: paramSymbol, 
        interval: period,
        limit: 500 // Increase data points to ensure sufficient data
      });
      
      if (response.data && response.data.length > 0) {
        // Directly use the API return data, keep all data points
        const formattedData = response.data.map((item: any) => {
          // Format time based on different periods
          const timeFormat =  Math.floor(new Date(item.time).getTime() / 1000) as UTCTimestamp
          
          return {
            time: timeFormat,
            value: item.close || item.value // Compatible with different data formats
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
  }, [paramSymbol, triggerGetKlineData]);

  const changeShowCharts = useCallback(() => {
    setIsShowCharts(!issShowCharts)
  }, [issShowCharts, setIsShowCharts])

  // Handle real-time data updates
  useEffect(() => {
    if (!klinesubData || !seriesRef.current || !historicalDataLoaded || !chartRef.current) return;
    
    try {
      // Format the real-time data to match chart format
      const time = Math.floor(new Date(klinesubData.k.t).getTime() / 1000) as UTCTimestamp;
      const latestData: ChartDataItem = {
        time,
        value: Number(klinesubData.k.c)
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
  }, [klinesubData, selectedPeriod, historicalDataLoaded, chartData.length]);

  // Initialize data and markers
  useEffect(() => {
    // Initialize data
    if (!propsData || propsData.length === 0) {
      handlePeriodChange(selectedPeriod);
    } else {
      setChartData(propsData);
      setHistoricalDataLoaded(true); // If props data is provided, consider historical data as loaded
    }
  }, [propsData, selectedPeriod, handlePeriodChange]);

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

    // Handle window size change
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({ 
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight 
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [isMobile, paramSymbol, selectedPeriod, triggerGetKlineData]);

  useEffect(() => {
    if (chartData.length > 0 && seriesRef.current && chartRef.current) {
      seriesRef.current.setData(chartData)
      // 使用一个独立变量来跟踪图表的滚动行为
      let isLoadingMoreData = false;
      // 计算初始数据中最早的时间戳
      let lastLoadedTimestamp = chartData.length > 0 ? 
        Math.min(...chartData.map((item: {time: string | number; value: number}) => 
          typeof item.time === 'string' ? new Date(item.time).getTime() / 1000 : Number(item.time)
        )) : 0;

      // 监听图表滚动事件
      chartRef.current.timeScale().subscribeVisibleTimeRangeChange(() => {
        // 如果正在加载数据或已经到达数据边界，不再继续加载
        if (isLoadingMoreData || reachedDataLimit) return;
        
        // 获取当前可见的时间范围
        const visibleRange = chartRef.current?.timeScale().getVisibleLogicalRange();
        if (!visibleRange) return;
        
        // 只有在接近图表左边缘时才加载更多历史数据
        // 使用固定的阈值判断是否需要加载（接近左边缘10个单位内）
        if (visibleRange.from < 10) {
          // 确保我们不会因向右滑动而重复加载相同的数据
          // 只有当我们之前加载的最早时间戳存在时才继续
          if (!lastLoadedTimestamp) return;
          
          isLoadingMoreData = true;
          
          // 使用最早的时间戳作为下一批数据的结束时间
          const endTime = new Date(lastLoadedTimestamp * 1000);
          
          // 加载更多历史数据
          triggerGetKlineData({
            symbol: paramSymbol,
            interval: selectedPeriod,
            endTime: endTime.getTime(),
            limit: 500
          }).then(response => {
            if (response.data && response.data.length > 0) {
              // 检查是否已到达数据边界
              if (response.data.length < 500) {
                setReachedDataLimit(true);
              }
              
              // 格式化新数据
              const newData = response.data.map((item: { time: number | string; close?: number; value?: number }) => ({
                time: Math.floor(new Date(item.time).getTime() / 1000) as UTCTimestamp,
                value: item.close || item.value
              }));
              
              // 找出新数据中最早的时间戳
              const newEarliestTimestamp = Math.min(...newData.map((item: {time: string | number; value: number}) => Number(item.time)));
              
              // 只有当新数据确实比现有数据更早时才更新
              if (newEarliestTimestamp < lastLoadedTimestamp) {
                lastLoadedTimestamp = newEarliestTimestamp;
                
                // 处理重复数据
                if (seriesRef.current) {
                  // 创建时间戳集合用于去重
                  const existingTimestamps = new Set(chartData.map((item: {time: string | number; value: number}) => 
                    typeof item.time === 'string' ? item.time : String(item.time)
                  ));
                  
                  // 过滤掉重复的数据点
                  const uniqueNewData = newData.filter((item: {time: string | number; value: number}) => 
                    !existingTimestamps.has(typeof item.time === 'string' ? item.time : String(item.time))
                  );
                  
                  if (uniqueNewData.length > 0) {
                    // 合并新旧数据
                    const combinedData = [...uniqueNewData, ...chartData];
                    
                    // 更新图表
                    seriesRef.current.setData(combinedData);
                    setChartData(combinedData);
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
      });
    }
  }, [chartData, paramSymbol, selectedPeriod, reachedDataLimit, triggerGetKlineData]);

  // 重置数据边界状态当周期改变时
  useEffect(() => {
    setReachedDataLimit(false);
  }, [selectedPeriod]);

  return (
    <ChartWrapper>
      <ChartHeader
        symbol={symbol}
        issShowCharts={issShowCharts}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        changeShowCharts={changeShowCharts}
      />
      <MobileWrapper $issShowCharts={issShowCharts}>
        {isMobile && <PeridSelector
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
        />}
        <ChartContainer ref={chartContainerRef}>
          {/* Marker component - Only render when all references are valid */}
          {chartRef.current !== null && 
          seriesRef.current !== null && 
          chartContainerRef.current !== null && 
          chartData.length > 0 && (
            <Markers
              chartRef={chartRef as React.RefObject<IChartApi>}
              seriesRef={seriesRef as React.RefObject<ISeriesApi<'Area'>>}
              chartContainerRef={chartContainerRef as React.RefObject<HTMLDivElement>}
              markers={markers}
              chartData={chartData as any}
            />
          )}
        </ChartContainer>
      </MobileWrapper>
    </ChartWrapper>
  );
};

export default CryptoChart;
