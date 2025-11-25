import { memo, useEffect } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { useVaultApiOperations } from 'store/vaults/hooks/useVaultApi'
import VaultOverview from './components/VaultOverview'
import MyVaultStats from './components/MyVaultStats'
import ProtocolVaults from './components/ProtocolVaults'
import CommunityVaults from './components/CommunityVaults'

const VaultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  background: ${({ theme }) => theme.bgL1};
`

const VaultsHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;

  img {
    width: 48px;
    height: 48px;
    margin-right: 16px;
    border-radius: 8px;
  }
`

const VaultsTitle = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin: 0;
`

const VaultsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  flex: 1;
`

const VaultOverviewSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;

  /* 确保两个组件等宽 */
  > * {
    flex: 1;
  }

  /* 移动端响应式 - 小屏幕时改为上下排列 */
  ${({ theme }) =>
    theme.isMobile &&
    `
    flex-direction: column;
    
    > * {
      flex: none;
    }
  `}
`

const ProtocolSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const CommunitySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Vaults = memo(() => {
  const { fetchAllData } = useVaultApiOperations()

  // 页面加载时获取数据
  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  return (
    <VaultsContainer>
      <VaultsHeader>
        <img
          src="data:image/svg+xml,%3csvg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M24 0L48 12V36L24 48L0 36V12L24 0Z' fill='%234F46E5'/%3e%3cpath d='M24 12L36 18V30L24 36L12 30V18L24 12Z' fill='white'/%3e%3c/svg%3e"
          alt='Vaults'
        />
        <VaultsTitle>
          <Trans>Vault Library</Trans>
        </VaultsTitle>
      </VaultsHeader>

      <VaultsContent>
        {/* 概览和我的Vault统计 */}
        <VaultOverviewSection>
          <VaultOverview />
          <MyVaultStats />
        </VaultOverviewSection>

        {/* Protocol Vaults */}
        <ProtocolSection>
          <ProtocolVaults />
        </ProtocolSection>

        {/* Community Vaults */}
        <CommunitySection>
          <CommunityVaults />
        </CommunitySection>
      </VaultsContent>
    </VaultsContainer>
  )
})

Vaults.displayName = 'Vaults'

export default Vaults
