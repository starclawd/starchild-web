import { memo, useMemo, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import { useChartType, useActiveTab } from 'store/vaultsdetail/hooks/useVaultDetailState'
import { VaultChartType } from 'store/vaultsdetail/vaultsdetail.d'
import { t } from '@lingui/core/macro'

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
  color: ${({ $isActive, theme }) => ($isActive ? theme.textL1 : theme.textL3)};
  background: ${({ $isActive, theme }) => ($isActive ? theme.bgT30 : 'transparent')};

  &:hover {
    opacity: 0.7;
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
  const [chartType, setChartType] = useChartType()
  const [activeTab] = useActiveTab()

  const chartTypes: Array<{ key: VaultChartType; label: string }> = useMemo(() => {
    const baseOptions = [
      { key: 'TVL' as VaultChartType, label: t`TVL` },
      { key: 'PnL' as VaultChartType, label: t`PnL` },
    ]

    // 只有在strategy tab时才显示Index选项
    if (activeTab === 'strategy') {
      return [
        { key: 'TVL' as VaultChartType, label: t`TVL` },
        { key: 'Index' as VaultChartType, label: t`Index` },
        { key: 'PnL' as VaultChartType, label: t`PnL` },
      ]
    }

    return baseOptions
  }, [activeTab])

  // 当activeTab变化时，检查当前选中的chartType是否仍然可用
  useEffect(() => {
    const availableTypes = chartTypes.map((type) => type.key)
    if (!availableTypes.includes(chartType)) {
      // 如果当前选中的类型不可用（比如从strategy切换到vaults时Index不可用），切换到TVL
      setChartType('TVL')
    }
  }, [activeTab, chartType, chartTypes, setChartType])

  const handleTabClick = (type: VaultChartType) => {
    setChartType(type)
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
