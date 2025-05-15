import { Trans } from '@lingui/react/macro';
import { IconToolShape } from 'components/Icons';
import styled, { css } from 'styled-components'
import { useMemo } from 'react';
import { useInsightsList, useCurrentShowId, getIsInsightLong, getInsightSide } from 'store/insights/hooks';
import { MarkerPoint } from '../Marker';
import { ALERT_TYPE, InsightsDataType, InstitutionalTradeOptions, MOVEMENT_TYPE, PriceAlertOptions, PriceChange24hOptions, SIDE } from 'store/insights/insights.d';
import { div } from 'utils/calc';
import { formatKMBNumber, formatPercent } from 'utils/format';
import { vm } from 'pages/helper';

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
    display: flex;
    align-items: center;
    gap: 2px;
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

const TitleWrapper = styled.div<{ $isLong: boolean }>`
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  font-weight: 500;
  line-height: 16px;
  .change {
    color: ${({ theme, $isLong }) => $isLong ? theme.jade10 : theme.ruby50};
  }
  ${({ theme }) => theme.isMobile && css`
    font-size: .11rem;
    font-weight: 500;
    line-height: .16rem;
    gap: ${vm(2)};
  `}
`

function getInsightTitle(data: InsightsDataType) {
  const { alertType, alertOptions, alertQuery } = data;
  const { priceChange } = alertOptions as PriceAlertOptions;
  const { value } = alertOptions as InstitutionalTradeOptions;
  const { priceChange24h } = alertOptions as PriceChange24hOptions;
  const isLong = getIsInsightLong(data)
  const change = formatPercent({ value: div(priceChange, 100), mark: priceChange > 0 ? '+' : '' })
  const change24h = formatPercent({ value: div(priceChange24h, 100), mark: priceChange24h > 0 ? '+' : '' })
  const formatValue = formatKMBNumber(value)
  const sideText = isLong ? <Trans>Buy</Trans> : <Trans>Sell</Trans>
  if (alertType === ALERT_TYPE.PRICE_ALERT) {
    return <TitleWrapper $isLong={isLong}>
      <span className="change">{change}</span>
    </TitleWrapper>
  } else if (alertType === ALERT_TYPE.PRICE_CHANGE_24H) {
    return <TitleWrapper $isLong={isLong}>
      <span className="change">{change24h}</span>
    </TitleWrapper>
  } else if (alertType === ALERT_TYPE.INSTITUTIONAL_TRADE) {
    return <TitleWrapper $isLong={isLong}>
      <Trans><span className="change">{formatValue}</span> <span>{sideText}</span></Trans>
    </TitleWrapper>
  } 
  return alertQuery
}

export default function Tooltip({
  markerData,
}: {
  markerData: MarkerPoint
}) {
  const [currentShowId] = useCurrentShowId();
  const [insightsList] = useInsightsList();
  
  // 查找并显示相应的insight类型
  const [insightTypeText, isLong, insightTitle] = useMemo(() => {
    if (markerData.originalList.length === 0 || insightsList.length === 0) {
      return ['', false, ''];
    }
    let finalData: InsightsDataType | undefined = markerData.originalList[0];
    // 优先查找与currentShowId匹配的时间戳
    if (currentShowId) {
      const matchedData = markerData.originalList.find(
        data => data.id.toString() === currentShowId
      );
      
      if (matchedData) {
        finalData = matchedData
      }
    }
    
    // 如果没有匹配到currentShowId，使用第一个数据
    if (!finalData) {
      return ['', false, ''];
    }
    return [
      getInsightSide(finalData),
      getIsInsightLong(finalData),
      getInsightTitle(finalData)
    ];
  }, [markerData, currentShowId, insightsList]);
  
  return <TooltipWrapper $isLong={isLong} $isTop={isLong}>
    <span className="tooltip-shape">
      <span className="tooltip-shape-dot"></span>
      <IconToolShape />
      <IconToolShape />
    </span>
      <span className="tooltip-text">
        {insightTypeText}: {insightTitle}
      </span>
  </TooltipWrapper>
}
