import { memo } from 'react'
import styled, { useTheme } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { useDeployment } from 'store/createstrategy/hooks/useDeployment'
import { DEPLOYING_STATUS, DeployStepStatusType } from 'store/createstrategy/createstrategy'
import { IconBase } from 'components/Icons'
import { rotate } from 'styles/animationStyled'
import { ButtonCommon } from 'components/Button'
import { ANI_DURATION } from 'constants/index'
import { t } from '@lingui/core/macro'

const StepsWrapper = styled.div`
  width: 480px;
  padding: 20px;
  background: ${({ theme }) => theme.black800};
  border-radius: 12px;
  position: relative;

  ${({ theme }) => theme.isMobile && `padding: ${vm(32)};`}
`

const MainTitle = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin: 0 0 32px 0;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(32)};
    margin: 0 0 ${vm(32)} 0;
  `}
`

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`

const StepItem = styled.div<{ $status: DeployStepStatusType }>`
  display: flex;
  align-items: flex-start;
  padding: 24px 0 24px 40px;
  position: relative;

  &:first-child::after {
    content: '';
    position: absolute;
    left: 18px;
    top: 33px;
    height: 200%;
    width: 1px;
    border-left: 1px dashed ${({ theme }) => theme.text10};
    z-index: 1;
  }

  ${({ theme }) =>
    theme.isMobile &&
    `
    padding: ${vm(24)} 0 ${vm(24)} ${vm(40)};
    
    &:not(:last-child)::before {
      left: ${vm(18)};
    }
  `}
`

const StepIcon = styled.div<{ $status: DeployStepStatusType }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  position: absolute;
  left: 9px;
  flex-shrink: 0;
  z-index: 2;

  i {
    font-size: 18px;
  }

  .icon-loading {
    animation: ${rotate} 1s linear infinite;
  }

  ${({ theme }) =>
    theme.isMobile &&
    `
    width: ${vm(18)};
    height: ${vm(18)};
    i {
      font-size: ${vm(18)};
    }
    left: ${vm(6)};
    
  `}
`

const StepContent = styled.div`
  flex: 1;
  min-width: 0;

  ${({ theme }) =>
    theme.isMobile &&
    `
  `}
`

const StepNumber = styled.div<{ $status: DeployStepStatusType }>`
  font-size: 14px;
  color: ${({ $status, theme }) => {
    switch ($status) {
      case 'in_progress':
        return '#FF6B47'
      default:
        return theme.textL2
    }
  }};
  margin-bottom: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(14)};
    margin-bottom: ${vm(8)};
  `}
`

const StepTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin: 0 0 8px 0;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(20)};
    margin: 0 0 ${vm(8)} 0;
  `}
`

const StepDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.textL2};
  line-height: 1.5;
  margin: 0 0 16px 0;
  word-wrap: break-word;
  word-break: break-word;
  max-width: 100%;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(14)};
    margin: 0 0 ${vm(16)} 0;
  `}
`

const ActionButton = styled(ButtonCommon)`
  width: fit-content;
  padding: 0 12px;
  height: 28px;
  font-size: 11px;
  font-weight: 400;
  line-height: 16px;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.textL1};
  border-radius: 60px;
  background: ${({ theme }) => theme.brand100};
  &:disabled {
    background: ${({ theme }) => theme.textL4};
    cursor: not-allowed;
  }

  ${({ theme }) =>
    theme.isMobile &&
    `
    padding: ${vm(12)} ${vm(24)};
    font-size: ${vm(14)};
  `}
`

interface DeployStepsProps {
  onClose: () => void
  strategyId: string
}

export default memo(function DeploySteps({ onClose, strategyId }: DeployStepsProps) {
  const { deployingStatus, executeStep1, executeStep2, executeStep3 } = useDeployment(strategyId)
  const theme = useTheme()

  const getStepStatus = (stepNumber: number): DeployStepStatusType => {
    switch (deployingStatus) {
      case DEPLOYING_STATUS.NONE:
        return stepNumber === 1 ? 'can_start' : 'not_started'
      case DEPLOYING_STATUS.STEP1_IN_PROGRESS:
        if (stepNumber === 1) return 'in_progress'
        return 'not_started'
      case DEPLOYING_STATUS.STEP1_SUCCESS:
        if (stepNumber === 1) return 'completed'
        if (stepNumber === 2) return 'can_start'
        return 'not_started'
      case DEPLOYING_STATUS.STEP1_FAILED:
        if (stepNumber === 1) return 'failed'
        return 'not_started'
      case DEPLOYING_STATUS.STEP2_IN_PROGRESS:
        if (stepNumber === 1) return 'completed'
        if (stepNumber === 2) return 'in_progress'
        return 'not_started'
      case DEPLOYING_STATUS.STEP2_SUCCESS:
        if (stepNumber === 1) return 'completed'
        if (stepNumber === 2) return 'completed'
        if (stepNumber === 3) return 'can_start'
        return 'not_started'
      case DEPLOYING_STATUS.STEP2_FAILED:
        if (stepNumber === 1) return 'completed'
        if (stepNumber === 2) return 'failed'
        return 'not_started'
      case DEPLOYING_STATUS.STEP3_IN_PROGRESS:
        if (stepNumber <= 2) return 'completed'
        if (stepNumber === 3) return 'in_progress'
        return 'not_started'
      case DEPLOYING_STATUS.STEP3_SUCCESS:
        return 'completed'
      case DEPLOYING_STATUS.STEP3_FAILED:
        if (stepNumber <= 2) return 'completed'
        if (stepNumber === 3) return 'failed'
        return 'not_started'
      default:
        return 'not_started'
    }
  }

  const renderStatusIcon = (status: DeployStepStatusType, theme: any) => {
    switch (status) {
      case 'completed':
        return <IconBase className='icon-chat-complete' style={{ color: theme.brand100 }} />
      case 'in_progress':
        return <IconBase className='icon-loading' style={{ color: theme.brand100 }} />
      case 'failed':
        return <IconBase className='icon-chat-close' style={{ color: theme.ruby50 }} />
      case 'not_started':
        return (
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: theme.text20,
            }}
          />
        )
      default:
        return (
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: theme.text20,
            }}
          />
        )
    }
  }

  const getStepInfo = () => [
    {
      stepName: t`Initialize Strategy Trading Account`,
      title: t`Create Trading Account`,
      description: t`This step creates a unique account ID for your strategy and enables trading permissions.`,
    },
    {
      stepName: t`Seed Strategy Margin`,
      title: t`Deposit 1000 USDC`,
      description: t`Deposit initial capital (1,000 USDC) into the Agent's Master Account to activate trading logic.`,
    },
    {
      stepName: t`Ignite On-Chain Vault`,
      title: t`Deploy Vault Contract`,
      description: t`Deploy the smart contract that mirrors your Agent's signals. Retail users will deposit into this Vault.`,
    },
  ]

  const handleStep1Click = () => {
    executeStep1(strategyId)
  }

  const handleStep2Click = () => {
    executeStep2()
  }

  const handleStep3Click = () => {
    executeStep3(strategyId)
  }

  return (
    <StepsWrapper>
      <MainTitle>
        <Trans>Activity</Trans>
      </MainTitle>

      <StepsContainer>
        {getStepInfo().map((stepInfo, index) => {
          const stepNumber = index + 1
          const status = getStepStatus(stepNumber)

          return (
            <StepItem key={stepNumber} $status={status}>
              <StepIcon $status={status}>{renderStatusIcon(status, theme)}</StepIcon>

              <StepContent>
                <StepNumber $status={status}>
                  Step {stepNumber} — {stepInfo.stepName}
                </StepNumber>

                <StepTitle>{stepInfo.title}</StepTitle>

                <StepDescription>{stepInfo.description}</StepDescription>

                {stepNumber === 1 && (status === 'failed' || status === 'can_start' || status === 'in_progress') && (
                  <ActionButton onClick={handleStep1Click}>
                    <Trans>Create</Trans>
                  </ActionButton>
                )}

                {stepNumber === 2 && (status === 'failed' || status === 'can_start') && (
                  <ActionButton onClick={handleStep2Click}>
                    <Trans>Deposit</Trans>
                  </ActionButton>
                )}

                {stepNumber === 3 && (status === 'failed' || status === 'can_start') && (
                  <ActionButton onClick={handleStep3Click}>
                    <Trans>Deploy</Trans>
                  </ActionButton>
                )}
              </StepContent>
            </StepItem>
          )
        })}
      </StepsContainer>
    </StepsWrapper>
  )
})
