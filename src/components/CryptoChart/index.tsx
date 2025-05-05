import { useCallback, useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, TimeScaleOptions, AreaSeries } from 'lightweight-charts';
import styled from 'styled-components';
import Markers, { MarkerPoint } from './components/Marker';

interface CryptoChartProps {
  data?: Array<{ time: string; value: number }>;
  symbol?: string;
}

// 时间周期选项
const PERIOD_OPTIONS = [
  { label: '15m', value: '15m' },
  { label: '1h', value: '1h' },
  { label: '4h', value: '4h' },
  { label: '1D', value: '1d' },
  { label: '1W', value: '1w' },
  { label: '1M', value: '1M' },
  { label: '3M', value: '3M' },
];

// 模拟数据
const generateDummyData = (period: string, count = 100) => {
  const data = [];
  const now = new Date();
  
  // 根据不同时间周期设置时间间隔
  let interval = 0;
  switch (period) {
    case '15m': interval = 15 * 60 * 1000; break;
    case '1h': interval = 60 * 60 * 1000; break;
    case '4h': interval = 4 * 60 * 60 * 1000; break;
    case '1d': interval = 24 * 60 * 60 * 1000; break;
    case '1w': interval = 7 * 24 * 60 * 60 * 1000; break;
    case '1M': interval = 30 * 24 * 60 * 60 * 1000; break;
    case '3M': interval = 90 * 24 * 60 * 60 * 1000; break;
    default: interval = 60 * 60 * 1000;
  }

  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * interval);
    const formattedTime = time.toISOString().split('T')[0];
    
    // 生成一些随机波动数据
    const baseValue = 30000; // 假设是比特币价格
    const volatility = 1000;
    const randomValue = baseValue + (Math.random() - 0.5) * 2 * volatility;
    
    data.push({
      time: formattedTime,
      value: randomValue,
    });
  }
  
  return data;
};

const CryptoChart: React.FC<CryptoChartProps> = ({ data: propsData, symbol = 'BTC/USDT' }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('1d');
  const [chartData, setChartData] = useState<Array<{ time: string; value: number }>>([]);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null);
  
  // 创建示例标记点
  const [markers, setMarkers] = useState<MarkerPoint[]>([]);

  // 处理时间周期切换
  const handlePeriodChange = useCallback((period: string) => {
    setSelectedPeriod(period);
    const newData = generateDummyData(period);
    setChartData(newData);
    
    if (seriesRef.current) {
      seriesRef.current.setData(newData);
    }
  }, []);

  // 初始化数据和标记点
  useEffect(() => {
    // 初始化数据
    if (!propsData || propsData.length === 0) {
      const initialData = generateDummyData(selectedPeriod);
      setChartData(initialData);
      
      // 创建示例标记点 - 选择几个随机数据点
      if (initialData.length > 0) {
        const randomMarkers: MarkerPoint[] = [];
        
        // 添加位于1/3位置的标记点
        const index1 = Math.floor(initialData.length / 3);
        if (index1 < initialData.length) {
          randomMarkers.push({
            time: initialData[index1].time,
          });
        }
        
        // 添加位于2/3位置的标记点
        const index2 = Math.floor(initialData.length * 2 / 3);
        if (index2 < initialData.length && index2 !== index1) {
          randomMarkers.push({
            time: initialData[index2].time,
          });
        }
        
        setMarkers(randomMarkers);
      }
    } else {
      setChartData(propsData);
    }
  }, [propsData, selectedPeriod]);

  useEffect(() => {
    if (!chartContainerRef.current || chartData.length === 0) return;

    // 移除之前的图表实例
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      seriesRef.current = null;
    }

    // 图表配置
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#07080A' },
        textColor: 'rgba(255, 255, 255, 0.54)',
        fontSize: 12,
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.06)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.06)' },
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.06)',
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.06)',
      },
      crosshair: {
        // 修改十字光标的虚线样式
        vertLine: {
          color: 'rgba(255, 255, 255, 0.36)',
          width: 1,
          style: 1, // 虚线样式
        },
        horzLine: {
          color: 'rgba(255, 255, 255, 0.36)',
          width: 1,
          style: 1, // 虚线样式
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    chartRef.current = chart;

    // 创建面积图
    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: '#335FFC',
      lineWidth: 1,
      topColor: 'rgba(51, 95, 252, 0.36)',
      bottomColor: 'rgba(51, 95, 252, 0.00)',
      priceLineVisible: false,
      lastValueVisible: false,
      // 添加曲线样式使折线连接点更平滑
      lineType: 0, // 使用曲线类型 (0: 简单, 1: 阶梯线, 2: 曲线)
      // 添加悬停时的点标记样式
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 3, // 设置半径为6px (总宽高为12px)
      crosshairMarkerBackgroundColor: '#000', // 背景色为#000
      crosshairMarkerBorderColor: '#335FFC', // 边框颜色
      crosshairMarkerBorderWidth: 3, // 边框宽度为3px
    });

    seriesRef.current = areaSeries;

    // 设置数据
    areaSeries.setData(chartData);
    
    // 调整时间轴
    chart.timeScale().fitContent();

    // 处理窗口大小变化
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
  }, [chartData]);

  return (
    <ChartWrapper>
      <ChartHeader>
        <SymbolInfo>{symbol}</SymbolInfo>
        <PeriodSelector>
          {PERIOD_OPTIONS.map((option) => (
            <PeriodButton
              key={option.value}
              $isActive={selectedPeriod === option.value}
              onClick={() => handlePeriodChange(option.value)}
            >
              {option.label}
            </PeriodButton>
          ))}
        </PeriodSelector>
      </ChartHeader>
      <ChartContainer ref={chartContainerRef}>
        {/* 标记点组件 - 只在所有引用都有效时渲染 */}
        {chartRef.current !== null && 
         seriesRef.current !== null && 
         chartContainerRef.current !== null && 
         chartData.length > 0 && (
          <Markers
            chartRef={chartRef as React.RefObject<IChartApi>}
            seriesRef={seriesRef as React.RefObject<ISeriesApi<'Area'>>}
            chartContainerRef={chartContainerRef as React.RefObject<HTMLDivElement>}
            markers={markers}
            chartData={chartData}
          />
        )}
      </ChartContainer>
    </ChartWrapper>
  );
};

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  background-color: ${({ theme }) => theme.bgL0};
  border-radius: 8px;
  overflow: hidden;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const SymbolInfo = styled.div`
  color: ${({ theme }) => theme.textL1};
  font-size: 16px;
  font-weight: 600;
`;

const PeriodSelector = styled.div`
  display: flex;
  gap: 8px;
`;

const PeriodButton = styled.button<{ $isActive: boolean }>`
  background: ${({ $isActive, theme }) => $isActive ? theme.bgT30 : 'transparent'};
  color: ${({ $isActive, theme }) => $isActive ? theme.textL1 : theme.textL3};
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.bgT20};
  }
`;

const ChartContainer = styled.div`
  position: relative;
  flex-shrink: 0;
  height: 218px;
`;

export default CryptoChart;
