import { memo, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'

const VaultInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: ${({ theme }) => theme.black700};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.lineDark8};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(20)};
      gap: ${vm(16)};
    `}
`

const VaultHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex-direction: column;
      align-items: flex-start;
      gap: ${vm(12)};
    `}
`

const VaultIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 600;
  flex-shrink: 0;

  ${({ theme }) =>
    theme.isMobile &&
    `
    width: ${vm(48)};
    height: ${vm(48)};
    font-size: ${vm(20)};
  `}
`

const VaultTitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
    `}
`

const VaultTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(24)};
  `}
`

const VaultSubtitle = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textL2};

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(14)};
  `}
`

const VaultAttributes = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      grid-template-columns: 1fr 1fr;
      gap: ${vm(12)};
    `}
`

const AttributeItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
    `}
`

const AttributeLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.textL3};
  text-transform: uppercase;
  font-weight: 500;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(12)};
  `}
`

const AttributeValue = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.textL1};
  font-weight: 600;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(16)};
  `}
`

const VaultDescription = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.black800};
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.lineDark8};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(16)};
    `}
`

const DescriptionText = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.textL2};
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(14)};
  `}
`

const VaultInfo = memo(() => {
  const [searchParams] = useSearchParams()
  const vaultId = searchParams.get('id')

  // 模拟数据，之后会接入真实API
  const vaultData = useMemo(
    () => ({
      name: 'Upbit New Listing Sniper',
      symbol: 'UPBIT-SNIPER',
      description:
        "Monitor Upbit for newly listed coins every 20 minutes. When a new listing is detected, if the coin is tradable and not already held in the user's portfolio, immediately send a notification for detection and suggest a market buy using the user's entire available balance for that market.",
      totalValue: '1,000 USDC',
      strategy: 'Starchild',
      age: '320 D',
      depositors: '725',
      apy: '31.39%',
    }),
    [],
  )

  return (
    <VaultInfoContainer>
      <VaultHeader>
        <VaultIcon>
          {vaultData.name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .slice(0, 2)}
        </VaultIcon>
        <VaultTitleSection>
          <VaultTitle>{vaultData.name}</VaultTitle>
          <VaultSubtitle>ID: {vaultId}</VaultSubtitle>
        </VaultTitleSection>
      </VaultHeader>

      <VaultAttributes>
        <AttributeItem>
          <AttributeLabel>
            <Trans>Initial Equity</Trans>
          </AttributeLabel>
          <AttributeValue>{vaultData.totalValue}</AttributeValue>
        </AttributeItem>
        <AttributeItem>
          <AttributeLabel>
            <Trans>Strategy Provider</Trans>
          </AttributeLabel>
          <AttributeValue>{vaultData.strategy}</AttributeValue>
        </AttributeItem>
        <AttributeItem>
          <AttributeLabel>
            <Trans>Age</Trans>
          </AttributeLabel>
          <AttributeValue>{vaultData.age}</AttributeValue>
        </AttributeItem>
        <AttributeItem>
          <AttributeLabel>
            <Trans>Depositors</Trans>
          </AttributeLabel>
          <AttributeValue>{vaultData.depositors}</AttributeValue>
        </AttributeItem>
      </VaultAttributes>

      <VaultDescription>
        <DescriptionText>{vaultData.description}</DescriptionText>
      </VaultDescription>
    </VaultInfoContainer>
  )
})

VaultInfo.displayName = 'VaultInfo'

export default VaultInfo
