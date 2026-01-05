import { memo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import StrategyTable from './components/StrategyTable'
import Leaderboard from './components/Leaderboard'
import CreateStrategy from './components/CreateStrategy'
import vaultsBg from 'assets/vaults/vault-bg.png'

const VaultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto;
`

const VaultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  height: 420px;
  padding: 40px;
  gap: 40px;
  background-size: auto 100%;
  background-position: center;
  background-repeat: no-repeat;
`

const VaultsHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 44px;
`

const VaultsTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const VaultsTitleLine1 = styled.div`
  width: fit-content;
  font-size: 80px;
  font-style: normal;
  font-weight: 500;
  line-height: 88px;
  font-family: 'PowerGrotesk';
  background: linear-gradient(90deg, rgba(248, 70, 0, 0.98) 0%, rgba(255, 255, 255, 0.98) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const VaultsTitleLine2 = styled.div`
  font-size: 80px;
  font-style: normal;
  font-weight: 500;
  line-height: 88px;
  font-family: 'PowerGrotesk';
  color: ${({ theme }) => theme.white};
`

const VaultsContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Vaults = memo(() => {
  return (
    <VaultsContainer className='scroll-style'>
      <VaultsHeader style={{ backgroundImage: `url(${vaultsBg})` }}>
        <VaultsHeaderLeft>
          <VaultsTitleWrapper>
            <VaultsTitleLine1>
              <Trans>Vibe Trading</Trans>
            </VaultsTitleLine1>
            <VaultsTitleLine2>
              <Trans>Do less, earn more.</Trans>
            </VaultsTitleLine2>
          </VaultsTitleWrapper>

          <Leaderboard />
        </VaultsHeaderLeft>
        <CreateStrategy />
      </VaultsHeader>

      <VaultsContent>
        <StrategyTable />
      </VaultsContent>
    </VaultsContainer>
  )
})

Vaults.displayName = 'Vaults'

export default Vaults
