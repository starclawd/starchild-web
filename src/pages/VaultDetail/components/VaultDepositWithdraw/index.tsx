import { memo, useState } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { ButtonCommon, ButtonBorder } from 'components/Button'
import Modal from 'components/Modal'
import { vm } from 'pages/helper'

const DepositWithdrawContainer = styled.div`
  display: flex;
  gap: 12px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      width: 100%;
    `}
`

const DepositButton = styled(ButtonCommon)`
  min-width: 100px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex: 1;
      min-width: auto;
      padding: ${vm(10)} ${vm(16)};
      font-size: ${vm(14)};
    `}
`

const WithdrawButton = styled(ButtonBorder)`
  min-width: 100px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex: 1;
      min-width: auto;
      padding: ${vm(10)} ${vm(16)};
      font-size: ${vm(14)};
    `}
`

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  min-width: 400px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      min-width: auto;
      padding: ${vm(24)};
      gap: ${vm(24)};
    `}
`

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin: 0;
  text-align: center;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(24)};
  `}
`

const PlaceholderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px;
  background: ${({ theme }) => theme.black800};
  border: 2px dashed ${({ theme }) => theme.lineDark6};
  border-radius: 8px;
  color: ${({ theme }) => theme.textL3};
  text-align: center;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(32)};
      gap: ${vm(16)};
    `}
`

const PlaceholderText = styled.div`
  font-size: 16px;
  font-weight: 500;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(16)};
  `}
`

const PlaceholderSubText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textL4};

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(14)};
  `}
`

type ModalType = 'deposit' | 'withdraw' | null

const VaultDepositWithdraw = memo(() => {
  const [openModal, setOpenModal] = useState<ModalType>(null)

  const handleCloseModal = () => {
    setOpenModal(null)
  }

  return (
    <>
      <DepositWithdrawContainer>
        <DepositButton
          as='button'
          onClick={() => setOpenModal('deposit')}
        >
          <Trans>Deposit</Trans>
        </DepositButton>
        <WithdrawButton
          as='button'
          onClick={() => setOpenModal('withdraw')}
        >
          <Trans>Withdraw</Trans>
        </WithdrawButton>
      </DepositWithdrawContainer>

      <Modal
        isOpen={openModal === 'deposit'}
        onDismiss={handleCloseModal}
      >
        <ModalContent>
          <ModalTitle><Trans>Deposit to Vault</Trans></ModalTitle>
          <PlaceholderContent>
            <PlaceholderText>
              <Trans>Deposit Interface Coming Soon</Trans>
            </PlaceholderText>
            <PlaceholderSubText>
              <Trans>This will allow you to deposit USDC into the vault</Trans>
            </PlaceholderSubText>
          </PlaceholderContent>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={openModal === 'withdraw'}
        onDismiss={handleCloseModal}
      >
        <ModalContent>
          <ModalTitle><Trans>Withdraw from Vault</Trans></ModalTitle>
          <PlaceholderContent>
            <PlaceholderText>
              <Trans>Withdraw Interface Coming Soon</Trans>
            </PlaceholderText>
            <PlaceholderSubText>
              <Trans>This will allow you to withdraw your funds from the vault</Trans>
            </PlaceholderSubText>
          </PlaceholderContent>
        </ModalContent>
      </Modal>
    </>
  )
})

VaultDepositWithdraw.displayName = 'VaultDepositWithdraw'

export default VaultDepositWithdraw
