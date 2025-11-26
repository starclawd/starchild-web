import { memo, useEffect } from 'react'
import styled from 'styled-components'
import VaultDetailNavigation from './components/VaultDetailNavigation'
import VaultInfo from './components/VaultInfo'
import VaultContentTabs from './components/VaultContentTabs'
import VaultChatArea from './components/VaultChatArea'
import ScrollPageContent from 'components/ScrollPageContent'
import { vm } from 'pages/helper'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useCurrentVaultId } from 'store/vaultsdetail/hooks'

const VaultDetailContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.bgL1};
  gap: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    `
    flex-direction: column;
    padding: ${vm(20)};
    gap: ${vm(16)};
  `}
`

const VaultDetailMainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    `
    max-width: 100%;
  `}
`

const VaultDetailChatSidebar = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  min-width: 400px;
  background: ${({ theme }) => theme.black700};
  border-radius: 8px;
  margin-right: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    `
    width: 100%;
    min-width: auto;
    height: ${vm(300)};
  `}
`

const VaultDetailContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;

  ${({ theme }) =>
    theme.isMobile &&
    `
    gap: ${vm(16)};
  `}
`

const VaultDetail = memo(() => {
  // 解析URL参数
  const { vaultId } = useParsedQueryString()
  const [currentVaultId, setCurrentVaultId] = useCurrentVaultId()

  // 当URL中的vaultId变化时，更新到store中
  useEffect(() => {
    if (vaultId && vaultId !== currentVaultId) {
      setCurrentVaultId(vaultId)
    }
  }, [vaultId, currentVaultId, setCurrentVaultId])

  return (
    <VaultDetailContainer>
      <VaultDetailMainContent>
        {/* 导航栏：返回按钮 + WalletConnect */}
        <VaultDetailNavigation />
        <ScrollPageContent>
          <VaultDetailContentWrapper>
            {/* Vault基本信息：名称、属性、描述 */}
            <VaultInfo />

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
