import { memo, useEffect } from 'react'
import styled from 'styled-components'
import VaultDetailNavigation from './components/VaultDetailNavigation'
import VaultInfo from './components/VaultInfo'
import VaultContentTabs from './components/VaultContentTabs'
import VaultChatArea from './components/VaultChatArea'
import ScrollPageContent from 'components/ScrollPageContent'
import Pending from 'components/Pending'
import useParsedQueryString from 'hooks/useParsedQueryString'
import {
  useCurrentVaultId,
  useCurrentStrategyId,
  useFetchVaultInfo,
  useFetchStrategyInfo,
  useStrategyInfo,
  useActiveTab,
} from 'store/vaultsdetail/hooks'
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
  .chat-area-container {
    width: 100%;
  }
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
  const { strategyId: urlStrategyId } = useParsedQueryString()
  const currentVaultId = useCurrentVaultId()
  const [currentStrategyId, setCurrentStrategyId] = useCurrentStrategyId()
  const [activeTab, setActiveTab] = useActiveTab()

  // 获取StrategyInfo和VaultInfo
  useFetchStrategyInfo(currentStrategyId)
  useFetchVaultInfo()
  const [, isLoadingStrategyInfo] = useStrategyInfo()

  // URL参数解析逻辑：设置strategyId
  useEffect(() => {
    if (urlStrategyId && urlStrategyId !== currentStrategyId) {
      setCurrentStrategyId(urlStrategyId)
    }
  }, [urlStrategyId, currentStrategyId, setCurrentStrategyId])

  // 当currentVaultId为null时，固定tab为strategy
  useEffect(() => {
    if (currentVaultId === null && activeTab !== 'strategy') {
      setActiveTab('strategy')
    }
  }, [currentVaultId, activeTab, setActiveTab])

  // 等待strategyInfo加载完成
  if (isLoadingStrategyInfo && currentStrategyId) {
    return (
      <VaultDetailContainer>
        <VaultDetailMainContent>
          <VaultDetailNavigation />
          <Pending isNotButtonLoading={true} />
        </VaultDetailMainContent>
        <VaultDetailChatSidebar />
      </VaultDetailContainer>
    )
  }

  return (
    <VaultDetailContainer>
      <VaultDetailMainContent>
        {/* 导航栏：返回按钮 + WalletConnect */}
        <VaultDetailNavigation />
        <ScrollPageContent className='vault-scroll transparent-scroll-style'>
          <VaultDetailContentWrapper style={{ backgroundImage: `url(${detailBg})` }}>
            {/* Vault基本信息：名称、属性、描述 */}
            <VaultInfo />

            {/* 主要内容区域：Strategy/Vaults Tab + PnL图表 + 表格等 */}
            <VaultContentTabs />
          </VaultDetailContentWrapper>
        </ScrollPageContent>
      </VaultDetailMainContent>

      {/* 聊天区域 */}
      <VaultDetailChatSidebar>
        <VaultChatArea isPaperTrading strategyId={currentStrategyId || ''} />
      </VaultDetailChatSidebar>
    </VaultDetailContainer>
  )
})

VaultDetail.displayName = 'VaultDetail'

export default VaultDetail
