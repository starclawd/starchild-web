import { memo, useEffect } from 'react'
import styled, { useTheme } from 'styled-components'
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
import { usePaperTradingPublic } from 'store/vaultsdetail/hooks/usePaperTradingPublic'
import detailBg from 'assets/vaults/detail-bg.png'
import { useAppKitAccount } from '@reown/appkit/react'
import {
  useAllStrategiesOverview,
  useFetchAllStrategiesOverviewData,
} from 'store/vaults/hooks/useAllStrategiesOverview'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { t } from '@lingui/core/macro'

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
  const toast = useToast()
  const theme = useTheme()

  // 首先调用 PaperTradingPublic，使用URL中的strategyId
  const {
    paperTradingPublicData,
    isLoadingPaperTradingPublic,
    error: paperTradingError,
  } = usePaperTradingPublic({ strategyId: urlStrategyId || '' })

  // 检查 PaperTrading 是否成功
  const isPaperTradingSuccess = !!paperTradingPublicData && !paperTradingError
  const shouldFetchOtherData = currentStrategyId && isPaperTradingSuccess

  // URL参数解析逻辑：等PaperTrading成功后再设置strategyId，自动触发其他接口
  useEffect(() => {
    if (urlStrategyId && urlStrategyId !== currentStrategyId && isPaperTradingSuccess) {
      setCurrentStrategyId(urlStrategyId)
    } else if (paperTradingError) {
      // 处理 404 错误：策略未找到
      if ('status' in paperTradingError && paperTradingError.status === 404) {
        toast({
          status: TOAST_STATUS.ERROR,
          title: t`Strategy not found`,
          description: '',
          typeIcon: 'icon-chat-close',
          iconTheme: theme.ruby50,
          autoClose: 3000,
        })
      }
    }
  }, [
    urlStrategyId,
    currentStrategyId,
    setCurrentStrategyId,
    isPaperTradingSuccess,
    paperTradingError,
    paperTradingPublicData,
    toast,
    theme,
  ])

  // 只有 PaperTrading 成功时才获取其他数据
  useFetchStrategyInfo(shouldFetchOtherData ? currentStrategyId : null)
  useFetchVaultInfo()
  const [, isLoadingStrategyInfo] = useStrategyInfo()

  // 当currentVaultId为null时，固定tab为strategy
  useEffect(() => {
    if (currentVaultId === null && activeTab !== 'strategy') {
      setActiveTab('strategy')
    }
  }, [currentVaultId, activeTab, setActiveTab])

  // 等待 PaperTrading 加载完成
  if (isLoadingPaperTradingPublic && urlStrategyId) {
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
