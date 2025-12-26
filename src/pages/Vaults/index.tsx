import { memo } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import MyVaultStats from './components/MyVaultStats'
import Leaderboard from './components/Leaderboard'
import VaultsWalletConnect from './components/VaultsWalletConnect'
import ScrollPageContent from 'components/ScrollPageContent'
import StrategyList from './components/StrategyList'
import MyStrateyStats from './components/MyStrateyStats'

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
  flex-grow: 1;
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
  width: fit-content;
  font-size: 52px;
  font-style: normal;
  font-weight: 500;
  line-height: 64px;
  margin: 0;
  background: linear-gradient(90deg, rgba(248, 70, 0, 0.98) 0%, rgba(255, 255, 255, 0.98) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 24px;
    `}
`

const VaultsTitleLine2 = styled.h1`
  font-size: 52px;
  font-style: normal;
  font-weight: 100;
  line-height: 64px;
  color: ${({ theme }) => theme.white};
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

const Vaults = memo(() => {
  return (
    <VaultsContainer>
      <ScrollPageContent>
        <VaultsContentWrapper>
          <VaultsHeader>
            <VaultsHeaderLeft>
              <VaultsTitleWrapper>
                <VaultsTitleLine1>
                  <Trans>Vibe Trading</Trans>
                </VaultsTitleLine1>
                <VaultsTitleLine2>
                  <Trans>Turn Thought into Alpha</Trans>
                </VaultsTitleLine2>
                {/* <VaultsSubtitle>
                  <Trans>Each strategy begins with 1,000 USDC.</Trans>
                </VaultsSubtitle> */}
              </VaultsTitleWrapper>
              {/* <MyVaultStats /> */}
            </VaultsHeaderLeft>

            <VaultsHeaderRight>
              {/* <VaultsWalletConnect /> */}
              <MyStrateyStats />
            </VaultsHeaderRight>
          </VaultsHeader>

          <VaultsContent>
            {/* <Leaderboard /> */}

            <StrategyList />
          </VaultsContent>
        </VaultsContentWrapper>
      </ScrollPageContent>
    </VaultsContainer>
  )
})

Vaults.displayName = 'Vaults'

export default Vaults
