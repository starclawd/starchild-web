import { memo } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import VaultOverview from './components/VaultOverview'
import MyVaultStats from './components/MyVaultStats'
import Leaderboard from './components/Leaderboard'
import ProtocolVaults from './components/ProtocolVaults'
import CommunityVaults from './components/CommunityVaults'
import VaultsWalletConnect from './components/VaultsWalletConnect'
import ScrollPageContent from 'components/ScrollPageContent'

const VaultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px;
  background: ${({ theme }) => theme.bgL1};
`

const VaultsContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`

const VaultsHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex-direction: column;
      align-items: flex-start;
    `}
`

const VaultsHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 628px;
`

const VaultsHeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 440px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
    `}
`

const VaultsTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const VaultsTitleLine1 = styled.h1`
  font-size: 56px;
  font-weight: 300;
  line-height: 72px;
  color: ${({ theme }) => theme.textL2};
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 24px;
    `}
`

const VaultsTitleLine2 = styled.h1`
  font-size: 56px;
  font-weight: 600;
  line-height: 72px;
  color: ${({ theme }) => theme.textL1};
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 32px;
    `}
`

const VaultsSubtitle = styled.p`
  font-size: 18px;
  font-weight: 400;
  line-height: 26px;
  color: ${({ theme }) => theme.textL3};
  margin: 20px 0 0 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 14px;
    `}
`

const VaultsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  flex: 1;
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
  return (
    <VaultsContainer>
      <ScrollPageContent>
        <VaultsContentWrapper>
          <VaultsHeader>
            <VaultsHeaderLeft>
              <VaultsTitleWrapper>
                <VaultsTitleLine1>
                  <Trans>From Chat to Vault</Trans>
                </VaultsTitleLine1>
                <VaultsTitleLine2>
                  <Trans>Powered by Starchild AI</Trans>
                </VaultsTitleLine2>
                <VaultsSubtitle>
                  <Trans>Each strategy begins with 1,000 USDC.</Trans>
                </VaultsSubtitle>
              </VaultsTitleWrapper>
              <MyVaultStats />
            </VaultsHeaderLeft>

            <VaultsHeaderRight>
              <VaultsWalletConnect />
              <VaultOverview />
            </VaultsHeaderRight>
          </VaultsHeader>

          <VaultsContent>
            {/* Leaderboard */}
            <Leaderboard />

            {/* Protocol Vaults */}
            <ProtocolSection>
              <ProtocolVaults />
            </ProtocolSection>

            {/* Community Vaults */}
            <CommunitySection>
              <CommunityVaults />
            </CommunitySection>
          </VaultsContent>
        </VaultsContentWrapper>
      </ScrollPageContent>
    </VaultsContainer>
  )
})

Vaults.displayName = 'Vaults'

export default Vaults
