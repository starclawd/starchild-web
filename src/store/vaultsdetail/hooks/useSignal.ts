import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateSignalList } from '../reducer'
import { SignalDataType } from '../vaultsdetail.d'
import { ParamFun } from 'types/global'

export function useSignalList(): [SignalDataType[], ParamFun<SignalDataType>] {
  const dispatch = useDispatch()
  const signalList = useSelector((state: RootState) => state.vaultsdetail.signalList)

  const setSignalList = useCallback(
    (value: SignalDataType) => {
      dispatch(updateSignalList(value))
    },
    [dispatch],
  )

  return [signalList, setSignalList]
}
