import { memo, useMemo, useEffect } from 'react'
import styled, { css, useTheme } from 'styled-components'
import { vm } from 'pages/helper'
import { useChartStrategyId } from 'store/mystrategy/hooks/useChartStrategyId'
import { useMyStrategies } from 'store/mystrategy/hooks/useMyStrategies'
import Select, { TriggerMethod, DataType } from 'components/Select'
import { msg, t } from '@lingui/core/macro'
import { STRATEGY_STATUS } from 'store/createstrategy/createstrategy'
import { useLingui } from '@lingui/react/macro'

const SelectorContainer = styled.div`
  display: flex;
  align-items: center;
  min-width: 320px;

  .select-border-wrapper {
    height: 28px;
    border-radius: 4px;
  }

  .strategy-selector-pop {
    border-radius: 4px;
    span {
      font-size: 12px;
      line-height: 18px;
      font-weight: 600;
      color: ${({ theme }) => theme.black100};
    }
    li:hover {
      border-radius: 4px;
    }
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
    `}
`

const SelectValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  color: ${({ theme }) => theme.black200};
  margin-right: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(28)};
      font-size: ${vm(12)};
      line-height: ${vm(18)};
      margin-right: ${vm(8)};
      max-width: ${vm(100)};
    `}
`

const StrategiesSelector = memo(() => {
  const { t } = useLingui()
  const theme = useTheme()
  const [chartStrategyId, setChartStrategyId] = useChartStrategyId()
  const { myStrategies, isLoadingMyStrategies } = useMyStrategies()

  // 创建选择器选项（包含"All"选项）
  const strategyOptions: DataType[] = useMemo(() => {
    const options: DataType[] = [
      {
        value: 'all',
        text: t(msg`All`),
        clickCallback: () => setChartStrategyId('all'),
      },
    ]

    // 只显示 deployed 状态的策略
    const deployedStrategies = myStrategies.filter((strategy) => strategy.status === STRATEGY_STATUS.DEPLOYED)

    if (deployedStrategies.length) {
      const strategyItems = deployedStrategies.map((strategy) => ({
        value: strategy.strategy_id,
        text: strategy.strategy_name,
        clickCallback: () => {
          setChartStrategyId(strategy.strategy_id)
        },
      }))
      options.push(...strategyItems)
    }

    return options
  }, [myStrategies, setChartStrategyId, t])

  // 默认选择"All"
  useEffect(() => {
    if (!isLoadingMyStrategies && !chartStrategyId) {
      setChartStrategyId('all')
    }
  }, [isLoadingMyStrategies, chartStrategyId, setChartStrategyId])

  // 获取选中的策略名称
  const getSelectedStrategyName = () => {
    if (isLoadingMyStrategies) {
      return t(msg`Loading...`)
    }

    if (chartStrategyId === 'all') {
      return t(msg`All`)
    }

    // 只从 deployed 策略中查找
    const deployedStrategies = myStrategies.filter((strategy) => strategy.status === STRATEGY_STATUS.DEPLOYED)

    if (!deployedStrategies.length) {
      return t(msg`No strategies`)
    }

    const selectedStrategy = deployedStrategies.find((strategy) => strategy.strategy_id === chartStrategyId)
    return selectedStrategy?.strategy_name || t(msg`All`)
  }

  // 如果没有数据或正在加载，显示禁用状态
  if (isLoadingMyStrategies || !strategyOptions.length) {
    return (
      <SelectorContainer>
        <SelectValue>{getSelectedStrategyName()}</SelectValue>
      </SelectorContainer>
    )
  }

  return (
    <SelectorContainer>
      <Select
        value={chartStrategyId || 'all'}
        dataList={strategyOptions}
        triggerMethod={TriggerMethod.CLICK}
        placement='bottom-end'
        hideExpand={false}
        iconExpandStyle={{
          color: theme.black200,
        }}
        alignPopWidth={true}
        popClass='strategy-selector-pop'
      >
        <SelectValue>{getSelectedStrategyName()}</SelectValue>
      </Select>
    </SelectorContainer>
  )
})

StrategiesSelector.displayName = 'StrategiesSelector'

export default StrategiesSelector
