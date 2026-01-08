import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { LocalApproveWalletType } from './vaultdetailcache'
import { setLocalApproveWalletData, setIsShowStrategyMarket } from './reducer'

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

export function useIsShowStrategyMarket(): [boolean, (isShow: boolean) => void] {
  const dispatch = useDispatch()
  const isShowStrategyMarket = useSelector((state: RootState) => state.vaultdetailcache.isShowStrategyMarket)

  const updateIsShowStrategyMarket = useCallback(
    (isShow: boolean) => {
      dispatch(setIsShowStrategyMarket(isShow))
    },
    [dispatch],
  )

  return [isShowStrategyMarket, updateIsShowStrategyMarket]
}
