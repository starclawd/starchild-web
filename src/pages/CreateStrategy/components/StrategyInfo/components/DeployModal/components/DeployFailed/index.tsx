import { memo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { ANI_DURATION } from 'constants/index'

const FailedWrapper = styled.div`
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

const FailedIcon = styled.div`
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;

  i {
    font-size: 64px;
    color: ${({ theme }) => theme.ruby50};
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

const FailedTitle = styled.h2`
  font-size: 20px;
  line-height: 28px;
  font-weight: 500;
  color: ${({ theme }) => theme.black0};
  margin: 20px 0 32px 0;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(36)};
    line-height: ${vm(48)};
    margin-bottom: ${vm(64)};
  `}
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;

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
  color: ${({ theme }) => theme.black200};
`

const ResubmitButton = styled(ButtonBorder)`
  flex: 1;
  font-size: 18px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.black200};
`

interface DeployFailedProps {
  onClose: () => void
  onResubmit: () => void
}

export default memo(function DeployFailed({ onClose, onResubmit }: DeployFailedProps) {
  return (
    <FailedWrapper>
      <FailedIcon>
        <IconBase className='icon-close' />
      </FailedIcon>

      <FailedTitle>
        <Trans>Deploy Failed</Trans>
      </FailedTitle>

      <ButtonContainer>
        <CloseButton onClick={onClose}>
          <Trans>Close</Trans>
        </CloseButton>
        <ResubmitButton onClick={onResubmit}>
          <Trans>Resubmit</Trans>
        </ResubmitButton>
      </ButtonContainer>
    </FailedWrapper>
  )
})
