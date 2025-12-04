import dayjs from 'dayjs'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { VaultTransactionHistory } from 'api/vaults'
import { LatestWithdrawalWrapper, Title, WithdrawContent, Status, Amount } from '../../styles'
import usdc from 'assets/tokens/usdc.png'
import { useCallback, useMemo } from 'react'
import AvailableClaim from '../AvailableClaim'
import { CHAIN_ID_TO_CHAIN } from 'constants/chainInfo'
import { getExplorerLink } from 'utils'
import Tooltip from 'components/Tooltip'
import { useClaimInfo } from 'store/vaultsdetail/hooks/useClaimInfo'

const AvailableClaimWrapper = styled.div`
  display: flex;
  align-content: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 4px;
  border: 1px solid ${({ theme }) => theme.bgT20};
  border-radius: 8px;
  padding: 12px;
`

export default function LatestWithdrawal({ latestTransaction }: { latestTransaction: VaultTransactionHistory }) {
  const [claimData] = useClaimInfo()
  const [status, txnHash, chainId, estAssignPeriodTime, estClaimMinutes] = useMemo(() => {
    const estAssignPeriodTime = latestTransaction?.est_assign_period_time
    const estClaimTimestamp = latestTransaction?.est_claim_time
    // 计算距离现在的分钟数
    const estClaimMinutes = estClaimTimestamp
      ? Math.max(0, Math.ceil(dayjs(estClaimTimestamp).diff(dayjs(), 'minute')))
      : 0
    return [
      latestTransaction?.status,
      latestTransaction?.txn_hash,
      latestTransaction?.chain_id,
      dayjs(estAssignPeriodTime).format('YYYY-MM-DD HH:mm:ss'),
      estClaimMinutes,
    ]
  }, [latestTransaction])
  //prepending  Expected to be processed at 2025-12-04 13:00:00  est_assign_period_time
  // Processed   Est. claimable in 161 mins.      est_claim_time
  const statusMap = useMemo(() => {
    return {
      prepending: <Trans>Requested</Trans>,
      pending: <Trans>Requested</Trans>,
      requested: <Trans>Requested</Trans>,
      processed: <Trans>Processed</Trans>,
      claimable: <Trans>Claimable</Trans>,
      claimed: <Trans>Claimed</Trans>,
    }
  }, [])
  const tooltipContent = useMemo(() => {
    return status === 'prepending' || status === 'pending' || status === 'requested' ? (
      <Trans>Expected to be processed at {estAssignPeriodTime}</Trans>
    ) : status === 'processed' ? (
      <Trans>Est. claimable in {estClaimMinutes} mins.</Trans>
    ) : (
      ''
    )
  }, [status, estAssignPeriodTime, estClaimMinutes])
  const handleClickWithdraw = useCallback(() => {
    if (!txnHash || !chainId) return
    const chain = CHAIN_ID_TO_CHAIN[Number(chainId)]
    if (!chain) return
    const explorerLink = getExplorerLink(chain, txnHash)
    window.open(explorerLink, '_blank')
  }, [txnHash, chainId])

  // 判断所有链的 claimableAmount 是否都为 0
  const hasAnyClaimableAmount = useMemo(() => {
    return Object.values(claimData).some((item) => item?.claimableAmount > 0)
  }, [claimData])

  return (
    <LatestWithdrawalWrapper>
      <Title>
        <Trans>Latest withdrawal request</Trans>
      </Title>
      <WithdrawContent onClick={handleClickWithdraw}>
        <Status>
          <span></span>
          <Tooltip placement='top' content={tooltipContent}>
            {statusMap[status as keyof typeof statusMap]}
          </Tooltip>
        </Status>
        <Amount>
          <img src={usdc} alt='usdc' />
          <span className='amount'>{latestTransaction?.amount_change}</span>
        </Amount>
      </WithdrawContent>
      {hasAnyClaimableAmount && (
        <AvailableClaimWrapper>
          <AvailableClaim />
        </AvailableClaimWrapper>
      )}
    </LatestWithdrawalWrapper>
  )
}
