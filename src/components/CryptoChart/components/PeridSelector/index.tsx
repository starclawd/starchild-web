import { vm } from 'pages/helper';
import { useMemo } from 'react';
import { useSelectedPeriod } from 'store/insightscache/hooks';
import { PERIOD_OPTIONS } from 'store/insightscache/insightscache';
import styled, { css } from 'styled-components'


const PeriodSelector = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4px;
  height: 100%;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(4)};
    height: ${vm(28)};
  `}
`;


const PeriodButton = styled.button<{ $isActive: boolean }>`
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
  ${({ theme }) => theme.isMobile
  ?css`
    padding: 0 ${vm(16)};
    height: ${vm(28)};
    font-size: 0.12rem;
    line-height: 0.18rem;
    border-radius: ${vm(36)};
  `
  :css`
    cursor: pointer;
  `}
`;

export default function PeridSelector() {
  const [selectedPeriod, setSelectedPeriod] = useSelectedPeriod();
  const PERIOD_OPTIONS = useMemo(() => {
    return [
      { label: '15m', value: '15m' },
      { label: '1h', value: '1h' },
      { label: '4h', value: '4h' },
      { label: '1D', value: '1d' },
      { label: '1W', value: '1w' },
      { label: '1M', value: '1M' },
      // { label: '3M', value: '3M' },
    ]
  }, [])
  return <PeriodSelector>
    {PERIOD_OPTIONS.map((option) => (
      <PeriodButton
        key={option.value}
        $isActive={selectedPeriod === option.value}
        onClick={() => setSelectedPeriod(option.value as PERIOD_OPTIONS)}
      >
        {option.label}
      </PeriodButton>
    ))}
  </PeriodSelector>
}
