import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { MyVaultDataType } from './portfolio'
import { updateMyVaults } from './reducer'
import { useCallback } from 'react'

export function useMyVaults(): [MyVaultDataType[], (myVaults: MyVaultDataType[]) => void] {
  const dispatch = useDispatch()
  const myVaults = useSelector((state: RootState) => state.portfolio.myVaults)

  const setMyVaults = useCallback(
    (myVaults: MyVaultDataType[]) => {
      dispatch(updateMyVaults(myVaults))
    },
    [dispatch],
  )

  return [myVaults, setMyVaults]
}
