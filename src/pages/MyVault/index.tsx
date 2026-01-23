import styled from 'styled-components'
import MyAssets from './components/MyAssets'
import { Trans } from '@lingui/react/macro'
import MyPerfomance from './components/MyPerfomance'
import VaultsWalletConnect from 'pages/Vaults/components/VaultsWalletConnect'
import { memo } from 'react'

const MyVaultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 60px 20px 0;
  background: ${({ theme }) => theme.black900};
`

const MyVaultsContentWrapper = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
`

const ScrollPageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  width: 100%;
  height: 100%;
  padding-bottom: 12px;
`

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  gap: 40px;
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

export default memo(function MyVault() {
  return (
    <MyVaultsWrapper>
      <MyVaultsContentWrapper>
        <ScrollPageContent className='scroll-style transparent-scroll-style'>
          <LeftContent>
            <Title>
              <Trans>My Vault Portfolio</Trans>
            </Title>
            <MyAssets />
            <MyPerfomance />
            {/* <MyVaults /> */}
          </LeftContent>
        </ScrollPageContent>
        <RightContent>
          <VaultsWalletConnect />
          {/* <Transactions /> */}
        </RightContent>
      </MyVaultsContentWrapper>
    </MyVaultsWrapper>
  )
})
