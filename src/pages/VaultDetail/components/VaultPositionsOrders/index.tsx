import { memo, useState, useCallback, useMemo, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import MoveTabList, { MoveType } from 'components/MoveTabList'
import { useVaultPositions, useVaultOpenOrdersPaginated } from 'store/vaultsdetail/hooks'
import { VaultPositions, VaultOpenOrders } from './components'
import { useStrategyPositions } from 'store/vaultsdetail/hooks/useStrategyPositions'
import { useStrategyOpenOrdersPaginated } from 'store/vaultsdetail/hooks/useStrategyOpenOrders'
import { DataModeType, VaultDetailTabType } from 'store/vaultsdetail/vaultsdetail'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store'
import { setShouldRefreshData } from 'store/createstrategy/reducer'

export interface VaultPositionsOrdersProps {
  activeTab: VaultDetailTabType
  vaultId: string
  strategyId: string
  dataMode: DataModeType
}

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

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

const VaultPositionsOrders = memo<VaultPositionsOrdersProps>(({ activeTab, vaultId, strategyId, dataMode }) => {
  const [activeSubTab, setActiveSubTab] = useState<number>(0)
  const dispatch = useDispatch()

  // 获取数据统计信息用于显示Tab标题
  const { totalCount: totalVaultPositions } = useVaultPositions(vaultId || '')
  const { totalCount: totalVaultOrders } = useVaultOpenOrdersPaginated(vaultId || '')
  const { totalCount: totalStrategyPositions, refetch: refetchStrategyPositions } = useStrategyPositions(strategyId || '', dataMode)
  const { totalCount: totalStrategyOrders, refresh: refreshStrategyOrders } = useStrategyOpenOrdersPaginated(strategyId || '', dataMode)
  const totalPositions = activeTab === 'strategy' ? totalStrategyPositions : totalVaultPositions
  const totalOrders = activeTab === 'strategy' ? totalStrategyOrders : totalVaultOrders
  
  // 监听数据重新获取信号
  const shouldRefreshData = useSelector((state: RootState) => state.createstrategy.shouldRefreshData)
  
  // 监听 shouldRefreshData 状态，触发表格数据重新获取
  useEffect(() => {
    if (shouldRefreshData && dataMode === 'paper_trading' && activeTab === 'strategy') {
      const refreshTableData = async () => {
        try {
          await Promise.all([
            refetchStrategyPositions(),
            refreshStrategyOrders(),
          ])
          
          // 重置刷新状态（只在这里重置一次，避免重复）
          dispatch(setShouldRefreshData(false))
        } catch (error) {
          console.error('重新获取表格数据失败:', error)
          dispatch(setShouldRefreshData(false))
        }
      }
      
      refreshTableData()
    }
  }, [shouldRefreshData, dataMode, activeTab, refetchStrategyPositions, refreshStrategyOrders, dispatch])

  const handleSubTabClick = useCallback((index: number) => {
    setActiveSubTab(index)
  }, [])

  const subTabList = useMemo(
    () => [
      {
        key: 0,
        text: <Trans>Positions{totalPositions > 0 && ` (${totalPositions})`}</Trans>,
        clickCallback: () => handleSubTabClick(0),
      },
      {
        key: 1,
        text: <Trans>Orders{totalOrders > 0 && ` (${totalOrders})`}</Trans>,
        clickCallback: () => handleSubTabClick(1),
      },
    ],
    [handleSubTabClick, totalPositions, totalOrders],
  )

  return (
    <TableContainer>
      <MoveTabList moveType={MoveType.LINE} tabList={subTabList} tabKey={activeSubTab} />
      <TableContent>
        {activeSubTab === 0 ? (
          <VaultPositions
            activeTab={activeTab}
            vaultId={vaultId || ''}
            strategyId={strategyId || ''}
            dataMode={dataMode}
          />
        ) : (
          <VaultOpenOrders
            activeTab={activeTab}
            vaultId={vaultId || ''}
            strategyId={strategyId || ''}
            dataMode={dataMode}
          />
        )}
      </TableContent>
    </TableContainer>
  )
})

VaultPositionsOrders.displayName = 'VaultPositionsOrders'

export default VaultPositionsOrders
