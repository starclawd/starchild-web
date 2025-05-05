import React, { useEffect, useState, useCallback } from 'react';
import { IChartApi, ISeriesApi } from 'lightweight-charts';
import styled, { css } from 'styled-components';
import { useTheme } from 'store/themecache/hooks';
import Tooltip from '../Tooltip';

// 标记点接口
export interface MarkerPoint {
  time: string;
  value?: number; // 如果不提供value，则使用该时间点的价格值
  color?: string;
  size?: number;
  shadowColor?: string;
  shadowBlur?: number;
}

// 单个标记点组件的属性接口
interface SingleMarkerProps {
  chartRef: React.RefObject<IChartApi>;
  seriesRef: React.RefObject<ISeriesApi<'Area'>>;
  chartContainerRef: React.RefObject<HTMLDivElement>;
  markerData: MarkerPoint;
  chartData: Array<{ time: string; value: number }>;
}

// 标记点容器组件的属性接口
interface MarkersProps {
  chartRef: React.RefObject<IChartApi>;
  seriesRef: React.RefObject<ISeriesApi<'Area'>>;
  chartContainerRef: React.RefObject<HTMLDivElement>;
  markers: MarkerPoint[];
  chartData: Array<{ time: string; value: number }>;
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
  const [markerState, setMarkerState] = useState<{
    left: number;
    top: number;
    visible: boolean;
    value: number;
  }>({ left: 0, top: 0, visible: false, value: 0 });
  const isLong = true
  
  // 记录是否悬停在标记点上
  const [isHovered, setIsHovered] = useState(false);

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
    // 当鼠标离开标记点时，恢复显示crosshairMarker
    if (seriesRef.current) {
      seriesRef.current.applyOptions({
        crosshairMarkerVisible: true
      });
    }
  }, [seriesRef]);

  // 查找时间点对应的数据值
  const findValueForTime = useCallback((time: string): number | null => {
    const dataPoint = chartData.find(item => item.time === time);
    return dataPoint ? dataPoint.value : null;
  }, [chartData]);

  // 更新标记点的位置
  const updateMarkerPosition = useCallback(() => {
    const chart = chartRef.current;
    const series = seriesRef.current;
    const container = chartContainerRef.current;
    
    if (!chart || !series || !container) return;

    // 获取标记对应的数据值（使用提供的值或从图表数据中查找）
    const value = markerData.value ?? findValueForTime(markerData.time) ?? 0;
    if (value === 0) {
      setMarkerState({ left: 0, top: 0, visible: false, value: 0 });
      return;
    }

    // 转换为坐标
    const coordinate = series.priceToCoordinate(value);
    const timeScale = chart.timeScale();
    const timeCoordinate = timeScale.timeToCoordinate(markerData.time);

    // 如果坐标无效，隐藏标记
    if (coordinate === null || timeCoordinate === null) {
      setMarkerState({ left: 0, top: 0, visible: false, value });
      return;
    }

    // 计算标记在图表容器内的相对位置
    const markerSize = markerData.size || 8;
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
      width: `${markerData.size || 8}px`,
      height: `${markerData.size || 8}px`,
      backgroundColor: isLong ? theme.jade10 : theme.ruby50,
      boxShadow: `0px 0px ${markerData.shadowBlur || 8}px ${markerData.shadowColor || markerData.color || '#2FF582'}`,
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
  }, [markerState, markerData, isHovered, theme, isLong]);

  // 如果标记不可见，不渲染任何内容
  if (!markerState.visible) return null;

  return (
    <>
      <MarkerDot
        style={getMarkerStyle()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isHovered && <Tooltip isLong={isLong} />}
      </MarkerDot>
    </>
  );
};

// 标记点容器组件
const Markers: React.FC<MarkersProps> = ({ 
  chartRef, 
  seriesRef, 
  chartContainerRef, 
  markers, 
  chartData 
}) => {
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
