import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { ParamFun } from 'types/global'
import { setDepositAndWithdrawTabIndex } from '../reducer'
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
