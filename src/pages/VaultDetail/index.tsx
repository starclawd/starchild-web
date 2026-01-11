import { memo, useEffect } from 'react'
import styled from 'styled-components'
import VaultDetailNavigation from './components/VaultDetailNavigation'
import VaultInfo from './components/VaultInfo'
import VaultContent from './components/VaultContent'
import VaultChatArea from './components/VaultChatArea'
import Pending from 'components/Pending'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useCurrentVaultId, useActiveTab } from 'store/vaultsdetail/hooks'
import { usePaperTradingPublic } from 'store/vaultsdetail/hooks/usePaperTradingPublic'
import { DETAIL_TYPE } from 'store/vaultsdetail/vaultsdetail'
import StrategyMarket from './components/StrategyMarket'

const VaultDetailContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

const InnerContent = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 1220px;
`

const VaultDetailMainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: calc(100% - 300px);
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
  width: 300px;
  background: ${({ theme }) => theme.black1000};
  .chat-area-container {
    width: 100%;
  }
`

const VaultDetailContentWrapper = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - 60px);
  border-right: 1px solid ${({ theme }) => theme.black800};
`

const RightInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const VaultDetail = memo(() => {
  // 解析URL参数
  const { strategyId } = useParsedQueryString()
  const currentVaultId = useCurrentVaultId()
  const [activeTab, setActiveTab] = useActiveTab()

  // 首先调用 PaperTradingPublic，使用URL中的strategyId
  const { isLoadingPaperTradingPublic } = usePaperTradingPublic({ strategyId: strategyId || '' })

  // 当currentVaultId为null时，固定tab为strategy
  useEffect(() => {
    if (currentVaultId === null && activeTab !== DETAIL_TYPE.STRATEGY) {
      setActiveTab(DETAIL_TYPE.STRATEGY)
    }
  }, [currentVaultId, activeTab, setActiveTab])

  return (
    <VaultDetailContainer className='scroll-style'>
      <InnerContent>
        <VaultDetailMainContent>
          {/* 导航栏：返回按钮 + WalletConnect */}
          <VaultDetailNavigation />
          <VaultDetailContentWrapper>
            <StrategyMarket />
            {isLoadingPaperTradingPublic ? (
              <Pending isNotButtonLoading={true} />
            ) : (
              <RightInfo className='transparent-scroll-style'>
                <VaultInfo />
                <VaultContent />
              </RightInfo>
            )}
          </VaultDetailContentWrapper>
        </VaultDetailMainContent>

        {/* 聊天区域 */}
        <VaultDetailChatSidebar>
          <VaultChatArea />
        </VaultDetailChatSidebar>
      </InnerContent>
    </VaultDetailContainer>
  )
})

VaultDetail.displayName = 'VaultDetail'

export default VaultDetail
