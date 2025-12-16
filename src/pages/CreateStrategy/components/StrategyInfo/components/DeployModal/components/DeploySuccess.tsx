import { memo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'
import { ButtonBorder } from 'components/Button'
import { ANI_DURATION } from 'constants/index'

const SuccessWrapper = styled.div`
  width: 440px;
  padding: 20px;
  background: ${({ theme }) => theme.black800};
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  ${({ theme }) => theme.isMobile && `padding: ${vm(64)};`}
`

const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;

  i {
    font-size: 64px;
    color: ${({ theme }) => theme.green100};
  }

  ${({ theme }) =>
    theme.isMobile &&
    `
    width: ${vm(120)};
    height: ${vm(120)};
    margin-bottom: ${vm(48)};
    
    i {
      font-size: ${vm(56)};
    }
  `}
`

const SuccessTitle = styled.h2`
  font-size: 20px;
  line-height: 28px;
  font-weight: 500;
  color: ${({ theme }) => theme.textL1};
  margin: 20px 0 32px 0;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(36)};
    line-height: ${vm(48)};
    margin-bottom: ${vm(24)};
  `}
`

const SuccessDescription = styled.div`
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: ${({ theme }) => theme.textL2};
  margin-bottom: 48px;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(20)};
    line-height: ${vm(28)};
    margin-bottom: ${vm(64)};
  `}
`

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 12px;

  ${({ theme }) =>
    theme.isMobile &&
    `
    gap: ${vm(16)};
    margin-top: ${vm(40)};
  `}
`

const CloseButton = styled(ButtonBorder)`
  flex: 1;
  font-size: 18px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
`

const ViewVaultButton = styled(ButtonBorder)`
  flex: 1;
  font-size: 18px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.brand100};
  border-color: ${({ theme }) => theme.brand100};
`

interface DeploySuccessProps {
  onClose: () => void
  onViewVault?: () => void
}

export default memo(function DeploySuccess({ onClose, onViewVault }: DeploySuccessProps) {
  return (
    <SuccessWrapper>
      <SuccessIcon>
        <IconBase className='icon-chat-complete' />
      </SuccessIcon>

      <SuccessTitle>
        <Trans>Strategy Deployed</Trans>
      </SuccessTitle>

      <SuccessDescription>
        <Trans>Strategy orders are now mirrored to the Vault.</Trans>
        <br />
        <Trans>All trades execute and settle automatically on-chain.</Trans>
      </SuccessDescription>

      <ButtonContainer>
        <CloseButton onClick={onClose}>
          <Trans>Close</Trans>
        </CloseButton>
        <ViewVaultButton onClick={onViewVault}>
          <Trans>View vault</Trans>
        </ViewVaultButton>
      </ButtonContainer>
    </SuccessWrapper>
  )
})
