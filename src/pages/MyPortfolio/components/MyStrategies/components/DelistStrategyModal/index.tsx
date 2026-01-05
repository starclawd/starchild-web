import styled, { css } from 'styled-components'
import Modal from 'components/Modal'
import BottomSheet from 'components/BottomSheet'
import { useDelistStrategyModalToggle, useIsMobile, useModalOpen } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { Trans } from '@lingui/react/macro'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { memo, useCallback, useState } from 'react'
import { vm } from 'pages/helper'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useTheme } from 'store/themecache/hooks'
import { IconBase } from 'components/Icons'
import Pending from 'components/Pending'
import { useCurrentStrategyId, useDelistStrategy, useMyStrategies } from 'store/mystrategy/hooks/useMyStrategies'
import { useAppKitAccount } from '@reown/appkit/react'
const DelistStrategyModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 380px;
  max-height: calc(100vh - 40px);
  border-radius: 24px;
  padding: 0 20px;
  background: ${({ theme }) => theme.black800};
  backdrop-filter: blur(8px);
`

const DelistStrategyModalMobileWrapper = styled(ModalSafeAreaWrapper)`
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
  color: ${({ theme }) => theme.black0};
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
  color: ${({ theme }) => theme.black0};
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
    color: ${({ theme }) => theme.black100};
  }
  > span:nth-child(2) {
    display: flex;
    flex-direction: column;
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.black200};
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

export default memo(function DelistStrategyModal() {
  const theme = useTheme()
  const toast = useToast()
  const isMobile = useIsMobile()
  const { refetch: refetchMyStrategies } = useMyStrategies()
  const { address } = useAppKitAccount()
  const [currentStrategyId] = useCurrentStrategyId()
  const [isLoading, setIsLoading] = useState(false)
  const toggleDelistStrategyModal = useDelistStrategyModalToggle()
  const delistStrategyModalOpen = useModalOpen(ApplicationModal.DELIST_STRATEGY_MODAL)
  const triggerDelistStrategy = useDelistStrategy()

  const handleDelistStrategy = useCallback(async () => {
    if (isLoading) return
    try {
      if (address && currentStrategyId) {
        setIsLoading(true)
        const data = await triggerDelistStrategy({ strategyId: currentStrategyId, walletId: address })
        if ((data as any)?.data?.status === 'success') {
          await refetchMyStrategies()
          toast({
            title: <Trans>Strategy Discontinued</Trans>,
            description: <Trans>The vault has been closed and trading has stopped. Funds are ready for claim.</Trans>,
            status: TOAST_STATUS.SUCCESS,
            typeIcon: 'icon-arrow-bar',
            iconTheme: theme.black0,
            iconStyle: {
              transform: 'rotate(90deg)',
            },
          })
          if (delistStrategyModalOpen) {
            toggleDelistStrategyModal()
          }
        }
        setIsLoading(false)
        return data
      }
    } catch (error) {
      setIsLoading(false)
      toast({
        title: <Trans>Discontinue Failed</Trans>,
        description: <Trans>The strategy could not be discontinued. Please try again.</Trans>,
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-arrow-bar',
        iconTheme: theme.black0,
        iconStyle: {
          transform: 'rotate(90deg)',
        },
      })
      return error
    }
  }, [
    toast,
    theme,
    isLoading,
    address,
    currentStrategyId,
    refetchMyStrategies,
    triggerDelistStrategy,
    delistStrategyModalOpen,
    toggleDelistStrategyModal,
  ])

  const renderContent = () => (
    <>
      <Header>
        <Trans>Delist Strategy</Trans>
      </Header>
      <ContentWrapper>
        <ContentTitle>
          <Trans>Are you sure you want to discontinue the strategy?</Trans>
        </ContentTitle>
        <Content>
          <span>
            <Trans>Once discontinued:</Trans>
          </span>
          <span>
            <span>
              <Trans>Trading stops instantly</Trans>
            </span>
            <span>
              <Trans>All assets will be settled</Trans>
            </span>
            <span>
              <Trans>You must claim funds afterward</Trans>
            </span>
          </span>
          <span>
            <IconBase className='icon-warn' />
            <Trans>This action cannot be undone.</Trans>
          </span>
        </Content>
      </ContentWrapper>
      <BottomContent>
        <ButtonCancel onClick={toggleDelistStrategyModal}>
          <Trans>Cancel</Trans>
        </ButtonCancel>
        <ButtonConfirm $disabled={isLoading} onClick={handleDelistStrategy}>
          {isLoading ? <Pending /> : <Trans>Confirm</Trans>}
        </ButtonConfirm>
      </BottomContent>
    </>
  )

  return isMobile ? (
    <BottomSheet
      placement='mobile'
      hideClose={false}
      hideDragHandle
      isOpen={delistStrategyModalOpen}
      rootStyle={{ height: 'fit-content' }}
      onClose={toggleDelistStrategyModal}
    >
      <DelistStrategyModalMobileWrapper>{renderContent()}</DelistStrategyModalMobileWrapper>
    </BottomSheet>
  ) : (
    <Modal useDismiss isOpen={delistStrategyModalOpen} onDismiss={toggleDelistStrategyModal}>
      <DelistStrategyModalWrapper>{renderContent()}</DelistStrategyModalWrapper>
    </Modal>
  )
})
