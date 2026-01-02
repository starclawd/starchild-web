import { memo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import StrategyTable from './components/StrategyTable'
import Leaderboard from './components/Leaderboard'
import CreateStrategy from './components/CreateStrategy'

const VaultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const VaultsHeader = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 64px;
  width: 100%;
  height: 480px;
  background-color: ${({ theme }) => theme.black800};
`

const VaultsHeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 20px 0 40px;
`

const VaultsTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 80px;
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
  padding: 20px 40px;
`

const Vaults = memo(() => {
  return (
    <VaultsContainer className='scroll-style'>
      <VaultsHeader>
        <VaultsHeaderTop>
          <VaultsTitleWrapper>
            <VaultsTitleLine1>
              <Trans>Vibe Trading</Trans>
            </VaultsTitleLine1>
            <VaultsTitleLine2>
              <Trans>Do less, earn more.</Trans>
            </VaultsTitleLine2>
          </VaultsTitleWrapper>
          <CreateStrategy />
        </VaultsHeaderTop>
        <Leaderboard />
      </VaultsHeader>

      <VaultsContent>
        <StrategyTable />
      </VaultsContent>
    </VaultsContainer>
  )
})

Vaults.displayName = 'Vaults'

export default Vaults
