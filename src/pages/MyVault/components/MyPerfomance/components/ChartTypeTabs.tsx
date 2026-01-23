import { memo, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import { useChartType } from 'store/myvault/hooks/useChartType'
import { msg, t } from '@lingui/core/macro'
import { CHART_TYPE } from 'store/vaultsdetail/vaultsdetail'
import { useLingui } from '@lingui/react/macro'

const TabsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 8px;
  width: fit-content;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(4)};
      border-radius: ${vm(8)};
      gap: ${vm(4)};
    `}
`

const TabItem = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  height: 32px;
  padding: 0 12px;
  border-radius: 36px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${({ $isActive, theme }) => ($isActive ? theme.black0 : theme.black200)};
  background: ${({ $isActive, theme }) => ($isActive ? theme.black600 : 'transparent')};

  &:hover {
    background: ${({ theme }) => theme.black800};
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      min-width: ${vm(60)};
      height: ${vm(32)};
      padding: 0 ${vm(12)};
      border-radius: ${vm(36)};
      font-size: ${vm(14)};
      line-height: ${vm(20)};
    `}
`

const ChartTypeTabs = memo(() => {
  const { t } = useLingui()
  const [chartType, setChartType] = useChartType()

  const chartTypes = useMemo(
    () => [
      { key: 'TVL' as const, label: t(msg`TVL`) },
      { key: 'PnL' as const, label: t(msg`PnL`) },
    ],
    [t],
  )

  const handleTabClick = (type: string) => {
    setChartType(type as CHART_TYPE)
  }

  return (
    <TabsContainer>
      {chartTypes.map((tab) => (
        <TabItem key={tab.key} $isActive={chartType === tab.key} onClick={() => handleTabClick(tab.key)}>
          {tab.label}
        </TabItem>
      ))}
    </TabsContainer>
  )
})

ChartTypeTabs.displayName = 'ChartTypeTabs'

export default ChartTypeTabs
