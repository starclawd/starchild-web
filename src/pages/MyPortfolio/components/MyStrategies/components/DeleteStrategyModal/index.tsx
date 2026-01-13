import styled, { css } from 'styled-components'
import Modal, {
  CommonModalContent,
  CommonModalContentWrapper,
  CommonModalFooter,
  CommonModalHeader,
} from 'components/Modal'
import BottomSheet from 'components/BottomSheet'
import { useDeleteStrategyModalToggle, useIsMobile, useModalOpen } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { Trans } from '@lingui/react/macro'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { memo, useCallback, useState } from 'react'
import { vm } from 'pages/helper'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useTheme } from 'store/themecache/hooks'
import { IconBase } from 'components/Icons'
import { useCurrentStrategyId, useDeleteStrategy, useMyStrategies } from 'store/mystrategy/hooks/useMyStrategies'
import Pending from 'components/Pending'
const DeleteStrategyModalWrapper = styled(CommonModalContentWrapper)`
  width: 380px;
`

const DeleteStrategyModalMobileWrapper = styled(ModalSafeAreaWrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 ${vm(12)};
  background: transparent;
  /* 移除背景和模糊效果，因为 BottomSheet 会提供 */
`

const Header = styled(CommonModalHeader)``

const ContentWrapper = styled(CommonModalContent)``

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
  background: ${({ theme }) => theme.black1000};
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

const BottomContent = styled(CommonModalFooter)``

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

export default memo(function DeleteStrategyModal() {
  const theme = useTheme()
  const toast = useToast()
  const isMobile = useIsMobile()
  const { refetch: refetchMyStrategies } = useMyStrategies()
  const [currentStrategyId] = useCurrentStrategyId()
  const [isLoading, setIsLoading] = useState(false)
  const toggleDeleteStrategyModal = useDeleteStrategyModalToggle()
  const deleteStrategyModalOpen = useModalOpen(ApplicationModal.DELETE_STRATEGY_MODAL)
  const triggerDeleteStrategy = useDeleteStrategy()
  const handleDeleteStrategy = useCallback(async () => {
    if (isLoading) return
    try {
      if (currentStrategyId) {
        setIsLoading(true)
        const data = await triggerDeleteStrategy(currentStrategyId)
        if ((data as any)?.data?.status === 'success') {
          await refetchMyStrategies()
          toast({
            title: <Trans>Strategy deleted</Trans>,
            description: <Trans>This strategy has been successfully deleted.</Trans>,
            status: TOAST_STATUS.SUCCESS,
            typeIcon: 'icon-delete',
            iconTheme: theme.black0,
          })
          if (deleteStrategyModalOpen) {
            toggleDeleteStrategyModal()
          }
        }
        setIsLoading(false)
        return data
      }
    } catch (error) {
      setIsLoading(false)
      toast({
        title: <Trans>Delete Failed</Trans>,
        description: <Trans>Unable to delete the strategy. Please try again.</Trans>,
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-delete',
        iconTheme: theme.black0,
      })
      return error
    }
  }, [
    toast,
    theme,
    isLoading,
    currentStrategyId,
    refetchMyStrategies,
    triggerDeleteStrategy,
    deleteStrategyModalOpen,
    toggleDeleteStrategyModal,
  ])

  const renderContent = () => (
    <>
      <Header>
        <Trans>Delete Strategy</Trans>
      </Header>
      <ContentWrapper>
        <ContentTitle>
          <Trans>Are you sure you want to delete the strategy?</Trans>
        </ContentTitle>
        <Content>
          <span>
            <Trans>If you delete this strategy:</Trans>
          </span>
          <span>
            <span>Paper trading will stop immediately.</span>
            <span>The strategy will be permanently archived.</span>
          </span>
          <span>
            <IconBase className='icon-warn' />
            <Trans>This action cannot be undone.</Trans>
          </span>
        </Content>
      </ContentWrapper>
      <BottomContent>
        <ButtonCancel onClick={toggleDeleteStrategyModal}>
          <Trans>Cancel</Trans>
        </ButtonCancel>
        <ButtonConfirm $disabled={isLoading} onClick={handleDeleteStrategy}>
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
      isOpen={deleteStrategyModalOpen}
      rootStyle={{ height: 'fit-content' }}
      onClose={toggleDeleteStrategyModal}
    >
      <DeleteStrategyModalMobileWrapper>{renderContent()}</DeleteStrategyModalMobileWrapper>
    </BottomSheet>
  ) : (
    <Modal useDismiss isOpen={deleteStrategyModalOpen} onDismiss={toggleDeleteStrategyModal}>
      <DeleteStrategyModalWrapper>{renderContent()}</DeleteStrategyModalWrapper>
    </Modal>
  )
})
