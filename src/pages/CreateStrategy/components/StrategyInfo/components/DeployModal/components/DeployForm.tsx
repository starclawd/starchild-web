import { memo, useCallback, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import deployingBg from 'assets/createstrategy/deploy-bg.png'

const FormWrapper = styled.div`
  width: 480px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.black900};
  background-image: url(${deployingBg});
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 100% auto;
  backdrop-filter: blur(8px);
`

const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  width: 100%;
  height: 180px;
`

const TitleRow = styled.div`
  font-size: 26px;
  font-style: normal;
  font-weight: 700;
  line-height: 34px;
  color: ${({ theme }) => theme.black0};
`

const DescriptionRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
`

const Description = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black0};
`

const ProcessDescription = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
`

const DeploymentProcessTitle = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black0};
`

const DeploymentProcessList = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.black200};
  span {
    position: relative;
    padding-left: 12px;
    &::before {
      position: absolute;
      left: 4px;
      top: 8px;
      content: '';
      display: inline-block;
      width: 2px;
      height: 2px;
      background-color: ${({ theme }) => theme.black200};
      border-radius: 50%;
      margin-right: 8px;
    }
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  padding: 8px 20px 20px;
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

const ButtonCancel = styled(ButtonBorder)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 40px;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  border: ${({ theme }) => `1px solid ${theme.black600}`};
`

const ButtonDeploy = styled(ButtonCommon)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 40px;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
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

  const list = useMemo(
    () => [
      {
        key: 'system-deploy',
        title: <Trans>System deploys both Strategy and Vault contracts to Mainnet simultaneously.</Trans>,
      },
      {
        key: 'strategy-mirror',
        title: <Trans>Strategy orders are automatically mirrored to the Vault.</Trans>,
      },
      {
        key: 'public-deposit',
        title: <Trans>Public users can deposit into Vault (TVL is dynamic). Manager earns performance fees.</Trans>,
      },
    ],
    [],
  )

  return (
    <FormWrapper>
      <FormHeader>
        <TitleRow>
          <Trans>
            Launch your
            <br /> Strategy Agent
          </Trans>
        </TitleRow>
        <DescriptionRow>
          <Description>
            <Trans>Turn your strategy into a public vault and earn 10% performance fees.</Trans>
          </Description>
          <CommissionValue>
            <CommissionNumber>10</CommissionNumber>
            <CommissionPercent>%</CommissionPercent>
          </CommissionValue>
        </DescriptionRow>
      </FormHeader>

      <ProcessDescription>
        <DeploymentProcessTitle>
          <Trans>Deployment Process</Trans>
        </DeploymentProcessTitle>
        <DeploymentProcessList>
          {list.map((item) => (
            <span key={item.key}>{item.title}</span>
          ))}
        </DeploymentProcessList>
      </ProcessDescription>

      <ButtonGroup>
        <ButtonCancel onClick={onCancel}>
          <Trans>Cancel</Trans>
        </ButtonCancel>
        <ButtonDeploy onClick={handleDeploy}>
          <Trans>Launch to production</Trans>
        </ButtonDeploy>
      </ButtonGroup>
    </FormWrapper>
  )
})
