import { useWindowSize } from 'hooks/useWindowSize'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { MEDIA_WIDTHS } from 'theme/styled.d'
import { ApplicationModal } from './application.d'
import { useCallback } from 'react'
import {
  setCoinIdList,
  setCurrentRouter,
  setHtmlScrollTop,
  setIsWindowVisible,
  setIsShowMobileMenu,
  setVisualViewportHeight,
  updateOpenModal,
  setIsPopoverOpen,
  setBindWalletModalAddress,
} from './reducer'
import { useNavigate } from 'react-router-dom'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useLazyGetCoinIdQuery } from 'api/coinmarket'
import { useCandidateStatus } from 'store/home/hooks'

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

export function useShareModalToggle(): () => void {
  return useToggleModal(ApplicationModal.SHARE)
}

export function useAddQuestionModalToggle(): () => void {
  return useToggleModal(ApplicationModal.ADD_QUESTION_MODAL)
}

export function useEditStrategyInfoModalToggle(): () => void {
  return useToggleModal(ApplicationModal.EDIT_STRATEGY_INFO_MODAL)
}

export function useWalletAddressModalToggle(): () => void {
  return useToggleModal(ApplicationModal.WALLET_ADDRESS_MODAL)
}

export function useAccountManegeModalToggle(): () => void {
  return useToggleModal(ApplicationModal.ACCOUNT_MANEGE_MODAL)
}

export function useEditNicknameModalToggle(): () => void {
  return useToggleModal(ApplicationModal.EDIT_NICKNAME_MODAL)
}
export function usePreferenceModalToggle(): () => void {
  return useToggleModal(ApplicationModal.PREFERENCE_MODAL)
}

export function useCreateAgentModalToggle(): () => void {
  return useToggleModal(ApplicationModal.CREATE_AGENT_MODAL)
}

export function useDeleteMyAgentModalToggle(): () => void {
  return useToggleModal(ApplicationModal.DELETE_MY_AGENT_MODAL)
}

export function useSocialLoginModalToggle(): () => void {
  return useToggleModal(ApplicationModal.SOCIAL_LOGIN_MODAL)
}

export function useQrCodeModalToggle(): () => void {
  return useToggleModal(ApplicationModal.QR_CODE_MODAL)
}

// 绑定钱包弹窗状态管理
export function useBindWalletModalToggle(): () => void {
  return useToggleModal(ApplicationModal.BIND_WALLET_MODAL)
}

export function useDepositAndWithdrawModalToggle(): () => void {
  return useToggleModal(ApplicationModal.DEPOSIT_AND_WITHDRAW_MODAL)
}

export function useConnectWalletModalToggle(): () => void {
  return useToggleModal(ApplicationModal.CONNECT_WALLET_MODAL)
}

export function useSwitchChainModalToggle(): () => void {
  return useToggleModal(ApplicationModal.SWITCH_CHAIN_MODAL)
}

// 获取绑定钱包地址数据
export function useBindWalletModalAddress(): string | null {
  return useSelector((state: RootState) => state.application.bindWalletModalAddress)
}

// 打开绑定钱包弹窗，传入地址表示编辑模式，不传表示创建模式
export function useOpenBindWalletModal(): (address?: string) => void {
  const dispatch = useDispatch()
  return useCallback(
    (address?: string) => {
      dispatch(setBindWalletModalAddress(address || null))
      dispatch(updateOpenModal(ApplicationModal.BIND_WALLET_MODAL))
    },
    [dispatch],
  )
}

// 关闭绑定钱包弹窗时清理数据
export function useCloseBindWalletModal(): () => void {
  const dispatch = useDispatch()
  return useCallback(() => {
    dispatch(setBindWalletModalAddress(null))
    dispatch(updateOpenModal(null))
  }, [dispatch])
}

// ios键盘撑起页面后导致html滚动，获取滚动高度
export function useMobileHtmlScrollTop(): [number, (param: number) => void] {
  const dispatch = useDispatch()
  const htmlScollTop = useSelector((state: RootState) => state.application.htmlScollTop)
  const changeHtmlScrollTop = useCallback(
    (htmlScollTop: number) => {
      dispatch(setHtmlScrollTop(htmlScollTop))
    },
    [dispatch],
  )
  return [htmlScollTop, changeHtmlScrollTop]
}

// ios键盘撑起后html没有滚动，获取除键盘区域高度
export function useVisualViewportHeight(): [number, (param: number) => void] {
  const dispatch = useDispatch()
  const visualViewportHeight = useSelector((state: RootState) => state.application.visualViewportHeight)
  const changeVisualViewportHeight = useCallback(
    (visualViewportHeight: number) => {
      dispatch(setVisualViewportHeight(visualViewportHeight))
    },
    [dispatch],
  )
  return [visualViewportHeight, changeVisualViewportHeight]
}

export function useShareUrl(): string {
  return ''
}

export function useGetRouteByPathname() {
  return useCallback((path: string) => {
    let route = path.split('?')[0].split('#')[0]
    if (route.endsWith('/') && route !== '/') {
      route = route.split('/').slice(0, -1).join('/')
    }
    return route
  }, [])
}

export function useCurrentRouter(needPush = true): [string, (router: string) => void] {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const getRouteByPathname = useGetRouteByPathname()
  const { openAllPermissions, testChartImg } = useParsedQueryString()
  const currentRouter = useSelector((state: RootState) => state.application.currentRouter)
  const setRouter = useCallback(
    (router: string) => {
      const route = getRouteByPathname(router)
      if (needPush) {
        let routerText = router
        if (openAllPermissions) {
          routerText = `${routerText}${routerText.indexOf('?') > -1 ? '&' : '?'}openAllPermissions=${openAllPermissions}`
        }
        if (testChartImg) {
          routerText = `${routerText}${routerText.indexOf('?') > -1 ? '&' : '?'}testChartImg=${testChartImg}`
        }
        navigate(routerText)
      }
      dispatch(setCurrentRouter(route))
    },
    [needPush, openAllPermissions, testChartImg, navigate, dispatch, getRouteByPathname],
  )
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
  return useCallback(
    (symbol: string) => {
      const tokenImg = coinIdList.find((item) => item[2]?.toLowerCase() === symbol.toLowerCase())
      if (symbol === 'ONDO' || symbol === 'WLD') {
        return `https://oss.woo.network/static/symbol_logo/${symbol}.png`
      }
      return tokenImg
        ? `https://s2.coinmarketcap.com/static/img/coins/128x128/${tokenImg[0]}.png`
        : `https://oss.woo.network/static/symbol_logo/${symbol}.png`
    },
    [coinIdList],
  )
}

export function useIsWindowVisible(): [boolean, (isWindowVisible: boolean) => void] {
  const dispatch = useDispatch()
  const isWindowVisible = useSelector((state: RootState) => state.application.isWindowVisible)
  const changeIsWindowVisible = useCallback(
    (isWindowVisible: boolean) => {
      dispatch(setIsWindowVisible(isWindowVisible))
    },
    [dispatch],
  )
  return [isWindowVisible, changeIsWindowVisible]
}

export function useIsShowMobileMenu(): [boolean, (isShowMobileMenu: boolean) => void] {
  const dispatch = useDispatch()
  const isShowMobileMenu = useSelector((state: RootState) => state.application.isShowMobileMenu)
  const changeIsShowMobileMenu = useCallback(
    (isShowMobileMenu: boolean) => {
      dispatch(setIsShowMobileMenu(isShowMobileMenu))
    },
    [dispatch],
  )
  return [isShowMobileMenu, changeIsShowMobileMenu]
}

export function useIsWhiteList(): boolean {
  const [{ inWhitelist }] = useCandidateStatus()
  return inWhitelist
}

export function useIsBindTelegram(): boolean {
  const [{ burnAt }] = useCandidateStatus()
  return !!burnAt
}

export function useIsPopoverOpen(): [boolean, (isOpen: boolean) => void] {
  const dispatch = useDispatch()
  const isPopoverOpen = useSelector((state: RootState) => state.application.isPopoverOpen)
  const setPopoverOpen = useCallback(
    (isOpen: boolean) => {
      dispatch(setIsPopoverOpen(isOpen))
    },
    [dispatch],
  )
  return [isPopoverOpen, setPopoverOpen]
}
