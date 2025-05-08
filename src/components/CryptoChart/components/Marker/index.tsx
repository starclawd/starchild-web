import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import styled, { css } from 'styled-components';
import { useTheme } from 'store/themecache/hooks';
import Tooltip from '../Tooltip';
import { InsightsDataType } from 'store/insights/insights';
import { useAllInsightsData, useCurrentShowId, useMarkerScrollPoint } from 'store/insights/hooks';

// 标记点接口
export interface MarkerPoint {
  time: string | UTCTimestamp;
  originalTimestamps?: number[]; // 添加原始时间戳数组
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
  const [currentShowId, setCurrentShowId] = useCurrentShowId()
  const [markerState, setMarkerState] = useState<{
    left: number;
    top: number;
    visible: boolean;
    value: number;
  }>({ left: 0, top: 0, visible: false, value: 0 });
  const isLong = true
  
  // 记录是否悬停在标记点上
  const [isHovered, setIsHovered] = useState(false);
  // 记录是否有匹配的currentShowId
  const [isMatched, setIsMatched] = useState(false);
  
  // 根据currentShowId和originalTimestamps确定是否应该显示Tooltip
  useEffect(() => {
    if (!currentShowId || !markerData.originalTimestamps) {
      setIsMatched(false);
      return;
    }
    
    // 检查currentShowId是否匹配marker的originalTimestamps中的任何一个值
    const matchFound = markerData.originalTimestamps.some(timestamp => 
      currentShowId === timestamp.toString()
    );
    
    // 更新匹配状态
    setIsMatched(matchFound);
    
    // 隐藏或显示crosshairMarker
    if (seriesRef.current) {
      seriesRef.current.applyOptions({
        crosshairMarkerVisible: !(matchFound || isHovered)
      });
    }
  }, [currentShowId, markerData.originalTimestamps, seriesRef, isHovered]);

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
    if (!markerData.originalTimestamps || markerData.originalTimestamps.length === 0) return;
    
    // 获取第一个关联的时间戳作为ID
    const insightId = markerData.originalTimestamps[0].toString();
    
    // 设置当前选中的ID
    setCurrentShowId(insightId);
    
    // 延迟一下执行滚动，确保DOM更新后再滚动
    setTimeout(() => {
      // 查找InsightsList容器
      const insightsListEl = document.getElementById('insightsListWrapperEl');
      if (!insightsListEl) return;
      
      // 查找激活的InsightItem
      const activeItem = insightsListEl.querySelector(`[data-timestamp="${insightId}"]`);
      if (activeItem) {
        // 滚动到对应元素
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // 如果找不到特定元素，则滚动到顶部
        insightsListEl.scrollTop = 0;
      }
    }, 300);
  }, [markerData.originalTimestamps, setCurrentShowId]);

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
    let formattedTime = markerData.time;
    // 如果是UTCTimestamp（数字），则转换成图表接受的格式
    if (typeof formattedTime === 'number') {
      const date = new Date(formattedTime * 1000);
      formattedTime = date.toISOString().split('T')[0]; // 格式: yyyy-mm-dd
    }
    
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
    const isVisible =
      left >= 0 &&
      left <= chartRect.width &&
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
        {(isHovered || isMatched) && <Tooltip isLong={isLong}/>}
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
}) => {
  // 获取insights数据
  const [insightsList] = useAllInsightsData();
  // 将insights数据转换为markers
  const markers = useMemo(() => {
    if (chartData.length === 0 || insightsList.length === 0) return [];

    try {
      // 创建时间戳映射表，用于记录哪些原始时间戳映射到同一个图表时间点
      const timeMapping: {[key: string]: number[]} = {};
      
      // 为每个insight找到最接近的chart时间点
      const newMarkers: MarkerPoint[] = [];
      
      // 遍历所有insights
      for (const insight of insightsList) {
        const insightTimestamp = insight.timestamp; // 这是秒级时间戳
        
        // 找出图表数据中与insight时间戳最接近的时间点
        let closestTime: number | null = null;
        let minDiff = Infinity;
        let closestChartData = null;
        
        // 遍历图表数据寻找最接近的时间点
        for (const dataPoint of chartData) {
          // 统一转换为秒级时间戳以便比较
          const chartTime = typeof dataPoint.time === 'string' 
            ? Math.floor(new Date(dataPoint.time).getTime() / 1000)
            : Number(dataPoint.time);
          
          const diff = Math.abs(chartTime - insightTimestamp);
          
          if (diff < minDiff) {
            minDiff = diff;
            closestTime = chartTime;
            closestChartData = dataPoint;
          }
        }
        
        // 如果找到了最接近的时间点
        if (closestTime !== null && closestChartData) {
          // 将这个时间点记录到映射表中
          const timeKey = String(closestTime);
          
          if (!timeMapping[timeKey]) {
            timeMapping[timeKey] = [];
          }
          
          // 添加原始时间戳到映射表
          if (!timeMapping[timeKey].includes(insightTimestamp)) {
            timeMapping[timeKey].push(insightTimestamp);
          }
        }
      }
      
      // 根据映射表创建markers
      for (const [timeKey, originalTimestamps] of Object.entries(timeMapping)) {
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
            time: typeof matchedDataPoint.time === 'number' 
              ? matchedDataPoint.time // 如果已经是UTCTimestamp类型，直接使用
              : Math.floor(new Date(matchedDataPoint.time).getTime() / 1000) as UTCTimestamp, // 否则转换为UTCTimestamp
            originalTimestamps
          });
        }
      }
      
      return newMarkers;
    } catch (error) {
      console.error('Error creating markers:', error);
      return [];
    }
  }, [chartData, insightsList]);
  console.log('markers', markers)
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
  z-index: 1000;
  cursor: pointer;
`;

export default Markers;
