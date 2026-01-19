import { memo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import StrategyTable from './components/StrategyTable'
import Leaderboard from './components/Leaderboard'
import CreateStrategy from './components/CreateStrategy'
import vaultsBg from 'assets/vaults/vault-bg.png'
import { ANI_DURATION } from 'constants/index'

const VaultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const InnerContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 1220px;
`

const VaultsHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  flex-shrink: 0;
  width: 100%;
  height: 362px;
  padding: 40px;
  background-size: auto 100%;
  background-position: center;
  background-repeat: no-repeat;
  transition: all ${ANI_DURATION}s;
  ${({ theme }) => theme.mediaMaxWidth.width1280`
    padding: 40px 20px;
  `}
`

const VaultsHeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
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
  ${({ theme }) => theme.mediaMaxWidth.width1440`
    font-size: 64px;
    font-style: normal;
    font-weight: 500;
    line-height: 72px;
  `}
  ${({ theme }) => theme.mediaMaxWidth.width1280`
    font-size: 56px;
    font-style: normal;
    font-weight: 500;
    line-height: 64px; 
  `}
`

const VaultsContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Vaults = memo(() => {
  return (
    <VaultsContainer className='scroll-style'>
      <InnerContent>
        <VaultsHeader style={{ backgroundImage: `url(${vaultsBg})` }}>
          <VaultsHeaderTop>
            <VaultsTitleWrapper>
              <VaultsTitleLine1>
                <Trans>Vibe it, Earn it.</Trans>
              </VaultsTitleLine1>
            </VaultsTitleWrapper>

            <CreateStrategy />
          </VaultsHeaderTop>
          <Leaderboard />
        </VaultsHeader>

        <VaultsContent>
          <StrategyTable />
        </VaultsContent>
      </InnerContent>
    </VaultsContainer>
  )
})

Vaults.displayName = 'Vaults'

export default Vaults
