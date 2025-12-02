import { memo, useState, useCallback, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import MoveTabList, { MoveType } from 'components/MoveTabList'
import {
  useVaultPositions,
  useVaultOpenOrdersPaginated,
  useCurrentVaultId,
  useCurrentStrategyId,
  useActiveTab,
} from 'store/vaultsdetail/hooks'
import { VaultPositions, VaultOpenOrders } from './components'
import { useStrategyPositions } from 'store/vaultsdetail/hooks/useStrategyPositions'

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

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

const VaultPositionsOrders = memo(() => {
  const [activeTab] = useActiveTab()
  const [activeSubTab, setActiveSubTab] = useState<number>(0)
  const [vaultId] = useCurrentVaultId()
  const [strategyId] = useCurrentStrategyId()

  // 获取数据统计信息用于显示Tab标题
  const { totalCount: totalVaultPositions } = useVaultPositions(vaultId || '')
  const { totalCount: totalVaultOrders } = useVaultOpenOrdersPaginated(vaultId || '')
  const { totalCount: totalStrategyPositions } = useStrategyPositions(strategyId || '')
  const totalStrategyOrders = 0
  const totalPositions = activeTab === 'strategy' ? totalStrategyPositions : totalVaultPositions
  const totalOrders = activeTab === 'strategy' ? totalStrategyOrders : totalVaultOrders

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

  // 如果没有vaultId，显示占位符
  if (!vaultId) {
    return (
      <TableContainer>
        <MoveTabList moveType={MoveType.LINE} tabList={subTabList} tabIndex={activeSubTab} />
        <TableContent>
          <PlaceholderTable>
            <Trans>Please select a vault to view {activeSubTab === 0 ? 'positions' : 'orders'}</Trans>
          </PlaceholderTable>
        </TableContent>
      </TableContainer>
    )
  }

  return (
    <TableContainer>
      <MoveTabList moveType={MoveType.LINE} tabList={subTabList} tabIndex={activeSubTab} />
      <TableContent>{activeSubTab === 0 ? <VaultPositions /> : <VaultOpenOrders />}</TableContent>
    </TableContainer>
  )
})

VaultPositionsOrders.displayName = 'VaultPositionsOrders'

export default VaultPositionsOrders
