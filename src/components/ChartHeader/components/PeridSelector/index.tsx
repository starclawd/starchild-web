import { vm } from 'pages/helper';
import { useMemo } from 'react';
import { useGetConvertPeriod } from 'store/insightscache/hooks';
import { PERIOD_OPTIONS } from 'store/insightscache/insightscache';
import styled, { css } from 'styled-components'


const PeriodSelector = styled.div<{ $isMobileBackTestPage?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 4px;
  height: 100%;
  ${({ theme, $isMobileBackTestPage }) => theme.isMobile && css`
    gap: ${vm(4, $isMobileBackTestPage)};
    height: ${vm(28, $isMobileBackTestPage)};
  `}
`;


const PeriodButton = styled.button<{ $isActive: boolean, $isMobileBackTestPage?: boolean }>`
  background: ${({ $isActive, theme }) => $isActive ? theme.brand6 : 'transparent'};
  color: ${({ $isActive, theme }) => $isActive ? theme.textL1 : theme.textL4};
  height: 28px;
  border: none;
  padding: 0 16px;
  border-radius: 36px;
  transition: all 0.2s ease;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  ${({ theme, $isMobileBackTestPage }) => theme.isMobile
  ?($isMobileBackTestPage ? css`
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

export default function PeridSelector({
  isBinanceSupport,
  selectedPeriod,
  setSelectedPeriod,
  isMobileBackTestPage
}: {
  isBinanceSupport: boolean
  selectedPeriod: PERIOD_OPTIONS
  isMobileBackTestPage?: boolean
  setSelectedPeriod: (period: PERIOD_OPTIONS) => void
}) {
  const getConvertPeriod = useGetConvertPeriod()
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
  return <PeriodSelector>
    {PERIOD_OPTIONS.map((option) => {
      const convertPeriod = getConvertPeriod(selectedPeriod, isBinanceSupport)
      const isActive = convertPeriod === option.value
      return <PeriodButton
        key={option.value}
        $isActive={isActive}
        $isMobileBackTestPage={isMobileBackTestPage}
        onClick={() => setSelectedPeriod(option.value as PERIOD_OPTIONS)}
      >
        {option.label}
      </PeriodButton>
    })}
  </PeriodSelector>
}
