import { memo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { useDeployment } from 'store/createstrategy/hooks/useDeployment'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import ShinyButton from 'components/ShinyButton'
import deployingBg from 'assets/createstrategy/deploying_bg.png'
import serverFillIcon from 'assets/createstrategy/server-fill.png'

const FormWrapper = styled.div`
  width: 580px;
  padding: 20px;
  border-radius: 24px;
  background: ${({ theme }) => theme.black800};
  background-image: url(${deployingBg});
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 100% auto;
  position: relative;
  ${({ theme }) => theme.isMobile && `padding: ${vm(32)};`}
`

const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 0 40px 0;
  position: relative;

  ${({ theme }) =>
    theme.isMobile &&
    `
    gap: ${vm(16)};
  `}
`

const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;

  ${({ theme }) =>
    theme.isMobile &&
    `
    flex-direction: column;
    gap: ${vm(16)};
  `}
`

const DescriptionRow = styled.div`
  width: 100%;
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
  flex: 0 0 50%;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(32)};
    line-height: ${vm(40)};
    margin: 0 0 ${vm(16)} 0;
    flex: none;
  `}
`

const Description = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black300};
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(14)};
    line-height: ${vm(20)};
  `}
`

const FormContent = styled.div`
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const FormField = styled.div`
  label {
    display: block;
    font-size: 13px;
    line-height: 20px;
    font-weight: 400;
    color: ${({ theme }) => theme.black100};
    margin-left: 12px;
    margin-bottom: 8px;

    .required-asterisk {
      margin-left: 4px;
      font-size: 12px;
      color: ${({ theme }) => theme.autumn50};
    }
  }

  .field-row {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .max-hint {
    font-size: 12px;
    color: ${({ theme }) => theme.black300};
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
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: ${({ theme }) => theme.black0};
  padding: 12px;
  background: ${({ theme }) => theme.black700};
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
  padding: 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.black900};
  display: flex;
  flex-direction: column;
  gap: 12px;

  h3 {
    font-size: 13px;
    line-height: 20px;
    font-weight: 400;
    color: ${({ theme }) => theme.black100};
    margin: 0;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      font-size: 11px;
      line-height: 18px;
      color: ${({ theme }) => theme.black200};
      padding-left: 12px;
      position: relative;

      &::before {
        content: '•';
        position: absolute;
        left: 0;
        color: ${({ theme }) => theme.black200};
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
  align-items: center;
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
  margin-top: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 12px;

  .earning-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
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

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .earning-text {
      font-size: ${vm(16)};
    }
  `}
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;

  .cancel-deployment-button {
    flex: 1;
    font-size: 18px;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.black200};
  }

  .deploy-to-production-button {
    flex: 1;
    span {
      font-size: 18px;
      font-weight: 500;
      line-height: 20px;
      color: ${({ theme }) => theme.black0};
    }
  }

  ${({ theme }) =>
    theme.isMobile &&
    `
    gap: ${vm(16)};
    margin-top: ${vm(40)};
  `}
`

const CommissionSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;
  flex: 0 0 50%;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      align-self: flex-end;
      flex: none;
    `}
`

const CommissionValue = styled.div`
  display: flex;
  align-items: baseline;
  color: ${({ theme }) => theme.brand100};
  margin: 0;
`

const CommissionNumber = styled.span`
  font-size: 56px;
  line-height: 64px;
  font-weight: 700;
  font-style: italic;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.48rem;
    `}
`

const CommissionPercent = styled.span`
  font-size: 20px;
  line-height: 28px;
  font-weight: 700;
  font-style: italic;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.18rem;
    `}
`

const CommissionLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: ${({ theme }) => theme.brand100};
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.12rem;
      line-height: 0.16rem;
    `}
`

interface DeployFormProps {
  onDeploy: () => void
  onCancel: () => void
}

export default memo(function DeployForm({ onDeploy, onCancel }: DeployFormProps) {
  // 处理部署按钮点击
  const handleDeploy = useCallback(() => {
    onDeploy()
  }, [onDeploy])

  return (
    <FormWrapper>
      <FormHeader>
        <TitleRow>
          <Title>
            <Trans>Launch your Strategy Agent</Trans>
          </Title>
          <CommissionSection>
            <CommissionValue>
              <CommissionNumber>10</CommissionNumber>
              <CommissionPercent>%</CommissionPercent>
            </CommissionValue>
            <CommissionLabel>
              <Trans>10% Creator Share</Trans>
            </CommissionLabel>
          </CommissionSection>
        </TitleRow>
        <DescriptionRow>
          <Description>
            <Trans>Launch the live Strategy and create a Mirror Vault.</Trans>
          </Description>
          <Description>
            <Trans>Retail users can deposit into your Vault, and you earn performance fees.</Trans>
          </Description>
        </DescriptionRow>
      </FormHeader>

      <FormContent>
        <FormField>
          <label>
            <Trans>INITIAL DEPOSIT (USDC)</Trans>
            <span className='required-asterisk'>*</span>
          </label>
          <ValueDisplay>1,000 USDC</ValueDisplay>
        </FormField>

        <FormField>
          <div className='field-row'>
            <div style={{ flex: 1 }}>
              <label>
                <Trans>PROFIT SHARE (%)</Trans>
                <span className='required-asterisk'>*</span>
              </label>
              <ValueDisplay>10%</ValueDisplay>
            </div>
            <div style={{ flex: 1 }}>
              <label>
                <Trans>Status</Trans>
                <span className='required-asterisk'>*</span>
              </label>
              <ValueDisplay>
                <Trans>Public</Trans>
              </ValueDisplay>
            </div>
          </div>
        </FormField>
      </FormContent>

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
        <div className='earning-icon'>
          <img src={serverFillIcon} alt='server' />
        </div>
        <div className='earning-text'>
          <Trans>You will earn 10% of all profits generated by this vault.</Trans>
        </div>
      </EarningInfo>

      <ButtonGroup>
        <ButtonBorder className='cancel-deployment-button' onClick={onCancel}>
          <Trans>Cancel</Trans>
        </ButtonBorder>
        <ShinyButton className='deploy-to-production-button' onClick={handleDeploy}>
          <Trans>Deploy to Production</Trans>
        </ShinyButton>
      </ButtonGroup>
    </FormWrapper>
  )
})
