import { memo, useCallback } from 'react'
import styled, { useTheme } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { useDeployment } from 'store/createstrategy/hooks/useDeployment'
import { useDeployStrategyId } from 'store/application/hooks'
import { DEPLOYING_STATUS, DeployStepStatusType } from 'store/createstrategy/createstrategy'
import { IconBase } from 'components/Icons'
import { rotate } from 'styles/animationStyled'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { ANI_DURATION } from 'constants/index'
import { t } from '@lingui/core/macro'
import { goOutPageDirect } from 'utils/url'
import { Chain, CHAIN_ID, CHAIN_ID_TO_CHAIN } from 'constants/chainInfo'
import { getExplorerLink } from 'utils'
import Pending from 'components/Pending'

const StepsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 480px;
  padding: 20px;
  border-radius: 8px;
  background: ${({ theme }) => theme.black900};
`

const MainTitle = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px;
  color: ${({ theme }) => theme.black0};

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
  gap: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    `
    gap: ${vm(16)};
    padding-bottom: ${vm(32)};
  `}
`

const StepLeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 18px;
  position: relative;

  ${({ theme }) =>
    theme.isMobile &&
    `
    width: ${vm(36)};
  `}
`

const StepLine = styled.div`
  width: 1px;
  flex: 1;
  border-left: 1px dashed ${({ theme }) => theme.black600};
  margin-top: 9px;
  margin-left: auto;
  margin-right: auto;

  ${({ theme }) =>
    theme.isMobile &&
    `
    margin-top: ${vm(9)};
  `}
`

const StepIcon = styled.div`
  margin-top: 1px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;

  i {
    font-size: 18px;
  }

  ${({ theme }) =>
    theme.isMobile &&
    `
    width: ${vm(18)};
    height: ${vm(18)};
    i {
      font-size: ${vm(18)};
    }
  `}
`

const StepContent = styled.div`
  display: flex;
  flex-direction: column;

  .block-explorer-button {
    margin-top: 8px;
    width: fit-content;
    height: 28px;
    font-size: 11px;
    line-height: 16px;
    font-weight: 400;
    color: ${({ theme }) => theme.black300};
    border-radius: 32px;
    padding: 6px 12px;
  }

  ${({ theme }) =>
    theme.isMobile &&
    `
  `}
`

const StepNumber = styled.div<{ $status: DeployStepStatusType }>`
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: ${({ $status, theme }) => {
    switch ($status) {
      case 'in_progress':
        return theme.brand100
      case 'failed':
        return theme.ruby50
      default:
        return theme.black200
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

const StepDescription = styled.p`
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;
  color: ${({ theme }) => theme.black300};
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
  height: 28px;
  font-size: 11px;
  font-weight: 400;
  line-height: 16px;
  .icon-loading {
    color: ${({ theme }) => theme.black0};
  }

  &:disabled {
    background: ${({ theme }) => theme.black300};
    cursor: not-allowed;
  }

  .icon-loading {
    animation: ${rotate} 1s linear infinite;
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
}

export default memo(function DeploySteps({ onClose }: DeployStepsProps) {
  const strategyId = useDeployStrategyId()
  const { deployingStatus, executeStep1, executeStep2, executeStep3, deployChainId, deployTxid } = useDeployment(
    strategyId || '',
  )
  const theme = useTheme()

  // 判断按钮是否处于loading状态
  const isStep1Loading = deployingStatus === DEPLOYING_STATUS.STEP1_IN_PROGRESS
  const isStep2Loading = deployingStatus === DEPLOYING_STATUS.STEP2_IN_PROGRESS
  const isStep3Loading = deployingStatus === DEPLOYING_STATUS.STEP3_IN_PROGRESS

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
        return <IconBase className='icon-complete' style={{ color: theme.brand100 }} />
      case 'in_progress':
        return <Pending />
      case 'failed':
        return <IconBase className='icon-close' style={{ color: theme.ruby50 }} />
      case 'not_started':
        return (
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: theme.black500,
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
              backgroundColor: theme.black500,
            }}
          />
        )
    }
  }

  const getStepInfo = () => [
    // {
    //   stepName: t`Create a Strategy Trading Account`,
    //   description: t`This step creates a unique account ID for your strategy and enables trading permissions.`,
    // },
    // {
    //   stepName: t`Deposit 1000 USDC as Strategy Margin`,
    //   description: t`Deposit initial capital (1,000 USDC) into the Agent's Master Account to activate trading logic.`,
    // },
    {
      stepName: t`Deploy the On-Chain Vault Contract`,
      description: t`Deploy the smart contract that mirrors your Agent's signals. Retail users will deposit into this Vault.`,
    },
  ]

  const handleStep1Click = useCallback(() => {
    executeStep1(strategyId || '')
  }, [executeStep1, strategyId])

  const handleStep2Click = useCallback(() => {
    executeStep2()
  }, [executeStep2])

  const handleStep3Click = useCallback(() => {
    executeStep3(strategyId || '')
  }, [executeStep3, strategyId])

  const handleBlockExplorerClick = useCallback(() => {
    if (deployChainId && deployTxid) {
      const numericChainId = parseInt(deployChainId)
      const chain = CHAIN_ID_TO_CHAIN[numericChainId] || Chain.ARBITRUM_SEPOLIA // fallback
      goOutPageDirect(`${getExplorerLink(chain, deployTxid)}`)
    }
  }, [deployChainId, deployTxid])

  return (
    <StepsWrapper>
      <MainTitle>
        <Trans>Activity</Trans>
      </MainTitle>

      <StepsContainer>
        {getStepInfo().map((stepInfo, index) => {
          const stepNumber = index + 1
          const status = getStepStatus(stepNumber)
          const isLast = index === getStepInfo().length - 1

          return (
            <StepItem key={stepNumber} $status={status}>
              <StepLeftSection>
                <StepIcon>{renderStatusIcon(status, theme)}</StepIcon>
              </StepLeftSection>

              <StepContent>
                <StepNumber $status={status}>
                  {/* Step {stepNumber} — {stepInfo.stepName} */}
                  {stepInfo.stepName}
                </StepNumber>
                <StepDescription>{stepInfo.description}</StepDescription>

                {stepNumber === 1 && (status === 'failed' || status === 'can_start') && (
                  <ActionButton onClick={handleStep3Click} $disabled={isStep3Loading}>
                    {isStep3Loading && <Pending />}
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
