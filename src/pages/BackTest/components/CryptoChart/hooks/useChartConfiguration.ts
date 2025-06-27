import { useEffect, useMemo } from 'react';
import { createChart, CandlestickSeries, LineStyle, UTCTimestamp } from 'lightweight-charts';
import { formatNumber } from 'utils/format';
import { toFix, toPrecision } from 'utils/calc';
import { ChartDataItem, KlineSubInnerDataType } from 'store/insights/insights';

interface UseChartConfigurationProps {
  chartContainerRef: React.RefObject<HTMLDivElement | null>;
  chartRef: React.RefObject<any>;
  seriesRef: React.RefObject<any>;
  isMobile: boolean;
  paramSymbol: string;
  selectedPeriod: string;
  theme: any;
  handleResize: () => void;
  customTimeFormatter: (time: UTCTimestamp) => string;
  timezone?: string;
  klinesubData: KlineSubInnerDataType | null;
  historicalDataLoaded: boolean;
  chartData: ChartDataItem[];
  isBinanceSupport: boolean;
}

export const useChartConfiguration = ({
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
}: UseChartConfigurationProps) => {
  
  // 实时数据更新效果
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
  }, [klinesubData, selectedPeriod, historicalDataLoaded, chartData.length, isBinanceSupport, seriesRef, chartRef, chartData]);

  // 图表配置和初始化
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
    
    // 初始化时先适配所有内容，数据加载完成后再调整可视区域
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
  }, [isMobile, paramSymbol, selectedPeriod, theme.jade40, theme.ruby40, handleResize, customTimeFormatter, timezone, chartContainerRef, chartRef, seriesRef]);
};