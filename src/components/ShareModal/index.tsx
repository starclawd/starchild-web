import Modal from 'components/Modal'
import { memo } from 'react'
import styled from 'styled-components'
import { useModalOpen, useShareStrategyModalToggle } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import logo from 'assets/png/logo.png'
import { Trans } from '@lingui/react/macro'
import VibeItem from 'pages/Vaults/components/StrategyTable/components/VibeItem'
import { useCurrentShareStrategyData } from 'store/vaultsdetail/hooks/useCurrentShareStrategyData'

const ShareModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 640px;
`

const ShareContent = styled.div`
  display: flex;
  border-radius: 8px;
  background: ${({ theme }) => theme.black900};
`

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 100%;
  padding: 20px;
  gap: 40px;
  .logo {
    width: 32px;
    height: 32px;
  }
`

const StrategyBaseInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const StrategyName = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  color: ${({ theme }) => theme.black0};
`

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 240px;
  height: 100%;
  padding: 16px;
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 82px;
`

export default memo(function ShareModal() {
  const [currentShareStrategyData] = useCurrentShareStrategyData()
  const shareStrategyModalOpen = useModalOpen(ApplicationModal.SHARE_STRATEGY_MODAL)
  const toggleShareStrategyModal = useShareStrategyModalToggle()
  const vibe = currentShareStrategyData?.vibe || ''
  const strategyName = currentShareStrategyData?.strategy_name
  if (!currentShareStrategyData) {
    return null
  }
  return (
    <Modal useDismiss isOpen={shareStrategyModalOpen} onDismiss={toggleShareStrategyModal}>
      <ShareModalWrapper>
        <ShareContent>
          <LeftSection>
            <img className='logo' src={logo} alt='logo' />
            <StrategyBaseInfo>
              <StrategyName>{strategyName}</StrategyName>
              <VibeItem colorType='brand' text={vibe} size='big' />
            </StrategyBaseInfo>
          </LeftSection>
          <RightSection></RightSection>
        </ShareContent>
        <Footer></Footer>
      </ShareModalWrapper>
    </Modal>
  )
})
