import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { RootState } from 'store'
import { setChartVaultId as setChartVaultIdAction } from '../reducer'
import { ParamFun } from 'types/global'

export function useChartVaultId(): [string | null, ParamFun<string | null>] {
  const dispatch = useDispatch()
  const chartVaultId = useSelector((state: RootState) => state.myvault.chartVaultId)
  const setChartVaultId = useCallback(
    (vaultId: string | null) => {
      dispatch(setChartVaultIdAction(vaultId))
    },
    [dispatch],
  )
  return [chartVaultId, setChartVaultId]
}
