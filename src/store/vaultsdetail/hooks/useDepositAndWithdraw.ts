import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { ParamFun } from 'types/global'
import { setDepositAndWithdrawTabIndex } from '../reducer'
import { useLazyRecordDepositAddressQuery } from 'api/strategy'
/**
 * Hook for deposit and withdraw tab index - returns deposit and withdraw tab index and setter
 */
export function useDepositAndWithdrawTabIndex(): [number, ParamFun<number>] {
  const dispatch = useDispatch()
  const depositAndWithdrawTabIndex = useSelector((state: RootState) => state.vaultsdetail.depositAndWithdrawTabIndex)

  const setDepositAndWithdrawTabIndexAction = useCallback(
    (value: number) => {
      dispatch(setDepositAndWithdrawTabIndex(value))
    },
    [dispatch],
  )

  return [depositAndWithdrawTabIndex, setDepositAndWithdrawTabIndexAction]
}

export function useRecordDepositAddress() {
  const [triggerRecordDepositAddress] = useLazyRecordDepositAddressQuery()

  const recordDepositAddress = useCallback(
    async (userId: string, walletAddress: string) => {
      const response = await triggerRecordDepositAddress({ walletAddress, userId })
      return response
    },
    [triggerRecordDepositAddress],
  )

  return recordDepositAddress
}
