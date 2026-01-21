import { memo, useState, useCallback, useMemo, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import MoveTabList, { MoveType } from 'components/MoveTabList'
import { useVaultPositions, useVaultOpenOrdersPaginated, useVaultOrderHistoryPaginated } from 'store/vaultsdetail/hooks'
import VaultPositions from './components/VaultPositions'
import VaultOpenOrders from './components/VaultOpenOrders'
import VaultOrderHistory from './components/VaultOrderHistory'
import { useStrategyPositions } from 'store/vaultsdetail/hooks/useStrategyPositions'
import { useStrategyOpenOrdersPaginated } from 'store/vaultsdetail/hooks/useStrategyOpenOrders'
import { useStrategyOrderHistoryPaginated } from 'store/vaultsdetail/hooks/useStrategyOrderHistory'
import { DETAIL_TYPE } from 'store/vaultsdetail/vaultsdetail'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store'
import { setShouldRefreshData } from 'store/createstrategy/reducer'
import TabList from 'components/TabList'
import { IconBase } from 'components/Icons'
import { useCurrentRouter } from 'store/application/hooks'
import { isMatchCurrentRouter } from 'utils'
import { ROUTER } from 'pages/router'
import { ANI_DURATION } from 'constants/index'
import { useIsShowStrategyMarket } from 'store/vaultsdetailcache/hooks'

export interface VaultPositionsOrdersProps {
  activeTab: DETAIL_TYPE
  vaultId: string | undefined
  strategyId: string | undefined
}

const TableContainer = styled.div<{ $isShowStrategyMarket: boolean; $isVaultDetailPage?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  transition: all ${ANI_DURATION}s;
  .move-tab-item {
    height: 40px;
    padding: 0;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
  }

  ${({ $isVaultDetailPage, theme, $isShowStrategyMarket }) =>
    $isVaultDetailPage &&
    css`
      padding: 20px 40px;
      ${theme.mediaMaxWidth.width1280`
        padding: 20px;
      `}
      ${$isShowStrategyMarket &&
      css`
        ${theme.mediaMaxWidth.width1440`
          padding: 20px;
        `}
      `}
    `}
`

const TableContent = styled.div`
  width: 100%;
  overflow-x: auto;
`

const VaultPositionsOrders = memo<VaultPositionsOrdersProps>(({ activeTab, vaultId, strategyId }) => {
  const [activeSubTab, setActiveSubTab] = useState<number>(0)
  const dispatch = useDispatch()
  const hasInitialized = useRef(false)
  const currentRouter = useCurrentRouter()
  const isVaultDetailPage = isMatchCurrentRouter(currentRouter, ROUTER.VAULT_DETAIL)
  const [isShowStrategyMarket] = useIsShowStrategyMarket()

  // 获取数据统计信息用于显示Tab标题
  const { totalCount: totalVaultPositions } = useVaultPositions(vaultId)
  const { totalCount: totalVaultOrders } = useVaultOpenOrdersPaginated(vaultId)
  const { totalCount: totalVaultHistory } = useVaultOrderHistoryPaginated(vaultId)
  const { totalCount: totalStrategyPositions, refetch: refetchStrategyPositions } = useStrategyPositions(
    strategyId || '',
  )
  const { totalCount: totalStrategyOrders, refresh: refreshStrategyOrders } = useStrategyOpenOrdersPaginated(
    strategyId || '',
  )
  const { totalCount: totalStrategyHistory, refresh: refreshStrategyHistory } = useStrategyOrderHistoryPaginated(
    strategyId || '',
  )
  const totalPositions = activeTab === DETAIL_TYPE.STRATEGY ? totalStrategyPositions : totalVaultPositions
  const totalOrders = activeTab === DETAIL_TYPE.STRATEGY ? totalStrategyOrders : totalVaultOrders
  const totalHistory = activeTab === DETAIL_TYPE.STRATEGY ? totalStrategyHistory : totalVaultHistory

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
    if (shouldRefreshData && activeTab === DETAIL_TYPE.STRATEGY) {
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
    <TableContainer $isShowStrategyMarket={isShowStrategyMarket} $isVaultDetailPage={isVaultDetailPage}>
      <MoveTabList gap={20} tabList={subTabList} tabKey={activeSubTab} />
      <TableContent>
        {activeSubTab === 0 ? (
          <VaultPositions activeTab={activeTab} vaultId={vaultId} strategyId={strategyId} />
        ) : activeSubTab === 1 ? (
          <VaultOpenOrders activeTab={activeTab} vaultId={vaultId} strategyId={strategyId} />
        ) : (
          <VaultOrderHistory activeTab={activeTab} vaultId={vaultId} strategyId={strategyId} />
        )}
      </TableContent>
    </TableContainer>
  )
})

VaultPositionsOrders.displayName = 'VaultPositionsOrders'

export default VaultPositionsOrders
