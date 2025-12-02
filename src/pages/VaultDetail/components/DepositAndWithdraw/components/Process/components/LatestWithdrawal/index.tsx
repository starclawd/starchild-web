import { Trans } from '@lingui/react/macro'
import { VaultTransactionHistory } from 'api/vaults'
import { LatestWithdrawalWrapper, Title, WithdrawContent, Status, Amount } from '../../styles'
import usdc from 'assets/tokens/usdc.png'
import { useMemo } from 'react'
// import AvailableClaim from '../AvailableClaim'

export default function LatestWithdrawal({ latestTransaction }: { latestTransaction: VaultTransactionHistory }) {
  const [status] = useMemo(() => {
    return [latestTransaction?.status]
  }, [latestTransaction])
  return (
    <LatestWithdrawalWrapper>
      <Title>
        <Trans>Latest withdrawal request</Trans>
      </Title>
      <WithdrawContent>
        <Status>
          <span></span>
          {status}
        </Status>
        <Amount>
          <img src={usdc} alt='usdc' />
          <span className='amount'>{latestTransaction?.amount_change}</span>
        </Amount>
      </WithdrawContent>
      {/* <AvailableClaim /> */}
    </LatestWithdrawalWrapper>
  )
}
