import { memo, useEffect } from 'react'
import styled from 'styled-components'
import VaultDetailNavigation from './components/VaultDetailNavigation'
import VaultInfo from './components/VaultInfo'
import VaultContentTabs from './components/VaultContentTabs'
import VaultChatArea from './components/VaultChatArea'
import ScrollPageContent from 'components/ScrollPageContent'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useCurrentVaultId } from 'store/vaultsdetail/hooks'
import detailBg from 'assets/vaults/detail-bg.png'
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { useFetchClaimInfoData } from 'store/vaultsdetail/hooks/useClaimInfo'

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
  width: 100%;
  margin: 0;
  .vault-scroll {
    padding: 0;
  }
`

const VaultDetailChatSidebar = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 480px;
  background: ${({ theme }) => theme.black1000};
`

const VaultDetailContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
  flex: 1;
  padding: 40px;
  background-size: 100% auto;
  background-repeat: no-repeat;
`

const VaultDetail = memo(() => {
  // 解析URL参数
  const { address } = useAppKitAccount()
  const { fetchClaimData } = useFetchClaimInfoData()
  const { vaultId } = useParsedQueryString()
  const [currentVaultId, setCurrentVaultId] = useCurrentVaultId()

  // 当URL中的vaultId变化时，更新到store中
  useEffect(() => {
    if (vaultId && vaultId !== currentVaultId) {
      setCurrentVaultId(vaultId)
    }
  }, [vaultId, currentVaultId, setCurrentVaultId])

  useEffect(() => {
    if (address && vaultId) {
      fetchClaimData({ vaultId, walletAddress: address as string })
    }
  }, [address, vaultId, fetchClaimData])

  return (
    <VaultDetailContainer>
      <VaultDetailMainContent>
        {/* 导航栏：返回按钮 + WalletConnect */}
        <VaultDetailNavigation />
        <ScrollPageContent className='vault-scroll'>
          <VaultDetailContentWrapper style={{ backgroundImage: `url(${detailBg})` }}>
            {/* Vault基本信息：名称、属性、描述 */}
            <VaultInfo vaultId={vaultId || ''} />

            {/* 主要内容区域：Strategy/Vaults Tab + PnL图表 + 表格等 */}
            <VaultContentTabs />
          </VaultDetailContentWrapper>
        </ScrollPageContent>
      </VaultDetailMainContent>

      {/* 聊天区域 */}
      <VaultDetailChatSidebar>
        <VaultChatArea />
      </VaultDetailChatSidebar>
    </VaultDetailContainer>
  )
})

VaultDetail.displayName = 'VaultDetail'

export default VaultDetail
