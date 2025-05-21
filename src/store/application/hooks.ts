import { useWindowSize } from "hooks/useWindowSize"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"
import { MEDIA_WIDTHS } from "theme/styled.d"
import { ApplicationModal } from "./application.d"
import { useCallback } from "react"
import { setCoinIdList, setCurrentRouter, setHtmlScrollTop, setVisualViewportHeight, updateOpenModal } from "./reducer"
import { useNavigate } from "react-router-dom"
import useParsedQueryString from "hooks/useParsedQueryString"
import { useLazyGetCoinIdQuery } from "api/coinmarket"

export function useIsMobile(): boolean {
  const { width } = useWindowSize()
  const isMobile = !!(width && width < MEDIA_WIDTHS.minWidth1024)
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

export function useWalletAddressModalToggle(): () => void {
  return useToggleModal(ApplicationModal.WALLET_ADDRESS_MODAL)
}

export function useSettingModalToggle(): () => void {
  return useToggleModal(ApplicationModal.SETTING_MODAL)
}

export function useCreateTaskModalToggle(): () => void {
  return useToggleModal(ApplicationModal.CREATE_TASK_MODAL)
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

export function useGetCoinId() {
  const [triggerGetCoinId] = useLazyGetCoinIdQuery()
  const dispatch = useDispatch()
  
  return useCallback(async () => {
    try {
      const data = await triggerGetCoinId(1)
      dispatch(setCoinIdList(data.data.values))
      return data
    } catch (error) {
      return error
    }
  }, [triggerGetCoinId, dispatch])
}

export function useCoinIdList() {
  const coinIdList = useSelector((state: RootState) => state.application.coinIdList)
  return coinIdList
}

export function useGetTokenImg() {
  const coinIdList = useCoinIdList()
  return useCallback((symbol: string) => {
    const tokenImg = coinIdList.find((item) => item[2]?.toLowerCase() === symbol.toLowerCase())
    if (symbol === 'ONDO') {
      return `https://oss.woo.network/static/symbol_logo/${symbol}.png`
    }
    return tokenImg ? `https://s2.coinmarketcap.com/static/img/coins/64x64/${tokenImg[0]}.png` : `https://oss.woo.network/static/symbol_logo/${symbol}.png`
  }, [coinIdList])
}