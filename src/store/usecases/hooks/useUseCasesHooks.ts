import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { RootState } from 'store/index'
import { setActiveTab, setCarouselPaused } from '../reducer'
import { TabKey } from 'constants/useCases'

export const useActiveTab = () => {
  const activeTab = useSelector((state: RootState) => state.usecases.activeTab)
  const dispatch = useDispatch()

  const setActiveTabAction = useCallback(
    (tab: TabKey) => {
      dispatch(setActiveTab(tab))
    },
    [dispatch],
  )

  return [activeTab, setActiveTabAction] as const
}

export const useCarouselPaused = () => {
  const isCarouselPaused = useSelector((state: RootState) => state.usecases.isCarouselPaused)
  const dispatch = useDispatch()

  const setCarouselPausedAction = useCallback(
    (isPaused: boolean) => {
      dispatch(setCarouselPaused(isPaused))
    },
    [dispatch],
  )

  return [isCarouselPaused, setCarouselPausedAction] as const
}
