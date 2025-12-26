import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { LocalApproveWalletType } from './vaultdetailcache'
import { setLocalApproveWalletData } from './reducer'

export function useLocalApproveWalletData(): [LocalApproveWalletType, (data: LocalApproveWalletType) => void] {
  const dispatch = useDispatch()
  const localApproveWalletData = useSelector((state: RootState) => state.vaultdetailcache.localApproveWalletData)

  const updateLocalApproveWalletData = useCallback(
    (data: LocalApproveWalletType) => {
      dispatch(
        setLocalApproveWalletData({
          ...localApproveWalletData,
          ...data,
        }),
      )
    },
    [localApproveWalletData, dispatch],
  )

  return [localApproveWalletData || ({} as LocalApproveWalletType), updateLocalApproveWalletData]
}
