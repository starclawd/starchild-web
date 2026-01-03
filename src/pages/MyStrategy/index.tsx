import { memo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import VaultsWalletConnect from 'pages/Vaults/components/VaultsWalletConnect'
import ScrollPageContent from 'components/ScrollPageContent'
import Transactions from './components/Transactions'
import MyPerfomance from './components/MyPerfomance'
import MyAssets from './components/MyAssets'
import { useModalOpen } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'

const MyStrategyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 60px 20px 0;
  background: ${({ theme }) => theme.black900};
`

const MyStrategyContentWrapper = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  .my-strategy-scroll {
    padding: 0;
    padding-right: 0;
    padding-bottom: 12px;
  }
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

export default memo(function MyStrategy() {
  const pauseStrategyModalOpen = useModalOpen(ApplicationModal.PAUSE_STRATEGY_MODAL)
  const deleteStrategyModalOpen = useModalOpen(ApplicationModal.DELETE_STRATEGY_MODAL)
  const delistStrategyModalOpen = useModalOpen(ApplicationModal.DELIST_STRATEGY_MODAL)
  return (
    <MyStrategyWrapper>
      <MyStrategyContentWrapper>
        <ScrollPageContent className='my-strategy-scroll transparent-scroll-style'>
          <LeftContent>
            <Title>
              <Trans>My Strategies</Trans>
            </Title>
            <MyAssets />
            {/* <MyPerfomance /> */}
            {/* <MyStrategies /> */}
          </LeftContent>
        </ScrollPageContent>
        <RightContent>
          <VaultsWalletConnect />
          <Transactions />
        </RightContent>
      </MyStrategyContentWrapper>
      {/* {pauseStrategyModalOpen && <PauseStrategyModal />}
      {delistStrategyModalOpen && <DelistStrategyModal />}
      {deleteStrategyModalOpen && <DeleteStrategyModal />} */}
    </MyStrategyWrapper>
  )
})
