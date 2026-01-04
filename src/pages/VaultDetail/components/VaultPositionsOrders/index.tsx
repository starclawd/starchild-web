import { memo, useState, useCallback, useMemo, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import MoveTabList, { MoveType } from 'components/MoveTabList'
import { useVaultPositions, useVaultOpenOrdersPaginated, useVaultOrderHistoryPaginated } from 'store/vaultsdetail/hooks'
import { VaultPositions, VaultOpenOrders, VaultOrderHistory } from './components'
import { useStrategyPositions } from 'store/vaultsdetail/hooks/useStrategyPositions'
import { useStrategyOpenOrdersPaginated } from 'store/vaultsdetail/hooks/useStrategyOpenOrders'
import { useStrategyOrderHistoryPaginated } from 'store/vaultsdetail/hooks/useStrategyOrderHistory'
import { VaultDetailTabType } from 'store/vaultsdetail/vaultsdetail'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store'
import { setShouldRefreshData } from 'store/createstrategy/reducer'
import TabList from 'components/TabList'
import { IconBase } from 'components/Icons'

export interface VaultPositionsOrdersProps {
  activeTab: VaultDetailTabType
  vaultId: string
  strategyId: string
}

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .positions-orders-tab-list {
    height: 40px;

    .tab-item {
      border: 1px solid ${({ theme }) => theme.black600};
    }
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(20)};
      gap: ${vm(16)};
    `}
`

const TableContent = styled.div`
  width: 100%;
  overflow-x: auto;
`

const PlaceholderTable = styled.div`
  width: 100%;
  min-height: 300px;
  background: ${({ theme }) => theme.black800};
  border: 2px dashed ${({ theme }) => theme.lineDark6};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: ${({ theme }) => theme.textL3};
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  padding: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      min-height: ${vm(250)};
      font-size: ${vm(16)};
      gap: ${vm(12)};
      padding: ${vm(20)};
    `}
`

const VaultPositionsOrders = memo<VaultPositionsOrdersProps>(({ activeTab, vaultId, strategyId }) => {
  const [activeSubTab, setActiveSubTab] = useState<number>(0)
  const dispatch = useDispatch()
  const hasInitialized = useRef(false)

  // 获取数据统计信息用于显示Tab标题
  const { totalCount: totalVaultPositions } = useVaultPositions(vaultId || '')
  const { totalCount: totalVaultOrders } = useVaultOpenOrdersPaginated(vaultId || '')
  const { totalCount: totalVaultHistory } = useVaultOrderHistoryPaginated(vaultId || '')
  const { totalCount: totalStrategyPositions, refetch: refetchStrategyPositions } = useStrategyPositions(
    strategyId || '',
  )
  const { totalCount: totalStrategyOrders, refresh: refreshStrategyOrders } = useStrategyOpenOrdersPaginated(
    strategyId || '',
  )
  const { totalCount: totalStrategyHistory, refresh: refreshStrategyHistory } = useStrategyOrderHistoryPaginated(
    strategyId || '',
  )
  const totalPositions = activeTab === 'strategy' ? totalStrategyPositions : totalVaultPositions
  const totalOrders = activeTab === 'strategy' ? totalStrategyOrders : totalVaultOrders
  const totalHistory = activeTab === 'strategy' ? totalStrategyHistory : totalVaultHistory

  // 监听数据重新获取信号
  const shouldRefreshData = useSelector((state: RootState) => state.createstrategy.shouldRefreshData)

  // 初始状态自动切换tab：如果positions为空但orders不为空，则切换到orders tab
  useEffect(() => {
    // 只在初始状态且数据已加载时执行一次检查
    if (!hasInitialized.current && totalPositions === 0 && totalOrders > 0 && activeSubTab === 0) {
      setActiveSubTab(1)
      hasInitialized.current = true
    } else if (!hasInitialized.current && (totalPositions != 0 || totalOrders != 0)) {
      // 标记为已初始化，即使不需要切换tab
      hasInitialized.current = true
    }
  }, [totalPositions, totalOrders, activeSubTab])

  // 监听 shouldRefreshData 状态，触发表格数据重新获取
  useEffect(() => {
    if (shouldRefreshData && activeTab === 'strategy') {
      const refreshTableData = async () => {
        try {
          await Promise.all([refetchStrategyPositions(), refreshStrategyOrders(), refreshStrategyHistory()])

          // 重置刷新状态（只在这里重置一次，避免重复）
          dispatch(setShouldRefreshData(false))
        } catch (error) {
          console.error('重新获取表格数据失败:', error)
          dispatch(setShouldRefreshData(false))
        }
      }

      refreshTableData()
    }
  }, [shouldRefreshData, activeTab, refetchStrategyPositions, refreshStrategyOrders, refreshStrategyHistory, dispatch])

  const handleSubTabClick = useCallback((index: number) => {
    setActiveSubTab(index)
  }, [])

  const subTabList = useMemo(
    () => [
      {
        key: 0,
        icon: <IconBase className='icon-positions' />,
        text: <Trans>Positions{totalPositions > 0 && ` (${totalPositions})`}</Trans>,
        clickCallback: () => handleSubTabClick(0),
      },
      {
        key: 1,
        icon: <IconBase className='icon-orders' />,
        text: <Trans>Open orders{totalOrders > 0 && ` (${totalOrders})`}</Trans>,
        clickCallback: () => handleSubTabClick(1),
      },
      {
        key: 2,
        icon: <IconBase className='icon-orders' />,
        text: <Trans>History{totalHistory > 0 && ` (${totalHistory})`}</Trans>,
        clickCallback: () => handleSubTabClick(2),
      },
    ],
    [handleSubTabClick, totalPositions, totalOrders, totalHistory],
  )

  return (
    <TableContainer>
      <TabList className='positions-orders-tab-list' tabList={subTabList} tabKey={activeSubTab} />
      <TableContent>
        {activeSubTab === 0 ? (
          <VaultPositions activeTab={activeTab} vaultId={vaultId || ''} strategyId={strategyId || ''} />
        ) : activeSubTab === 1 ? (
          <VaultOpenOrders activeTab={activeTab} vaultId={vaultId || ''} strategyId={strategyId || ''} />
        ) : (
          <VaultOrderHistory activeTab={activeTab} vaultId={vaultId || ''} strategyId={strategyId || ''} />
        )}
      </TableContent>
    </TableContainer>
  )
})

VaultPositionsOrders.displayName = 'VaultPositionsOrders'

export default VaultPositionsOrders
