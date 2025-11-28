import styled from 'styled-components'
import MyAssets from './components/MyAssets'
import { Trans } from '@lingui/react/macro'
import MyPerfomance from './components/MyPerfomance'
import MyVaults from './components/MyVaults'
import Transactions from './components/Transactions'
import VaultsWalletConnect from 'pages/Vaults/components/VaultsWalletConnect'
const PortfolioWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 60px 20px;
  background: ${({ theme }) => theme.black900};
`

const PortfolioContentWrapper = styled.div`
  display: flex;
  gap: 32px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 728px;
`

const Title = styled.div`
  font-size: 48px;
  font-style: normal;
  font-weight: 500;
  line-height: 56px;
  color: ${({ theme }) => theme.white};
`

const RightContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 440px;
`

export default function Portfolio() {
  return (
    <PortfolioWrapper>
      <PortfolioContentWrapper>
        <LeftContent>
          <Title>
            <Trans>My portfolio</Trans>
          </Title>
          <MyAssets />
          <MyPerfomance />
          <MyVaults />
        </LeftContent>
        <RightContent>
          <VaultsWalletConnect />
          <Transactions />
        </RightContent>
      </PortfolioContentWrapper>
    </PortfolioWrapper>
  )
}
