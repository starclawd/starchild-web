import { memo, useEffect } from 'react'
import styled from 'styled-components'
import VaultDetailNavigation from './components/VaultDetailNavigation'
import VaultInfo from './components/VaultInfo'
import VaultContentTabs from './components/VaultContentTabs'
import VaultChatArea from './components/VaultChatArea'
import ScrollPageContent from 'components/ScrollPageContent'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useCurrentVaultId, useCurrentStrategyId, useFetchVaultInfo } from 'store/vaultsdetail/hooks'
import detailBg from 'assets/vaults/detail-bg.png'
import { useAppKitAccount } from '@reown/appkit/react'
import {
  useAllStrategiesOverview,
  useFetchAllStrategiesOverviewData,
} from 'store/vaults/hooks/useAllStrategiesOverview'

const VaultDetailContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.black900};
`

const VaultDetailMainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: calc(100% - 400px);
  height: 100%;
  margin: 0;
  .vault-scroll {
    padding: 0;
  }
`

const VaultDetailChatSidebar = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 400px;
  background: ${({ theme }) => theme.black1000};
`

const VaultDetailContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
  flex: 1;
  padding: 40px 20px;
  background-size: 100% auto;
  background-repeat: no-repeat;
`

const VaultDetail = memo(() => {
  // 解析URL参数
  const { address } = useAppKitAccount()
  const { vaultId: urlVaultId, strategyId: urlStrategyId } = useParsedQueryString()
  const [currentVaultId, setCurrentVaultId] = useCurrentVaultId()
  const [currentStrategyId, setCurrentStrategyId] = useCurrentStrategyId()
  // 获取vault info
  useFetchVaultInfo()

  // AllStrategies数据管理
  const [allStrategies] = useAllStrategiesOverview()
  const { fetchAllStrategiesOverview } = useFetchAllStrategiesOverviewData()

  // 初始化AllStrategies数据
  useEffect(() => {
    if (allStrategies.length === 0) {
      fetchAllStrategiesOverview()
    }
  }, [allStrategies.length, fetchAllStrategiesOverview])

  // 主要初始化逻辑：处理vaultId和strategyId的关系
  useEffect(() => {
    // 如果allStrategies还没有数据，等待加载
    if (allStrategies.length === 0) {
      return
    }

    let finalVaultId: string | null = null
    let finalStrategyId: string | null = null

    // 如果URL中有strategyId，优先使用strategyId
    if (urlStrategyId) {
      const strategiesById = allStrategies.filter((strategy) => strategy.strategyId === urlStrategyId)
      if (strategiesById.length > 0) {
        finalStrategyId = urlStrategyId
        finalVaultId = strategiesById[0].vaultId
      } else {
        // 找不到对应的strategy，但strategyId存在，直接使用
        finalStrategyId = urlStrategyId
        // 如果同时有vaultId，也使用它
        finalVaultId = urlVaultId || null
      }
    }
    // 否则使用vaultId
    else if (urlVaultId) {
      const strategiesByVaultId = allStrategies.filter((strategy) => strategy.vaultId === urlVaultId)
      finalVaultId = urlVaultId
      if (strategiesByVaultId.length > 0) {
        // 使用第一个strategy作为默认strategyId
        finalStrategyId = strategiesByVaultId[0].strategyId
      }
    }

    // 更新到store中，只有在需要时才更新
    if (finalVaultId && finalVaultId !== currentVaultId) {
      setCurrentVaultId(finalVaultId)
    }
    if (finalStrategyId && finalStrategyId !== currentStrategyId) {
      setCurrentStrategyId(finalStrategyId)
    }
  }, [
    urlVaultId,
    urlStrategyId,
    allStrategies,
    currentVaultId,
    currentStrategyId,
    setCurrentVaultId,
    setCurrentStrategyId,
  ])

  return (
    <VaultDetailContainer>
      <VaultDetailMainContent>
        {/* 导航栏：返回按钮 + WalletConnect */}
        <VaultDetailNavigation />
        <ScrollPageContent className='vault-scroll transparent-scroll-style'>
          <VaultDetailContentWrapper style={{ backgroundImage: `url(${detailBg})` }}>
            {/* Vault基本信息：名称、属性、描述 */}
            <VaultInfo vaultId={currentVaultId || ''} strategyId={currentStrategyId || ''} />

            {/* 主要内容区域：Strategy/Vaults Tab + PnL图表 + 表格等 */}
            <VaultContentTabs />
          </VaultDetailContentWrapper>
        </ScrollPageContent>
      </VaultDetailMainContent>

      {/* 聊天区域 */}
      <VaultDetailChatSidebar>
        <VaultChatArea strategyId={currentStrategyId || ''} />
      </VaultDetailChatSidebar>
    </VaultDetailContainer>
  )
})

VaultDetail.displayName = 'VaultDetail'

export default VaultDetail
