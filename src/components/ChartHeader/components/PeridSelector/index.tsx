import { IconBase } from 'components/Icons';
import { vm } from 'pages/helper';
import { useCallback, useEffect, useMemo } from 'react';
import { BacktestData } from 'store/backtest/backtest';
import { useGetConvertPeriod } from 'store/insightscache/hooks';
import { PERIOD_OPTIONS } from 'store/insightscache/insightscache';
import { useCurrentFullScreenBacktestData, useIsOpenFullScreen } from 'store/tradeai/hooks';
import styled, { css } from 'styled-components'


const PeriodSelector = styled.div<{ $forceWebStyle?: boolean }>`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  flex-grow: 1;
  gap: 4px;
  height: 100%;
  ${({ theme, $forceWebStyle }) => theme.isMobile && css`
    justify-content: flex-start;
    gap: ${vm(4, $forceWebStyle)};
    height: ${vm(28, $forceWebStyle)};
  `}
`;

const PeriodWrapper = styled.div<{ $forceWebStyle?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  flex-grow: 1;
  height: 44px;
  ${({ theme, $forceWebStyle }) => theme.isMobile && css`
    justify-content: flex-start;
    gap: ${vm(4, $forceWebStyle)};
    height: 100%;
  `}
`;


const PeriodButton = styled.button<{ $isActive: boolean, $forceWebStyle?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $isActive, theme }) => $isActive ? theme.brand6 : 'transparent'};
  color: ${({ $isActive, theme }) => $isActive ? theme.textL1 : theme.textL4};
  flex-grow: 1;
  max-width: 48px;
  height: 28px;
  border: none;
  border-radius: 36px;
  transition: all 0.2s ease;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
  ${({ theme, $forceWebStyle }) => theme.isMobile
  ?($forceWebStyle ? css`
    padding: 0 16px;
    height: 28px;
    font-size: 12px;
    line-height: 18px;
    border-radius: 36px;
  ` : css`
    padding: 0 ${vm(16)};
    height: ${vm(28)};
    font-size: 0.12rem;
    line-height: 0.18rem;
    border-radius: ${vm(36)};
  `)
  :css`
    cursor: pointer;
  `}
`;

const FullScreenWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  border-radius: 50%;
  cursor: pointer;
  .icon-fullscreen,
  .icon-exit-fullscreen {
    font-size: 24px;
    color: ${({ theme }) => theme.textL2};
  }
`;

export default function PeridSelector({
  isBinanceSupport,
  selectedPeriod,
  setSelectedPeriod,
  forceWebStyle,
  showFullScreen,
  backtestData,
}: {
  isBinanceSupport: boolean
  selectedPeriod: PERIOD_OPTIONS
  forceWebStyle?: boolean
  setSelectedPeriod: (period: PERIOD_OPTIONS) => void
  showFullScreen?: boolean
  backtestData?: BacktestData
}) {
  const getConvertPeriod = useGetConvertPeriod()
  const [isOpenFullScreen, setIsOpenFullScreen] = useIsOpenFullScreen()
  const [, setCurrentFullScreenBacktestData] = useCurrentFullScreenBacktestData()
  const PERIOD_OPTIONS = useMemo(() => {
    if (!isBinanceSupport) {
      return [
        { label: '1h', value: '1h' },
        { label: '1D', value: '1d' },
      ]
    }
    return [
      { label: '15m', value: '15m' },
      { label: '1h', value: '1h' },
      { label: '4h', value: '4h' },
      { label: '1D', value: '1d' },
      { label: '1W', value: '1w' },
      { label: '1M', value: '1M' },
      // { label: '3M', value: '3M' },
    ]
  }, [isBinanceSupport])
  const fullScreenClickHandler = useCallback(() => {
    if (isOpenFullScreen) {
      setCurrentFullScreenBacktestData(null)
    } else {
      setCurrentFullScreenBacktestData(backtestData || null)
    }
    setIsOpenFullScreen(!isOpenFullScreen)
  }, [isOpenFullScreen, backtestData, setIsOpenFullScreen, setCurrentFullScreenBacktestData])
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpenFullScreen) {
        setIsOpenFullScreen(false)
        setCurrentFullScreenBacktestData(null)
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => {
      document.removeEventListener('keydown', handleEscKey) 
    }
  }, [isOpenFullScreen, setIsOpenFullScreen, setCurrentFullScreenBacktestData])
  return <PeriodSelector $forceWebStyle={forceWebStyle}>
    <PeriodWrapper $forceWebStyle={forceWebStyle}>
      {PERIOD_OPTIONS.map((option) => {
        const convertPeriod = getConvertPeriod(selectedPeriod, isBinanceSupport)
        const isActive = convertPeriod === option.value
        return <PeriodButton
          key={option.value}
          $isActive={isActive}
          $forceWebStyle={forceWebStyle}
          onClick={() => setSelectedPeriod(option.value as PERIOD_OPTIONS)}
        >
          {option.label}
        </PeriodButton>
      })}
    </PeriodWrapper>
    {showFullScreen && <FullScreenWrapper onClick={fullScreenClickHandler}>
      <IconBase className={isOpenFullScreen ? 'icon-exit-fullscreen' : 'icon-fullscreen'} />
    </FullScreenWrapper>}
  </PeriodSelector>
}
