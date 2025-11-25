import { memo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { useProtocolVaultsData } from 'store/vaults/hooks/useVaultData'
import Pending from 'components/Pending'
import { ButtonCommon } from 'components/Button'

const ProtocolContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin: 0;
`

const VaultCard = styled.div`
  background: ${({ theme }) => theme.bgL0};
  border: 1px solid ${({ theme }) => theme.lineDark8};
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 32px;
  min-height: 120px;
`

const VaultInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
`

const VaultName = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin: 0;
`

const VaultDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.textL2};
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`

const StatsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 48px;
  flex: 1;
`

const StatColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const StatLabel = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textL2};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
`

const ApyValue = styled(StatValue)`
  color: ${({ theme }) => theme.green100};
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`

const VaultButton = styled(ButtonCommon)`
  min-width: 120px;
  height: 40px;
  background: linear-gradient(135deg, ${({ theme }) => theme.purple200}, ${({ theme }) => theme.blue100});
  border: none;
  color: white;
  font-weight: 500;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: ${({ theme }) => theme.textL2};
  font-size: 16px;
`

const ProtocolVaults = memo(() => {
  const { protocolVaults, isLoadingProtocolVaults } = useProtocolVaultsData()

  const handleViewVault = (vaultId: string) => {
    // TODO: 实现查看vault详情的逻辑
    console.log('View vault:', vaultId)
  }

  if (isLoadingProtocolVaults) {
    return (
      <ProtocolContainer>
        <SectionTitle>
          <Trans>AI generated Vaults</Trans>
        </SectionTitle>
        <VaultCard>
          <LoadingContainer>
            <Pending isFetching />
          </LoadingContainer>
        </VaultCard>
      </ProtocolContainer>
    )
  }

  if (!protocolVaults || protocolVaults.length === 0) {
    return (
      <ProtocolContainer>
        <SectionTitle>
          <Trans>AI generated Vaults</Trans>
        </SectionTitle>
        <VaultCard>
          <EmptyState>
            <Trans>No protocol vaults available</Trans>
          </EmptyState>
        </VaultCard>
      </ProtocolContainer>
    )
  }

  return (
    <ProtocolContainer>
      <SectionTitle>
        <Trans>AI generated Vaults</Trans>
      </SectionTitle>

      {protocolVaults.map((vault) => (
        <VaultCard key={vault.id}>
          {/* 左侧：Vault信息 */}
          <VaultInfo>
            <VaultName>{vault.name}</VaultName>
            <VaultDescription>{vault.description}</VaultDescription>
          </VaultInfo>

          {/* 中间：统计数据 */}
          <StatsContainer>
            <StatColumn>
              <StatLabel>
                <Trans>TVL</Trans>
              </StatLabel>
              <StatValue>{vault.tvl}</StatValue>
            </StatColumn>

            <StatColumn>
              <StatLabel>
                <Trans>All Time APY</Trans>
              </StatLabel>
              <ApyValue>{vault.allTimeApy}</ApyValue>
            </StatColumn>
          </StatsContainer>

          {/* 右侧：Depositors + 按钮 */}
          <RightSection>
            <StatColumn>
              <StatLabel>
                <Trans>Depositors</Trans>
              </StatLabel>
              <StatValue>{vault.depositors.toLocaleString()}</StatValue>
            </StatColumn>

            <VaultButton onClick={() => handleViewVault(vault.id)}>
              <Trans>View Vault</Trans>
            </VaultButton>
          </RightSection>
        </VaultCard>
      ))}
    </ProtocolContainer>
  )
})

ProtocolVaults.displayName = 'ProtocolVaults'

export default ProtocolVaults
