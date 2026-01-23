import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { RootState } from 'store/index'
import { changeIsPlaying, setActiveTab, setCarouselPaused } from '../reducer'
import { TabKey } from 'store/usecases/usecases.d'

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

export const useIsPlaying = () => {
  const isPlaying = useSelector((state: RootState) => state.usecases.isPlaying)
  const dispatch = useDispatch()

  const setIsPlayingAction = (isPlaying: boolean) => {
    dispatch(changeIsPlaying({ isPlaying }))
  }

  return [isPlaying, setIsPlayingAction] as const
}
