import dayjs from 'dayjs'
import { Trans } from '@lingui/react/macro'
import { VaultTransactionHistory } from 'api/vaults'
import Tooltip from 'components/Tooltip'
import { useCallback, useMemo } from 'react'
import usdc from 'assets/tokens/usdc.png'
import { LatestDepositWrapper, Title, DepositContent, Status, Amount } from '../../styles'
import { CHAIN_ID_TO_CHAIN } from 'constants/chainInfo'
import { getExplorerLink } from 'utils'

export default function LatestDeposit({ latestTransaction }: { latestTransaction: VaultTransactionHistory }) {
  const [status, estAssignPeriodTime, unlockTime, txnHash, chainId] = useMemo(() => {
    const time = latestTransaction?.est_assign_period_time
    const unlockTime = latestTransaction?.unlock_time
    return [
      latestTransaction?.status,
      dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
      dayjs(unlockTime).format('YYYY-MM-DD HH:mm:ss'),
      latestTransaction?.txn_hash,
      latestTransaction?.chain_id,
    ]
  }, [latestTransaction])
  const statusMap = useMemo(() => {
    return {
      prepending: <Trans>Pending</Trans>,
      pending: <Trans>Pending</Trans>,
      available: <Trans>Available</Trans>,
      locked: <Trans>Locked</Trans>,
    }
  }, [])
  const handleClickWithdraw = useCallback(() => {
    if (!txnHash || !chainId) return
    const chain = CHAIN_ID_TO_CHAIN[Number(chainId)]
    if (!chain) return
    const explorerLink = getExplorerLink(chain, txnHash)
    window.open(explorerLink, '_blank')
  }, [txnHash, chainId])

  return (
    <LatestDepositWrapper>
      <Title>
        <Trans>Latest deposit</Trans>
      </Title>
      <DepositContent onClick={handleClickWithdraw}>
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
