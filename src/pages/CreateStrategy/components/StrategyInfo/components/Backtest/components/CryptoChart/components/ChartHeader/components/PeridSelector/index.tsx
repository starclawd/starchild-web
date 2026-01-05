import { IconBase } from 'components/Icons'
import { vm } from 'pages/helper'
import { useCallback, useEffect, useMemo } from 'react'
import { BacktestDataType } from 'store/agentdetail/agentdetail'
import { useGetConvertPeriod } from 'store/insightscache/hooks'
import { PERIOD_OPTIONS } from 'store/insightscache/insightscache'
import { useCurrentFullScreenBacktestData, useIsOpenFullScreen } from 'store/chat/hooks'
import styled, { css } from 'styled-components'
import { StrategyBacktestDataType } from 'store/createstrategy/createstrategy'

const PeriodSelector = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  align-self: flex-end;
  flex-grow: 1;
  gap: 4px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      justify-content: flex-start;
      height: ${vm(28)};
    `}
`

const PeriodWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  flex-grow: 1;
  height: 44px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      justify-content: flex-start;
      gap: ${vm(4)};
      height: 100%;
    `}
`

const PeriodButton = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $isActive, theme }) => ($isActive ? theme.black600 : 'transparent')};
  color: ${({ $isActive, theme }) => ($isActive ? theme.black0 : theme.black300)};
  flex-shrink: 0;
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
  ${({ theme }) =>
    theme.isMobile
      ? css`
          padding: 0 ${vm(16)};
          height: ${vm(28)};
          font-size: 0.12rem;
          line-height: 0.18rem;
          border-radius: ${vm(6)};
        `
      : css`
          cursor: pointer;
        `}
`

export default function PeridSelector({
  isBinanceSupport,
  selectedPeriod,
  setSelectedPeriod,
}: {
  isBinanceSupport: boolean
  selectedPeriod: PERIOD_OPTIONS
  setSelectedPeriod: (period: PERIOD_OPTIONS) => void
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
  return (
    <PeriodSelector>
      <PeriodWrapper>
        {PERIOD_OPTIONS.map((option) => {
          const convertPeriod = getConvertPeriod(selectedPeriod, isBinanceSupport)
          const isActive = convertPeriod === option.value
          return (
            <PeriodButton
              key={option.value}
              $isActive={isActive}
              onClick={() => setSelectedPeriod(option.value as PERIOD_OPTIONS)}
            >
              {option.label}
            </PeriodButton>
          )
        })}
      </PeriodWrapper>
    </PeriodSelector>
  )
}
