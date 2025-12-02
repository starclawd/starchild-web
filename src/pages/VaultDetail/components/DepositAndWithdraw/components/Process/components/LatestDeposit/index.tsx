import dayjs from 'dayjs'
import { Trans } from '@lingui/react/macro'
import { VaultTransactionHistory } from 'api/vaults'
import Tooltip from 'components/Tooltip'
import { useMemo } from 'react'
import usdc from 'assets/tokens/usdc.png'
import { LatestDepositWrapper, Title, DepositContent, Status, Amount } from '../../styles'

export default function LatestDeposit({ latestTransaction }: { latestTransaction: VaultTransactionHistory }) {
  const [status, estAssignPeriodTime, unlockTime] = useMemo(() => {
    const time = latestTransaction?.est_assign_period_time
    const unlockTime = latestTransaction?.unlock_time
    return [
      latestTransaction?.status,
      dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
      dayjs(unlockTime).format('YYYY-MM-DD HH:mm:ss'),
    ]
  }, [latestTransaction])
  const statusMap = useMemo(() => {
    return {
      prepending: <Trans>Pending</Trans>,
      pending: <Trans>Pending</Trans>,
      available: <Trans>Success</Trans>,
      locked: <Trans>Locked</Trans>,
    }
  }, [])
  return (
    <LatestDepositWrapper>
      <Title>
        <Trans>Latest deposit</Trans>
      </Title>
      <DepositContent>
        <Status>
          <span></span>
          <Tooltip
            placement='top'
            content={
              status === 'prepending' || status === 'pending' ? (
                <Trans>Expected to be processed at {estAssignPeriodTime}</Trans>
              ) : status === 'locked' ? (
                <Trans>Shares from this deposit will unlock at {unlockTime}</Trans>
              ) : (
                ''
              )
            }
          >
            {statusMap[status as keyof typeof statusMap]}
          </Tooltip>
        </Status>
        <Amount>
          <img src={usdc} alt='usdc' />
          <span className='amount'>{latestTransaction?.amount_change}</span>
        </Amount>
      </DepositContent>
    </LatestDepositWrapper>
  )
}
