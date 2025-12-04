import { useMemo } from 'react'
import { useFetchLatestTransactionHistoryData } from 'store/vaults/hooks/useTransactionData'
import { useDepositAndWithdrawTabIndex } from 'store/vaultsdetail/hooks/useDepositAndWithdraw'
import LatestDeposit from './components/LatestDeposit'
import { ProcessWrapper } from './styles'
import LatestWithdrawal from './components/LatestWithdrawal'
import WithdrawProcess from './components/WithdrawProcess'

export default function Process() {
  const [depositAndWithdrawTabIndex] = useDepositAndWithdrawTabIndex()
  const { latestTransactionHistory } = useFetchLatestTransactionHistoryData()
  const latestTransaction = useMemo(() => {
    return latestTransactionHistory.find(
      (item) =>
        (depositAndWithdrawTabIndex === 0 && item.type === 'deposit') ||
        (depositAndWithdrawTabIndex === 1 && item.type === 'withdrawal'),
    )
  }, [depositAndWithdrawTabIndex, latestTransactionHistory])
  if (depositAndWithdrawTabIndex === 0 && latestTransaction) {
    return (
      <ProcessWrapper>
        <LatestDeposit latestTransaction={latestTransaction} />
      </ProcessWrapper>
    )
  }
  if (depositAndWithdrawTabIndex === 1 && latestTransaction) {
    return (
      <ProcessWrapper>
        <LatestWithdrawal latestTransaction={latestTransaction} />
      </ProcessWrapper>
    )
  }
  if (depositAndWithdrawTabIndex === 1 && !latestTransaction) {
    return (
      <ProcessWrapper>
        <WithdrawProcess />
      </ProcessWrapper>
    )
  }
  return null
}
