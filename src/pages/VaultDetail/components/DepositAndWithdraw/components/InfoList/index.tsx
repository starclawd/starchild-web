import { Trans } from '@lingui/react/macro'
import { VaultInfo } from 'api/vaults'
import { vm } from 'pages/helper'
import { useMemo } from 'react'
import { useCurrentDepositAndWithdrawVault } from 'store/vaults/hooks'
import { useDepositAndWithdrawTabIndex } from 'store/vaultsdetail/hooks/useDepositAndWithdraw'
import styled, { css } from 'styled-components'
import { div, mul, toFix } from 'utils/calc'

const InfoListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
    `}
`

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const InfoLabel = styled.span`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black200};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

const InfoValue = styled.span`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black300};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

const Shares = styled.span`
  span {
    color: ${({ theme }) => theme.black0};
  }
`

const LockUpDuration = styled(Shares)``

const EstPricePerShare = styled(Shares)``

const EstShares = styled(Shares)``

export default function InfoList({
  amount,
  currentDepositAndWithdrawVault,
}: {
  amount: string
  currentDepositAndWithdrawVault: VaultInfo
}) {
  const [depositAndWithdrawTabIndex] = useDepositAndWithdrawTabIndex()
  const depositInfoList = useMemo(() => {
    const lockUpDuration = currentDepositAndWithdrawVault.lock_duration
    const estMainSharePrice = currentDepositAndWithdrawVault.est_main_share_price || 0
    const estShares = estMainSharePrice ? toFix(div(amount, estMainSharePrice), 6) : '0'
    return [
      {
        key: 'est-shares',
        label: <Trans>Est. Shares</Trans>,
        value: (
          <Shares>
            <span>{estShares}</span> Shares
          </Shares>
        ),
      },
      {
        key: 'lock-up-duration',
        label: <Trans>Lock up duration</Trans>,
        value: (
          <LockUpDuration>
            <span>{lockUpDuration}</span> hrs
          </LockUpDuration>
        ),
      },
    ]
  }, [amount, currentDepositAndWithdrawVault])

  const withdrawInfoList = useMemo(() => {
    const estMainSharePrice = currentDepositAndWithdrawVault.est_main_share_price || 0
    const estReceiving = estMainSharePrice ? toFix(mul(amount || '0', estMainSharePrice), 2) : '0'
    return [
      {
        key: 'Est. price per Share',
        label: <Trans>Est. price per Share</Trans>,
        value: (
          <EstPricePerShare>
            <span>${estMainSharePrice}</span>
          </EstPricePerShare>
        ),
      },
      {
        key: 'Est. receiving',
        label: <Trans>Est. receiving</Trans>,
        value: (
          <EstShares>
            <span>${estReceiving}</span> USDC
          </EstShares>
        ),
      },
    ]
  }, [amount, currentDepositAndWithdrawVault])

  return (
    <InfoListWrapper>
      {(depositAndWithdrawTabIndex === 0 ? depositInfoList : withdrawInfoList).map((item) => (
        <InfoRow key={item.key}>
          <InfoLabel>{item.label}</InfoLabel>
          <InfoValue>{item.value}</InfoValue>
        </InfoRow>
      ))}
    </InfoListWrapper>
  )
}
