import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import styled, { css } from 'styled-components';
import { useTheme } from 'store/themecache/hooks';
import Tooltip from '../Tooltip';
import { InsightsDataType } from 'store/insights/insights';
import { useInsightsList, useCurrentShowId, useMarkerScrollPoint } from 'store/insights/hooks';

// 标记点接口
export interface MarkerPoint {
  time: string | UTCTimestamp;
  originalList: InsightsDataType[]; // 添加原始时间戳数组
}

// 单个标记点组件的属性接口
interface SingleMarkerProps {
  chartRef: React.RefObject<IChartApi>;
  seriesRef: React.RefObject<ISeriesApi<'Area'>>;
  chartContainerRef: React.RefObject<HTMLDivElement>;
  markerData: MarkerPoint;
  chartData: Array<{ time: string | UTCTimestamp; value: number }>;
}

// 标记点容器组件的属性接口
interface MarkersProps {
  chartRef: React.RefObject<IChartApi>;
  seriesRef: React.RefObject<ISeriesApi<'Area'>>;
  chartContainerRef: React.RefObject<HTMLDivElement>;
  chartData: Array<{ time: string | UTCTimestamp; value: number }>;
  selectedPeriod?: string; // 添加选择的周期
}

// 单个标记点组件
const SingleMarker: React.FC<SingleMarkerProps> = ({
  chartRef,
  seriesRef,
  chartContainerRef,
  markerData,
  chartData,
}) => {
  const theme = useTheme()
  const [isLong, setIsLong] = useState(false)
  const [currentShowId, setCurrentShowId] = useCurrentShowId()
  const [markerState, setMarkerState] = useState<{
    left: number;
    top: number;
    visible: boolean;
    value: number;
  }>({ left: 0, top: 0, visible: false, value: 0 });
  
  // 记录是否悬停在标记点上
  const [isHovered, setIsHovered] = useState(false);
  // 记录是否有匹配的currentShowId
  const [isMatched, setIsMatched] = useState(false);
  
  // 根据originalList中的alertOptions.movementType来设置isLong
  useEffect(() => {
    if (markerData.originalList && markerData.originalList.length > 0) {
      let targetData = markerData.originalList[0]; // 默认使用第0项
      
      // 如果有currentShowId，尝试找到匹配的数据项
      if (currentShowId) {
        const matchedData = markerData.originalList.find(data => 
          data.id.toString() === currentShowId
        );
        
        // 如果找到了匹配项，使用该匹配项
        if (matchedData) {
          targetData = matchedData;
        }
      }
      
      // 根据找到的数据项判断isLong
      setIsLong(targetData.alertOptions?.movementType === 'PUMP');
    } else {
      setIsLong(false);
    }
  }, [markerData.originalList, currentShowId]);
  
  // 根据currentShowId和originalTimestamps确定是否应该显示Tooltip
  useEffect(() => {
    if (!currentShowId || markerData.originalList.length === 0) {
      setIsMatched(false);
      return;
    }
    
    // 检查currentShowId是否匹配marker的originalTimestamps中的任何一个值
    const matchFound = markerData.originalList.some(data => 
      currentShowId === data.id.toString()
    );
    
    // 更新匹配状态
    setIsMatched(matchFound);
    
    // 隐藏或显示crosshairMarker
    if (seriesRef.current) {
      seriesRef.current.applyOptions({
        crosshairMarkerVisible: !(matchFound || isHovered)
      });
    }
  }, [currentShowId, markerData.originalList, seriesRef, isHovered]);

  // 处理鼠标悬停事件
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    // 当鼠标悬停在标记点上时，隐藏crosshairMarker
    if (seriesRef.current) {
      seriesRef.current.applyOptions({
        crosshairMarkerVisible: false
      });
    }
  }, [seriesRef]);

  // 处理鼠标离开事件
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    // 当鼠标离开标记点时，恢复显示crosshairMarker，但如果有匹配则保持隐藏
    if (seriesRef.current) {
      seriesRef.current.applyOptions({
        crosshairMarkerVisible: !isMatched
      });
    }
  }, [seriesRef, isMatched]);

  // 处理点击事件，设置currentShowId并滚动到对应的InsightItem
  const handleClick = useCallback(() => {
    if (markerData.originalList.length === 0) return;
    
    // 获取第一个关联的时间戳作为ID
    const insightData = markerData.originalList[0];
    
    // 设置当前选中的ID
    setCurrentShowId(insightData.id.toString());
    
    // 延迟一下执行滚动，确保DOM更新后再滚动
    setTimeout(() => {
      // 查找InsightsList容器
      const insightsListEl = document.getElementById('insightsListWrapperEl');
      if (!insightsListEl) return;
      
      // 查找激活的InsightItem
      const activeItem = insightsListEl.querySelector(`[data-timestamp="${insightData.createdAt}"]`);
      if (activeItem) {
        // 滚动到对应元素
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // 如果找不到特定元素，则滚动到顶部
        insightsListEl.scrollTop = 0;
      }
    }, 300);
  }, [markerData.originalList, setCurrentShowId]);

  // 查找时间点对应的数据值
  const findValueForTime = useCallback((time: string | UTCTimestamp): number | null => {
    // 标准化时间格式以便比较
    let searchTimeSeconds: number;
    
    if (typeof time === 'number') {
      // 如果是UTCTimestamp（秒级时间戳），直接使用
      searchTimeSeconds = time;
    } else {
      // 如果是字符串格式，转换为秒级时间戳
      searchTimeSeconds = Math.floor(new Date(time).getTime() / 1000);
    }
    
    // 在图表数据中查找匹配的时间点
    const dataPoint = chartData.find(item => {
      let itemTimeSeconds: number;
      
      if (typeof item.time === 'number') {
        itemTimeSeconds = item.time;
      } else {
        itemTimeSeconds = Math.floor(new Date(item.time).getTime() / 1000);
      }
      
      return itemTimeSeconds === searchTimeSeconds;
    });
    
    return dataPoint ? dataPoint.value : null;
  }, [chartData]);

  // 更新标记点的位置
  const updateMarkerPosition = useCallback(() => {
    const chart = chartRef.current;
    const series = seriesRef.current;
    const container = chartContainerRef.current;
    
    if (!chart || !series || !container) return;

    // 获取标记对应的数据值（使用提供的值或从图表数据中查找）
    const value = findValueForTime(markerData.time) ?? 0;
    if (value === 0) {
      setMarkerState({ left: 0, top: 0, visible: false, value: 0 });
      return;
    }

    // 转换为坐标
    const coordinate = series.priceToCoordinate(value);
    const timeScale = chart.timeScale();
    
    // 确保时间格式正确
    const formattedTime = markerData.time;
    
    // 直接使用原始时间戳，不进行格式转换，保留完整时间信息
    // 这样可以确保marker精确定位到对应的K线位置
    const timeCoordinate = timeScale.timeToCoordinate(formattedTime);

    // 如果坐标无效，隐藏标记
    if (coordinate === null || timeCoordinate === null) {
      setMarkerState({ left: 0, top: 0, visible: false, value });
      return;
    }

    // 计算标记在图表容器内的相对位置
    const markerSize = 8;
    const offset = markerSize / 2;
    const left = timeCoordinate - offset;
    const top = coordinate - offset;

    // 检查标记是否在图表可视区域内
    const chartRect = container.getBoundingClientRect();
    
    // 动态获取价格坐标轴的宽度
    let priceScaleWidth = 0;
    
    try {
      // 获取右侧价格坐标轴
      const rightPriceScale = chart.priceScale('right');
      if (rightPriceScale) {
        // 获取价格坐标轴的宽度
        priceScaleWidth = rightPriceScale.width() || 0;
      }
      
      // 如果获取失败，使用默认值（以防API不支持或返回意外值）
      if (priceScaleWidth <= 0) {
        priceScaleWidth = 60; // 默认值
      }
    } catch (error) {
      // 出错时使用默认值
      priceScaleWidth = 60;
      console.warn("获取价格坐标轴宽度失败，使用默认值", error);
    }
    
    // 计算可用绘图区域的宽度（排除价格坐标轴）
    const availableWidth = chartRect.width - priceScaleWidth;
    
    // 检查是否在可视区域内，且不在价格坐标轴区域
    const isVisible =
      left >= 0 &&
      left <= availableWidth && // 使用调整后的宽度而不是整个宽度
      top >= 0 &&
      top <= chartRect.height;

    setMarkerState({
      left,
      top,
      visible: isVisible,
      value,
    });
  }, [chartRef, seriesRef, chartContainerRef, markerData, findValueForTime]);

  // 当markerData或chartData变化时重新计算
  useEffect(() => {
    // 初始更新位置
    const timer = setTimeout(updateMarkerPosition, 100);
    return () => clearTimeout(timer);
  }, [markerData, chartData, updateMarkerPosition]);

  // 订阅图表事件以更新标记位置
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    // 设置事件监听
    const handleTimeScaleChange = () => updateMarkerPosition();
    const handleCrosshairMove = () => updateMarkerPosition();
    const handleResize = () => updateMarkerPosition();

    // 订阅图表事件
    const timeScale = chart.timeScale();
    timeScale.subscribeVisibleTimeRangeChange(handleTimeScaleChange);
    chart.subscribeCrosshairMove(handleCrosshairMove);
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (chart) {
        const timeScale = chart.timeScale();
        timeScale.unsubscribeVisibleTimeRangeChange(handleTimeScaleChange);
        chart.unsubscribeCrosshairMove(handleCrosshairMove);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [chartRef, updateMarkerPosition]);

  // 计算样式
  const getMarkerStyle = useCallback(() => {
    const baseStyle = {
      left: `${markerState.left}px`,
      top: `${markerState.top}px`,
      width: `8px`,
      height: `8px`,
      backgroundColor: isLong ? theme.jade10 : theme.ruby50,
      boxShadow: `0px 0px 8px #2FF582`,
      transition: 'transform 0.2s ease',
    };

    // 悬停时增加一点放大效果
    if (isHovered) {
      return {
        ...baseStyle,
        // transform: 'scale(1.2)',
        zIndex: 1001, // 确保悬停时在最上层
      };
    }

    return baseStyle;
  }, [markerState, isHovered, theme, isLong]);

  // 如果标记不可见，不渲染任何内容
  if (!markerState.visible) return null;

  return (
    <>
      <MarkerDot
        style={getMarkerStyle()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {(isHovered || isMatched) && <Tooltip 
          isLong={isLong}
          markerData={markerData}
        />}
      </MarkerDot>
    </>
  );
};

// 标记点容器组件
const Markers: React.FC<MarkersProps> = ({ 
  chartRef, 
  seriesRef, 
  chartContainerRef, 
  chartData,
  selectedPeriod = '1d' // 默认为1天
}) => {
  // 获取insights数据
  const [insightsList] = useInsightsList();
  // 将insights数据转换为markers
  const markers = useMemo(() => {
    if (chartData.length === 0 || insightsList.length === 0) return [];

    try {
      // 创建时间戳映射表，用于记录哪些原始时间戳映射到同一个图表时间点
      const timeMapping: {[key: string]: InsightsDataType[]} = {};
      
      // 为每个insight找到最接近的chart时间点
      const newMarkers: MarkerPoint[] = [];
      
      // 根据周期计算对应的秒数
      const getPeriodSeconds = (period: string): number => {
        switch (period) {
          case '15m': return 15 * 60;         // 15分钟
          case '1h': return 60 * 60;          // 1小时
          case '4h': return 4 * 60 * 60;      // 4小时
          case '1d': return 24 * 60 * 60;     // 1天
          case '1w': return 7 * 24 * 60 * 60; // 1周
          case '1M': return 30 * 24 * 60 * 60; // 约1个月（30天）
          default: return 24 * 60 * 60;       // 默认1天
        }
      };
      
      const periodSeconds = getPeriodSeconds(selectedPeriod);
      
      // 遍历所有insights
      for (const insight of insightsList) {
        const insightTimestamp = Math.floor(insight.createdAt / 1000); // 这是秒级时间戳
        
        // 找出图表数据中与insight时间戳最接近的时间点，考虑K线周期
        let closestDataPoint = null;
        let minDiff = Infinity;
        
        // 计算insight时间戳应该落入的K线周期的起始时间
        const insightPeriodStart = Math.floor(insightTimestamp / periodSeconds) * periodSeconds;
        
        // 首先尝试找到精确匹配的K线周期
        for (const dataPoint of chartData) {
          // 统一转换为秒级时间戳以便比较
          const chartTime = Number(dataPoint.time)
          // 计算该数据点所在的周期起始时间
          const chartPeriodStart = Math.floor(chartTime / periodSeconds) * periodSeconds;
          
          // 检查是否在同一个周期内
          if (chartPeriodStart === insightPeriodStart) {
            closestDataPoint = dataPoint;
            break; // 找到了精确匹配，不需要继续查找
          }
          
          // 如果没有找到精确匹配，记录时间差最小的点
          const diff = Math.abs(chartTime - insightTimestamp);
          if (diff < minDiff) {
            minDiff = diff;
            closestDataPoint = dataPoint;
          }
        }
        
        // 如果找到了最接近的时间点
        if (closestDataPoint) {
          // 将这个时间点记录到映射表中
          const chartTime = typeof closestDataPoint.time === 'string'
            ? Math.floor(new Date(closestDataPoint.time).getTime() / 1000)
            : Number(closestDataPoint.time);
          
          const timeKey = String(chartTime);
          
          if (!timeMapping[timeKey]) {
            timeMapping[timeKey] = [];
          }
          
          // 添加原始时间戳到映射表
          if (!timeMapping[timeKey].some(data => data.id.toString() === insight.id.toString())) {
            timeMapping[timeKey].push(insight);
          }
        }
      }
      
      // 根据映射表创建markers
      for (const [timeKey, originalList] of Object.entries(timeMapping)) {
        // 找到对应的chart数据点
        const chartTime = parseInt(timeKey, 10);
        
        const matchedDataPoint = chartData.find(dataPoint => {
          const time = typeof dataPoint.time === 'string' 
            ? Math.floor(new Date(dataPoint.time).getTime() / 1000)
            : Number(dataPoint.time);
          return time === chartTime;
        });
        
        if (matchedDataPoint) {
          // 创建marker
          newMarkers.push({
            time: matchedDataPoint.time,
            originalList
          });
        }
      }
      
      return newMarkers;
    } catch (error) {
      console.error('Error creating markers:', error);
      return [];
    }
  }, [chartData, insightsList, selectedPeriod]);
  return (
    <>
      {markers.map((marker, index) => (
        <SingleMarker
          key={`marker-${marker.time}-${index}`}
          chartRef={chartRef}
          seriesRef={seriesRef}
          chartContainerRef={chartContainerRef}
          markerData={marker}
          chartData={chartData}
        />
      ))}
    </>
  );
};

// 样式化的标记点组件
const MarkerDot = styled.div`
  position: absolute;
  border-radius: 50%;
  pointer-events: auto;
  z-index: 9;
  cursor: pointer;
`;

export default Markers;
