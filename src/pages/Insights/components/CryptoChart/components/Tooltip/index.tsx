import { Trans } from '@lingui/react/macro';
import { IconToolShape } from 'components/Icons';
import styled, { css } from 'styled-components'
import { useMemo } from 'react';
import { useInsightsList, useCurrentShowId } from 'store/insights/hooks';
import { MarkerPoint } from '../Marker';
import { ALERT_TYPE, ContractAnomalyOptions, DerivativesAlertOptions, InsightsDataType, InstitutionalTradeOptions, MOVEMENT_TYPE, NewsAlertOptions, PriceAlertOptions, PriceChange24hOptions, SIDE } from 'store/insights/insights.d';
import { div } from 'utils/calc';
import { formatKMBNumber, formatPercent } from 'utils/format';
import { vm } from 'pages/helper';
import Markdown from 'components/Markdown';
import { getInsightSide, getIsInsightLong } from 'store/insights/util';

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
    background-color: ${({ theme }) => theme.text20};
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
    background-color: ${({ theme }) => theme.text20};
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

const TitleWrapper = styled.div<{ $isInsightTitle: boolean, $isLong: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
  color: ${({ theme }) => theme.textL3};
  .symbol {
    color: ${({ theme }) => theme.textL1};
  }
  .change {
    color: ${({ theme, $isLong }) => $isLong ? theme.jade10 : theme.ruby50};
  }
  ${({ $isInsightTitle }) => !$isInsightTitle && css`
    font-size: 11px;
    font-weight: 500;
    line-height: 16px;
    color: ${({ theme }) => theme.textL1};
  `}
  ${({ theme, $isInsightTitle }) => theme.isMobile && css`
    font-size: .18rem;
    font-weight: 500;
    line-height: .26rem;
    gap: ${vm(4)};
    ${!$isInsightTitle && css`
      font-size: .11rem;
      font-weight: 500;
      line-height: .16rem;
    `}
  `}
`

export function getInsightTitle(data: InsightsDataType, isInsightTitle: boolean) {
  const { alertType, alertOptions, alertQuery, marketId } = data;
  const { priceChange } = alertOptions as PriceAlertOptions;
  const { value } = alertOptions as InstitutionalTradeOptions;
  const { priceChange24h } = alertOptions as PriceChange24hOptions;
  const { fundingRate } = alertOptions as DerivativesAlertOptions;
  const { postContent } = alertOptions as NewsAlertOptions;
  const symbol = marketId.toUpperCase()
  const isLong = getIsInsightLong(data)
  const change = formatPercent({ value: div(priceChange, 100), mark: priceChange > 0 ? '+' : '' })
  const change24h = formatPercent({ value: div(priceChange24h, 100), mark: priceChange24h > 0 ? '+' : '' })
  const formatValue = formatKMBNumber(value)
  const sideText = isLong ? <Trans>Buy</Trans> : <Trans>Sell</Trans>
  if (alertType === ALERT_TYPE.PRICE_ALERT) {
    return <TitleWrapper $isInsightTitle={isInsightTitle} $isLong={isLong}>
      {
        isInsightTitle
          ? <Trans><span className="symbol">{symbol}</span> <span className="change">{change}</span> within 15m</Trans>
          : <span className="change">{change}</span>
      }
    </TitleWrapper>
  } else if (alertType === ALERT_TYPE.PRICE_CHANGE_24H) {
    return <TitleWrapper $isInsightTitle={isInsightTitle} $isLong={isLong}>
      {
        isInsightTitle
          ? <Trans><span className="symbol">{symbol}</span> <span className="change">{change24h}</span> within 24H</Trans>
          : <span className="change">{change24h}</span>
      }
    </TitleWrapper>
  } else if (alertType === ALERT_TYPE.INSTITUTIONAL_TRADE) {
    return <TitleWrapper $isInsightTitle={isInsightTitle} $isLong={isLong}>
      {
        isInsightTitle
          ? <Trans><span className="symbol">{symbol}</span> <span className="change">{formatValue}</span> <span>{sideText}</span></Trans>
          : <Trans><span className="change">{formatValue}</span> <span>{sideText}</span></Trans>
      }
    </TitleWrapper>
  } else if (alertType === ALERT_TYPE.DERIVATIVES_ALERT) {
    return <TitleWrapper $isInsightTitle={isInsightTitle} $isLong={isLong}>
      {
        isInsightTitle
          ? <Trans><span className="symbol">{symbol}</span> funding rate is <span className="change">{fundingRate}%</span></Trans>
          : <Trans><span className="change">{fundingRate}%</span></Trans>
      }
    </TitleWrapper>
  } else if (alertType === ALERT_TYPE.NEWS_ALERT) {
    return <TitleWrapper $isInsightTitle={isInsightTitle} $isLong={isLong}>
      {
        isInsightTitle
          ? <Trans>{postContent}</Trans>
          : <Trans>{postContent}</Trans>
      }
    </TitleWrapper>
  }
  return <Markdown>{alertQuery}</Markdown>
}

export default function Tooltip({
  markerData,
}: {
  markerData: MarkerPoint
}) {
  const [currentShowId] = useCurrentShowId();
  const [insightsList] = useInsightsList();
  
  // 查找并显示相应的insight类型
  const [isLong, insightTitle] = useMemo(() => {
    if (markerData.originalList.length === 0 || insightsList.length === 0) {
      return [false, ''];
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
      return [false, ''];
    }
    return [
      getIsInsightLong(finalData),
      <>{getInsightSide(finalData)}: {getInsightTitle(finalData, false)}</>
    ];
  }, [markerData, currentShowId, insightsList]);
  
  return <TooltipWrapper $isLong={isLong} $isTop={isLong}>
    <span className="tooltip-shape">
      <span className="tooltip-shape-dot"></span>
      <IconToolShape />
      <IconToolShape />
    </span>
      <span className="tooltip-text">
        {insightTitle}
      </span>
  </TooltipWrapper>
}
