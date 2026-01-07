import { memo, useMemo, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import { useChartType } from 'store/vaultsdetail/hooks/useVaultDetailState'
import { CHART_TYPE, DETAIL_TYPE } from 'store/vaultsdetail/vaultsdetail.d'
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
  height: 28px;
  padding: 4px 16px;
  border-radius: 36px;
  font-size: 13px;
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

interface ChartTypeTabsProps {
  activeTab: DETAIL_TYPE
}

const ChartTypeTabs = memo<ChartTypeTabsProps>(({ activeTab }) => {
  const [chartType, setChartType] = useChartType()

  const chartTypes = useMemo(() => {
    if (activeTab === DETAIL_TYPE.STRATEGY) {
      return [{ key: CHART_TYPE.EQUITY, label: t`Equity` }]
    } else {
      return [
        { key: CHART_TYPE.TVL, label: t`TVL` },
        { key: CHART_TYPE.PNL, label: t`PnL` },
      ]
    }
  }, [activeTab])

  // 当activeTab变化时，直接设置对应的默认图表类型
  useEffect(() => {
    if (activeTab === DETAIL_TYPE.STRATEGY) {
      setChartType(CHART_TYPE.EQUITY)
    } else {
      setChartType(CHART_TYPE.TVL)
    }
  }, [activeTab, setChartType])

  const handleTabClick = (type: CHART_TYPE) => {
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
