import { useWindowSize } from "hooks/useWindowSize"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"
import { MEDIA_WIDTHS } from "theme"
import { ApplicationModal } from "./application.d"
import { useCallback } from "react"
import { setCurrentRouter, setHtmlScrollTop, setVisualViewportHeight, updateOpenModal } from "./reducer"
import { useNavigate } from "react-router-dom"
import useParsedQueryString from "hooks/useParsedQueryString"

export function useIsMobile(): boolean {
  const { width } = useWindowSize()
  const isMobile = !!(width && width < MEDIA_WIDTHS.mobileWidth)
  return isMobile
}

export function useModalOpen(modal: ApplicationModal): boolean {
  const openModal = useSelector((state: RootState) => state.application.openModal)
  return openModal === modal
}

export function useToggleModal(modal: ApplicationModal): () => void {
  const open = useModalOpen(modal)
  const dispatch = useDispatch()
  return useCallback(() => {
    dispatch(updateOpenModal(open ? null : modal))
  }, [dispatch, modal, open])
}


export function useCreateIdeaModalToggle(): () => void {
  const dispatch = useDispatch()
  return () => dispatch(updateOpenModal(ApplicationModal.CREATE_IDEA_MODAL))
}

export function useDislikeModalToggle(): () => void {
  return useToggleModal(ApplicationModal.DISLIKE_MODAL)
}

export function useShareModalToggle(): () => void {
  return useToggleModal(ApplicationModal.SHARE)
}

export function useAddQuestionModalToggle(): () => void {
  return useToggleModal(ApplicationModal.ADD_QUESTION_MODAL)
}

export function useQrCodeModalToggle(): () => void {
  return useToggleModal(ApplicationModal.QR_CODE_MODAL)
}

// ios键盘撑起页面后导致html滚动，获取滚动高度
export function useMobileHtmlScrollTop(): [number, (param: number) => void] {
  const dispatch = useDispatch()
  const htmlScollTop = useSelector((state: RootState) => state.application.htmlScollTop)
  const changeHtmlScrollTop = useCallback((htmlScollTop: number) => {
    dispatch(setHtmlScrollTop(htmlScollTop))
  }, [dispatch])
  return [htmlScollTop, changeHtmlScrollTop]
}

// ios键盘撑起后html没有滚动，获取除键盘区域高度
export function useVisualViewportHeight(): [number, (param: number) => void] {
  const dispatch = useDispatch()
  const visualViewportHeight = useSelector((state: RootState) => state.application.visualViewportHeight)
  const changeVisualViewportHeight = useCallback((visualViewportHeight: number) => {
    dispatch(setVisualViewportHeight(visualViewportHeight))
  }, [dispatch])
  return [visualViewportHeight, changeVisualViewportHeight]
}

export function useShareUrl(): string {
  return ''
}

export function useGetRouteByPathname() {
  return useCallback((path: string) => {
    let route = path.split('?')[0].split('#')[0]
    route = `/${route.split('/')[1]}`
    return route
  }, [])
}

export function useCurrentRouter(needPush = true): [string, (router: string) => void] {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const getRouteByPathname = useGetRouteByPathname()
  const { openAllPermissions } = useParsedQueryString()
  const currentRouter = useSelector((state: RootState) => state.application.currentRouter)
  const setRouter = useCallback((router: string) => {
    const route = getRouteByPathname(router)
    if (needPush) {
      let routerText = router
      if (openAllPermissions) {
        routerText = `${routerText}${routerText.indexOf('?') > -1 ? '&' : '?'}openAllPermissions=${openAllPermissions}`
      }
      navigate(routerText)
    }
    dispatch(setCurrentRouter(route))
  }, [needPush, openAllPermissions, navigate, dispatch, getRouteByPathname])
  return [currentRouter, setRouter]
}