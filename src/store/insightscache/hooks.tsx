import { useDispatch, useSelector } from 'react-redux'
import { updateSelectedPeriod } from './reducer'
import { useCallback } from 'react'
import { RootState } from 'store'
import { PERIOD_OPTIONS } from './insightscache'

export function useGetConvertPeriod(): (selectedPeriod: PERIOD_OPTIONS, isBinanceSupport: boolean) => PERIOD_OPTIONS {
  const getConvertPeriod = useCallback((selectedPeriod: PERIOD_OPTIONS, isBinanceSupport: boolean) => {
    if (isBinanceSupport) {
      return selectedPeriod
    }
    if (selectedPeriod === '15m' || selectedPeriod === '1h' || selectedPeriod === '4h') {
      return '1h'
    } else if (selectedPeriod === '1d' || selectedPeriod === '1w' || selectedPeriod === '1M') {
      return '1d'
    }
    return selectedPeriod
  }, [])

  return getConvertPeriod
}

export function useSelectedPeriod(): [PERIOD_OPTIONS, (newSelectedPeriod: PERIOD_OPTIONS) => void] {
  const dispatch = useDispatch()
  const selectedPeriod = useSelector((state: RootState) => state.insightscache.selectedPeriod)

  const setSelectedPeriod = useCallback(
    (newSelectedPeriod: PERIOD_OPTIONS) => {
      dispatch(updateSelectedPeriod(newSelectedPeriod))
    },
    [dispatch],
  )

  return [selectedPeriod, setSelectedPeriod]
}
