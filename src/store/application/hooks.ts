import { useWindowSize } from "hooks/useWindowSize"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"
import { MEDIA_WIDTHS } from "styles/theme"
import { ApplicationModal } from "./application.d"
import { useCallback } from "react"
import { setHtmlScrollTop, setVisualViewportHeight, updateOpenModal } from "./reducer"

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

export function useShareModalToggle(): () => void {
  return useToggleModal(ApplicationModal.SHARE)
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
