import { memo, useCallback } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { useDeployment } from 'store/createstrategy/hooks/useDeployment'
import { ButtonBorder, ButtonCommon } from 'components/Button'

const FormWrapper = styled.div`
  width: 580px;
  padding: 20px;
  background: ${({ theme }) => theme.black800};
  ${({ theme }) => theme.isMobile && `padding: ${vm(32)};`}
`

const FormHeader = styled.div`
  display: flex;
  gap: 40px;
  padding: 40px 0;
  align-items: flex-start;

  ${({ theme }) =>
    theme.isMobile &&
    `
    flex-direction: column;
    gap: ${vm(24)};
  `}
`

const FormHeaderLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    `
    gap: ${vm(16)};
  `}
`

const FormHeaderRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;

  ${({ theme }) =>
    theme.isMobile &&
    `
    justify-content: flex-start;
  `}
`

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  line-height: 40px;
  background: linear-gradient(94.37deg, rgba(255, 255, 255, 0.98) 0.57%, rgba(153, 153, 153, 0.98) 63.36%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 16px 0;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(32)};
    line-height: ${vm(40)};
    margin: 0 0 ${vm(16)} 0;
  `}
`

const Description = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(14)};
    line-height: ${vm(20)};
  `}
`

const FormField = styled.div`
  margin-bottom: 24px;

  label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.textL2};
    margin-bottom: 8px;
  }

  .field-row {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .max-hint {
    font-size: 12px;
    color: ${({ theme }) => theme.textL4};
    margin-left: 8px;
  }

  ${({ theme }) =>
    theme.isMobile &&
    `
    margin-bottom: ${vm(24)};
    label {
      font-size: ${vm(14)};
      margin-bottom: ${vm(8)};
    }
    .field-row {
      gap: ${vm(16)};
    }
    .max-hint {
      font-size: ${vm(12)};
      margin-left: ${vm(8)};
    }
  `}
`

const ValueDisplay = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  padding: 12px 16px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(16)};
    padding: ${vm(12)} ${vm(16)};
  `}
`

const ProcessDescription = styled.div`
  padding: 20px;
  border-radius: 8px;
  background: ${({ theme }) => theme.black900};
  display: flex;
  flex-direction: column;
  gap: 12px;

  h3 {
    font-size: 13px;
    line-height: 20px;
    font-weight: 600;
    color: ${({ theme }) => theme.textL2};
    margin: 0;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      font-size: 11px;
      line-height: 18px;
      color: ${({ theme }) => theme.textL3};
      padding-left: 16px;
      position: relative;

      &::before {
        content: '•';
        position: absolute;
        left: 0;
        color: ${({ theme }) => theme.textL3};
      }
    }
  }

  ${({ theme }) =>
    theme.isMobile &&
    `
    margin: ${vm(32)} 0;
    h3 {
      font-size: ${vm(16)};
      margin-bottom: ${vm(16)};
    }
    ul li {
      font-size: ${vm(14)};
      margin-bottom: ${vm(8)};
      padding-left: ${vm(16)};
    }
  `}
`

const WarningNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4px;
  color: ${({ theme }) => theme.orange200};

  .warning-icon {
    font-size: 16px;
    margin-top: 2px;
  }

  .warning-text {
    font-size: 12px;
    line-height: 18px;
  }

  ${({ theme }) =>
    theme.isMobile &&
    `
    gap: ${vm(12)};
    padding: ${vm(16)};
    margin: ${vm(24)} 0;
    .warning-icon {
      font-size: ${vm(16)};
      margin-top: ${vm(2)};
    }
    .warning-text {
      font-size: ${vm(14)};
    }
  `}
`

const EarningInfo = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 12px;

  .earning-icon {
    width: 32px;
    height: 32px;
    background: #ff6b47;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
  }

  .earning-text {
    font-size: 16px;
    font-weight: 600;
    background: linear-gradient(270deg, #f84600 -0.11%, #ffffff 99.89%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  ${({ theme }) =>
    theme.isMobile &&
    `
    gap: ${vm(12)};
    padding: ${vm(24)};
    margin: ${vm(32)} 0;
    .earning-icon {
      width: ${vm(32)};
      height: ${vm(32)};
      font-size: ${vm(16)};
    }
    .earning-text {
      font-size: ${vm(16)};
    }
  `}
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 40px;

  ${({ theme }) =>
    theme.isMobile &&
    `
    gap: ${vm(16)};
    margin-top: ${vm(40)};
  `}
`

interface DeployFormProps {
  onDeploy: () => void
  onCancel: () => void
}

export default memo(function DeployForm({ onDeploy, onCancel }: DeployFormProps) {
  const { isLoading } = useDeployment()

  // 处理部署按钮点击
  const handleDeploy = useCallback(() => {
    onDeploy()
  }, [onDeploy])

  return (
    <FormWrapper>
      <FormHeader>
        <FormHeaderLeft>
          <Title>
            <Trans>Launch your Strategy</Trans>
          </Title>
          <Description>
            <Trans>
              Launch the live Strategy and create a Mirror Vault. Retail users can deposit into your Vault, and you earn
              performance fees.
            </Trans>
          </Description>
        </FormHeaderLeft>
        <FormHeaderRight>{/* 右边区域暂时空着 */}</FormHeaderRight>
      </FormHeader>

      <FormField>
        <label>
          <Trans>INITIAL DEPOSIT (USDC)</Trans>
        </label>
        <ValueDisplay>1,000 USDC</ValueDisplay>
      </FormField>

      <FormField>
        <div className='field-row'>
          <div style={{ flex: 1 }}>
            <label>
              <Trans>PROFIT SHARE (%)</Trans>
            </label>
            <ValueDisplay>10%</ValueDisplay>
          </div>
          <div style={{ flex: 1 }}>
            <label>
              <Trans>Status</Trans>
            </label>
            <ValueDisplay>
              <Trans>Public</Trans>
            </ValueDisplay>
          </div>
        </div>
      </FormField>

      <ProcessDescription>
        <h3>
          <Trans>Deployment Process</Trans>
        </h3>
        <ul>
          <li>
            <Trans>System deploys both Strategy and Vault contracts to Mainnet simultaneously.</Trans>
          </li>
          <li>
            <Trans>Manager (You) must deposit min. 1000 USDT to activate live trading.</Trans>
          </li>
          <li>
            <Trans>Strategy orders are automatically mirrored to the Vault.</Trans>
          </li>
          <li>
            <Trans>Public users can deposit into Vault (TVL is dynamic). Manager earns performance fees.</Trans>
          </li>
        </ul>
        <WarningNote>
          <div className='warning-icon'>
            <i className='icon-warn'></i>
          </div>
          <div className='warning-text'>
            <Trans>
              Strategy is locked during execution (No Deposit/Withdraw). Funds returned to wallet only upon termination.
            </Trans>
          </div>
        </WarningNote>
      </ProcessDescription>

      <EarningInfo>
        <div className='earning-icon'>💰</div>
        <div className='earning-text'>
          <Trans>You will earn 10% of all profits generated by this vault.</Trans>
        </div>
      </EarningInfo>

      <ButtonGroup>
        <ButtonBorder style={{ flex: 1 }} onClick={onCancel}>
          <Trans>Cancel</Trans>
        </ButtonBorder>
        <ButtonCommon style={{ flex: 1 }} onClick={handleDeploy} $disabled={isLoading}>
          <Trans>Deploy to Production</Trans>
        </ButtonCommon>
      </ButtonGroup>
    </FormWrapper>
  )
})
