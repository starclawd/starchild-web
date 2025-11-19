import { useDispatch, useSelector } from 'react-redux'
import { updateCurrentActiveNavKey, updateIsFixMenu } from './reducer'
import { useCallback } from 'react'
import { RootState } from 'store'
import { useWindowSize } from 'hooks/useWindowSize'
import { MEDIA_WIDTHS } from 'theme/styled'
import { useCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import { useActiveTab } from 'store/insights/hooks'
import { INSIGHTS_ACTIVE_TAB } from 'store/insights/insights'

export function useIsFixMenu(): [boolean, (newIsFixMenu: boolean) => void] {
  const dispatch = useDispatch()
  const { width } = useWindowSize()
  const [currentRouter] = useCurrentRouter()
  const [activeTab] = useActiveTab()
  const isFixMenu = useSelector((state: RootState) => state.headercache.isFixMenu)
  const dontUseFixMenu =
    !!(width && width < MEDIA_WIDTHS.minWidth1440) ||
    currentRouter.includes(ROUTER.USE_CASES) ||
    currentRouter.includes('agentmarket') ||
    currentRouter.includes('documents') ||
    (currentRouter.includes(ROUTER.INSIGHTS) && activeTab === INSIGHTS_ACTIVE_TAB.LIVECHAT)
  const setIsFixMenu = useCallback(
    (newIsFixMenu: boolean) => {
      dispatch(updateIsFixMenu(newIsFixMenu))
    },
    [dispatch],
  )

  return [isFixMenu && !dontUseFixMenu, setIsFixMenu]
}

export function useCurrentActiveNavKey(): [string, (newCurrentActiveNavKey: string) => void] {
  const dispatch = useDispatch()
  const currentActiveNavKey = useSelector((state: RootState) => state.headercache.currentActiveNavKey)

  const setCurrentActiveNavKey = useCallback(
    (newCurrentActiveNavKey: string) => {
      dispatch(updateCurrentActiveNavKey(newCurrentActiveNavKey))
    },
    [dispatch],
  )

  return [currentActiveNavKey, setCurrentActiveNavKey]
}
