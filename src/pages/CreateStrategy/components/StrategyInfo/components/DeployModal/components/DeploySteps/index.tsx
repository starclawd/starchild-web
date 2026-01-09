import { memo, useCallback } from 'react'
import styled, { useTheme } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { useDeployment } from 'store/createstrategy/hooks/useDeployment'
import { useDeployStrategyId } from 'store/application/hooks'
import { DEPLOYING_STATUS } from 'store/createstrategy/createstrategy'
import { IconBase } from 'components/Icons'
import { rotate } from 'styles/animationStyled'
import { ButtonCommon } from 'components/Button'
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

const StepItem = styled.div`
  display: flex;
  gap: 8px;
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

const StepNumber = styled.div<{ $status: DEPLOYING_STATUS }>`
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: ${({ $status, theme }) => {
    switch ($status) {
      case DEPLOYING_STATUS.DEPLOYING:
        return theme.brand100
      case DEPLOYING_STATUS.DEPLOYING_FAILED:
        return theme.red100
      case DEPLOYING_STATUS.DEPLOYING_SUCCESS:
        return theme.green100
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
  const { deployingStatus, deployVault } = useDeployment(strategyId || '')
  const theme = useTheme()

  // 判断按钮是否处于loading状态
  const isDeploying = deployingStatus === DEPLOYING_STATUS.DEPLOYING

  const renderStatusIcon = (status: DEPLOYING_STATUS, theme: any) => {
    switch (status) {
      case DEPLOYING_STATUS.DEPLOYING_SUCCESS:
        return <IconBase className='icon-complete' style={{ color: theme.brand100 }} />
      case DEPLOYING_STATUS.DEPLOYING:
        return <Pending />
      case DEPLOYING_STATUS.DEPLOYING_FAILED:
        return <IconBase className='icon-close' style={{ color: theme.ruby50 }} />
      default:
        return <Pending />
    }
  }

  const handleStep3Click = useCallback(() => {
    deployVault(strategyId || '')
  }, [deployVault, strategyId])

  return (
    <StepsWrapper>
      <MainTitle>
        <Trans>Activity</Trans>
      </MainTitle>

      <StepsContainer>
        <StepItem>
          <StepLeftSection>
            <StepIcon>{renderStatusIcon(deployingStatus, theme)}</StepIcon>
          </StepLeftSection>

          <StepContent>
            <StepNumber $status={deployingStatus}>
              <Trans>Deploy the On-Chain Vault Contract</Trans>
            </StepNumber>
            <StepDescription>
              <Trans>
                Deploy the smart contract that mirrors your Agent's signals. Retail users will deposit into this Vault.
              </Trans>
            </StepDescription>

            {deployingStatus !== DEPLOYING_STATUS.DEPLOYING_SUCCESS && !isDeploying && (
              <ActionButton onClick={handleStep3Click} $disabled={isDeploying}>
                {isDeploying && <Pending />}
                <Trans>Deploy</Trans>
              </ActionButton>
            )}
          </StepContent>
        </StepItem>
      </StepsContainer>
    </StepsWrapper>
  )
})
