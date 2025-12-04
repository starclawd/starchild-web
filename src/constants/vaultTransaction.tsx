import { Trans } from '@lingui/react/macro'
import dayjs from 'dayjs'
import { VaultTransactionHistory } from 'api/vaults'

// Deposit 状态映射
export const DEPOSIT_STATUS_MAP: Record<string, React.ReactNode> = {
  prepending: <Trans>Pending</Trans>,
  pending: <Trans>Pending</Trans>,
  available: <Trans>Available</Trans>,
  locked: <Trans>Locked</Trans>,
}

// Withdraw 状态映射
export const WITHDRAW_STATUS_MAP: Record<string, React.ReactNode> = {
  prepending: <Trans>Requested</Trans>,
  pending: <Trans>Requested</Trans>,
  requested: <Trans>Requested</Trans>,
  processed: <Trans>Processed</Trans>,
  claimable: <Trans>Claimable</Trans>,
  claimed: <Trans>Claimed</Trans>,
}

// 根据交易类型获取状态显示文本
export function getStatusText(transaction: VaultTransactionHistory): React.ReactNode {
  const { type, status } = transaction
  if (type === 'deposit') {
    return DEPOSIT_STATUS_MAP[status] || status
  }
  return WITHDRAW_STATUS_MAP[status] || status
}

// 获取 Deposit 状态的 tooltip 内容
export function getDepositTooltipContent(transaction: VaultTransactionHistory): React.ReactNode {
  const { status, est_assign_period_time, unlock_time } = transaction
  const estAssignPeriodTime = dayjs(est_assign_period_time).format('YYYY-MM-DD HH:mm:ss')
  const unlockTimeFormatted = dayjs(unlock_time).format('YYYY-MM-DD HH:mm:ss')

  if (status === 'prepending' || status === 'pending') {
    return <Trans>Expected to be processed at {estAssignPeriodTime}</Trans>
  }
  if (status === 'locked') {
    return <Trans>Shares from this deposit will unlock at {unlockTimeFormatted}</Trans>
  }
  return ''
}

// 获取 Withdraw 状态的 tooltip 内容
export function getWithdrawTooltipContent(transaction: VaultTransactionHistory): React.ReactNode {
  const { status, est_assign_period_time, est_claim_time } = transaction
  const estAssignPeriodTime = dayjs(est_assign_period_time).format('YYYY-MM-DD HH:mm:ss')
  const estClaimMinutes = est_claim_time ? Math.max(0, Math.ceil(dayjs(est_claim_time).diff(dayjs(), 'minute'))) : 0

  if (status === 'prepending' || status === 'pending' || status === 'requested') {
    return <Trans>Expected to be processed at {estAssignPeriodTime}</Trans>
  }
  if (status === 'processed') {
    return <Trans>Est. claimable in {estClaimMinutes} mins.</Trans>
  }
  return ''
}

// 根据交易类型获取 tooltip 内容
export function getTooltipContent(transaction: VaultTransactionHistory): React.ReactNode {
  if (transaction.type === 'deposit') {
    return getDepositTooltipContent(transaction)
  }
  return getWithdrawTooltipContent(transaction)
}

