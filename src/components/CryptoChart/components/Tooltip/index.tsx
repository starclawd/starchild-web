import { Trans } from '@lingui/react/macro';
import { IconToolShape } from 'components/Icons';
import styled, { css } from 'styled-components'
import { useMemo } from 'react';
import { useAllInsightsData, useCurrentShowId } from 'store/insights/hooks';

// 样式化的Tooltip组件
const TooltipWrapper = styled.div<{ $isLong: boolean, $isTop: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: 50%;
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1002;
  white-space: nowrap;
  transform: translateX(-50%);
  .tooltip-text {
    width: auto;
    text-align: center;
    padding: 2px 6px;
    background-color: ${({ theme }) => theme.textL6};
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    line-height: 16px;
    span {
      color: ${({ theme, $isLong }) => $isLong ? theme.jade10 : theme.ruby50};
    }
  }
  .tooltip-shape {
    position: relative;
    display: flex;
    justify-content: center;
    width: 20px;
    height: 14px;
    background-color: ${({ theme }) => theme.textL6};
    .tooltip-shape-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: ${({ $isLong, theme }) => $isLong ? theme.jade10 : theme.ruby50};
    }
    svg {
      position: absolute;
      &:nth-child(2) {
        left: -6.5px;
      }
      &:nth-child(3) {
        right: -6.5px;
      }
    }
  }
  ${({ $isTop }) => $isTop
  ? css`
    flex-direction: column-reverse;
    bottom: -6px;
    .tooltip-shape {
      align-items: flex-start;
      border-radius: 0 0 16px 16px;
      svg {
        &:nth-child(3) {
          transform: rotate(270deg)
        }
      }
    }
  ` : css`
    top: -6px;
    .tooltip-shape {
      align-items: flex-end;
      border-radius: 16px 16px 0 0;
      svg {
        &:nth-child(2) {
          transform: rotate(90deg);
        }
        &:nth-child(3) {
          transform: rotate(180deg);
        }
      }
    }
  `}
`;

export default function Tooltip({
  isLong,
  isTop = true,
  markerData,
}: {
  isLong: boolean
  isTop?: boolean
  markerData?: {
    originalTimestamps?: number[]
  }
}) {
  const [currentShowId] = useCurrentShowId();
  const [insightsList] = useAllInsightsData();
  
  // 查找并显示相应的insight类型
  const insightType = useMemo(() => {
    if (!markerData?.originalTimestamps || markerData.originalTimestamps.length === 0 || insightsList.length === 0) {
      return "Price action";
    }
    
    // 优先查找与currentShowId匹配的时间戳
    if (currentShowId) {
      const matchedTimestamp = markerData.originalTimestamps.find(
        timestamp => timestamp.toString() === currentShowId
      );
      
      if (matchedTimestamp) {
        // 使用匹配的时间戳查找对应的insight
        const matchedInsight = insightsList.find(
          insight => insight.timestamp === matchedTimestamp
        );
        
        if (matchedInsight) {
          return matchedInsight.type || "Price action";
        }
      }
    }
    
    // 如果没有匹配到currentShowId，使用第一个时间戳
    const firstTimestamp = markerData.originalTimestamps[0];
    const firstInsight = insightsList.find(
      insight => insight.timestamp === firstTimestamp
    );
    
    return firstInsight?.type || "Price action";
  }, [markerData, currentShowId, insightsList]);
  
  return <TooltipWrapper $isLong={isLong} $isTop={isTop}>
    <span className="tooltip-shape">
      <span className="tooltip-shape-dot"></span>
      <IconToolShape />
      <IconToolShape />
    </span>
    <span className="tooltip-text">
      {insightType} - <span>{isLong ? <Trans>Pump</Trans> : <Trans>Dump</Trans>}</span>
    </span>
  </TooltipWrapper>
}
