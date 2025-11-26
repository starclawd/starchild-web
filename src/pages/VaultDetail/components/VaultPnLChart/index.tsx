import { memo } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: ${({ theme }) => theme.black700};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.lineDark8};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(20)};
      gap: ${vm(16)};
    `}
`

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex-direction: column;
      align-items: flex-start;
      gap: ${vm(12)};
    `}
`

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(18)};
  `}
`

const ChartStats = styled.div`
  display: flex;
  gap: 24px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(16)};
      width: 100%;
      justify-content: space-between;
    `}
`

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
    `}
`

const StatLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.textL3};
  text-transform: uppercase;
  font-weight: 500;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(12)};
  `}
`

const StatValue = styled.span<{ $positive?: boolean }>`
  font-size: 16px;
  color: ${({ $positive, theme }) => 
    $positive === undefined 
      ? theme.textL1 
        : $positive 
        ? theme.jade10 
        : theme.ruby50
  };
  font-weight: 600;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(16)};
  `}
`

const ChartPlaceholder = styled.div`
  width: 100%;
  height: 300px;
  background: ${({ theme }) => theme.black800};
  border: 2px dashed ${({ theme }) => theme.lineDark6};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textL3};
  font-size: 16px;
  font-weight: 500;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(250)};
      font-size: ${vm(16)};
    `}
`

const VaultPnLChart = memo(() => {
  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle><Trans>PnL Performance</Trans></ChartTitle>
        <ChartStats>
          <StatItem>
            <StatLabel><Trans>Total PnL</Trans></StatLabel>
            <StatValue $positive={true}>+$18,245.98</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel><Trans>Today's PnL</Trans></StatLabel>
            <StatValue $positive={true}>+$755,431.39</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel><Trans>PnL %</Trans></StatLabel>
            <StatValue $positive={true}>+21.39%</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel><Trans>Max Drawdown</Trans></StatLabel>
            <StatValue $positive={false}>-15.6%</StatValue>
          </StatItem>
        </ChartStats>
      </ChartHeader>

      <ChartPlaceholder>
        <Trans>PnL Area Chart - Coming Soon</Trans>
      </ChartPlaceholder>
    </ChartContainer>
  )
})

VaultPnLChart.displayName = 'VaultPnLChart'

export default VaultPnLChart
