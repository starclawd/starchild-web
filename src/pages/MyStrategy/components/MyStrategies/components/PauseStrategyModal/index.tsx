import styled, { css } from 'styled-components'
import Modal from 'components/Modal'
import BottomSheet from 'components/BottomSheet'
import { usePauseStrategyModalToggle, useIsMobile, useModalOpen } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { Trans } from '@lingui/react/macro'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { memo, useState } from 'react'
import { vm } from 'pages/helper'
import useToast from 'components/Toast'
import { useTheme } from 'store/themecache/hooks'
import { IconBase } from 'components/Icons'
const PauseStrategyModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 380px;
  max-height: calc(100vh - 40px);
  border-radius: 24px;
  padding: 0 20px;
  background: ${({ theme }) => theme.black800};
  backdrop-filter: blur(8px);
`

const PauseStrategyModalMobileWrapper = styled(ModalSafeAreaWrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 ${vm(12)};
  background: transparent;
  /* 移除背景和模糊效果，因为 BottomSheet 会提供 */
`

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px 0 8px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(20)} ${vm(8)} ${vm(8)};
      font-size: 0.2rem;
      line-height: 0.28rem;
    `}
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 20px 0;
`

const ContentTitle = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.textL1};
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.black900};
  > span:first-child {
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL2};
  }
  > span:nth-child(2) {
    display: flex;
    flex-direction: column;
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL3};
    > span {
      display: flex;
      align-items: center;
      padding-left: 6px;
      &::before {
        content: '•';
        margin-right: 6px;
      }
    }
  }
  > span:nth-child(3) {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.orange200};
    .icon-warn {
      font-size: 14px;
      color: ${({ theme }) => theme.orange200};
    }
  }
`

const BottomContent = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px 0 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      padding: ${vm(8)} ${vm(8)} ${vm(20)};
    `}
`

const ButtonCancel = styled(ButtonBorder)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  width: 50%;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(40)};
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

const ButtonConfirm = styled(ButtonCommon)<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  width: 50%;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(40)};
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

export default memo(function PauseStrategyModal() {
  const theme = useTheme()
  const toast = useToast()
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = useState(false)
  const togglePauseStrategyModal = usePauseStrategyModalToggle()
  const pauseStrategyModalOpen = useModalOpen(ApplicationModal.PAUSE_STRATEGY_MODAL)

  const renderContent = () => (
    <>
      <Header>
        <Trans>Pause Strategy</Trans>
      </Header>
      <ContentWrapper>
        <ContentTitle>
          <Trans>Are you sure you want to pause the strategy?</Trans>
        </ContentTitle>
        <Content>
          <span>
            <Trans>Once paused:</Trans>
          </span>
          <span>
            <span>
              <Trans>Trading stops immediately</Trans>
            </span>
            <span>
              <Trans>All positions close at market</Trans>
            </span>
            <span>
              <Trans>Vault becomes 100% cash</Trans>
            </span>
          </span>
          <span>
            <IconBase className='icon-warn' />
            <Trans>This action can be resumed later.</Trans>
          </span>
        </Content>
      </ContentWrapper>
      <BottomContent>
        <ButtonCancel onClick={togglePauseStrategyModal}>
          <Trans>Cancel</Trans>
        </ButtonCancel>
        <ButtonConfirm>
          <Trans>Confirm</Trans>
        </ButtonConfirm>
      </BottomContent>
    </>
  )

  return isMobile ? (
    <BottomSheet
      placement='mobile'
      hideClose={false}
      hideDragHandle
      isOpen={pauseStrategyModalOpen}
      rootStyle={{ height: 'fit-content' }}
      onClose={togglePauseStrategyModal}
    >
      <PauseStrategyModalMobileWrapper>{renderContent()}</PauseStrategyModalMobileWrapper>
    </BottomSheet>
  ) : (
    <Modal useDismiss isOpen={pauseStrategyModalOpen} onDismiss={togglePauseStrategyModal}>
      <PauseStrategyModalWrapper>{renderContent()}</PauseStrategyModalWrapper>
    </Modal>
  )
})
