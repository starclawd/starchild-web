import { memo, useCallback, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { useDepositAndWithdrawModalToggle } from 'store/application/hooks'
import { useCurrentDepositAndWithdrawVault, useProtocolVaultsData } from 'store/vaults/hooks'

const VaultInfoContainer = styled.div`
  display: flex;
  gap: 40px;
`

const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const VaultHeader = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  gap: 12px;
`

const VaultTitle = styled.div`
  font-size: 40px;
  font-style: normal;
  font-weight: 300;
  line-height: 48px;
  color: ${({ theme }) => theme.textL1};
`

const VaultSubtitle = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  span:first-child {
    width: 4px;
    height: 4px;
    background-color: ${({ theme }) => theme.green100};
  }
  span:last-child {
    font-size: 10px;
    font-style: normal;
    font-weight: 300;
    line-height: 120%;
    color: ${({ theme }) => theme.green100};
  }
`

const VaultAttributes = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`

const AttributeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  span:first-child {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textDark54};
  }
  span:last-child {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textDark98};
  }
`

const VaultDescription = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  color: ${({ theme }) => theme.textDark54};
`

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  gap: 16px;
  flex-shrink: 0;
  width: 300px;
  padding: 12px 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.black700};
`

const TopContent = styled.div`
  display: flex;
  justify-content: space-between;
  .icon-chat-arrow-long {
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }
`

const MyFund = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  span:first-child {
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.textL3};
  }
  span:last-child {
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 26px;
    color: ${({ theme }) => theme.textDark98};
  }
`

const BottomContent = styled.div`
  display: flex;
  height: 32px;
  gap: 12px;
`

const ButtonWithdraw = styled(ButtonBorder)`
  width: 50%;
  height: 100%;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
`

const ButtonDeposit = styled(ButtonCommon)`
  width: 50%;
  height: 100%;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
`

export default memo(function VaultInfo() {
  const toggleDepositAndWithdrawModal = useDepositAndWithdrawModalToggle()
  // const [, setCurrentDepositAndWithdrawVault] = useCurrentDepositAndWithdrawVault()
  // const { protocolVaults } = useProtocolVaultsData()
  const attributesList = useMemo(
    () => [
      {
        label: <Trans>Initial Equity</Trans>,
        value: '--',
      },
      {
        label: <Trans>Vault address</Trans>,
        value: '--',
      },
      {
        label: <Trans>Depositors</Trans>,
        value: '--',
      },
      {
        label: <Trans>Strategy Provider</Trans>,
        value: '--',
      },
      {
        label: <Trans>Age</Trans>,
        value: '--',
      },
      {
        label: <Trans>Symbol</Trans>,
        value: '--',
      },
    ],
    [],
  )

  const showDepositAndWithdrawModal = useCallback(() => {
    // setCurrentDepositAndWithdrawVault((protocolVaults[0] as any)?.raw)
    toggleDepositAndWithdrawModal()
  }, [toggleDepositAndWithdrawModal])

  return (
    <VaultInfoContainer>
      <LeftWrapper>
        <VaultHeader>
          <VaultTitle>Upbit New Listing Sniper</VaultTitle>
          <VaultSubtitle>
            <span></span>
            <span>Active</span>
          </VaultSubtitle>
        </VaultHeader>

        <VaultAttributes>
          {attributesList.map((attr, index) => (
            <AttributeItem key={index}>
              <span>{attr.label}</span>
              <span>{attr.value}</span>
            </AttributeItem>
          ))}
        </VaultAttributes>

        <VaultDescription>
          Monitor Upbit for newly listed coins every 20 minutes. When a new listing is detected, if the coin is tradable
          and not already held in the user's portfolio, immediately send a notification for detection and suggest a
          market buy using the user's entire available balance for that market. After the purchase, monitor the first
          15-minute candlestick; if that 15m candle closes lower than it opened, immediately send a notification and
          suggest a market sell (reduce_only=true) to close the entire position. Log all actions and send notifications
          for detection, buy, sell, and any errors or exceptions. Note: This agent can only provide suggestions and send
          text alerts; it cannot execute trades. You must manually place orders. Please confirm if this meets your
          requirements.
        </VaultDescription>
      </LeftWrapper>
      <RightWrapper>
        <TopContent>
          <MyFund>
            <span>
              <Trans>My Fund</Trans>
            </span>
            <span>--</span>
          </MyFund>
          <IconBase className='icon-chat-arrow-long' />
        </TopContent>
        <BottomContent>
          <ButtonWithdraw>
            <Trans>Withdraw</Trans>
          </ButtonWithdraw>
          <ButtonDeposit onClick={showDepositAndWithdrawModal}>
            <Trans>Deposit</Trans>
          </ButtonDeposit>
        </BottomContent>
      </RightWrapper>
    </VaultInfoContainer>
  )
})
