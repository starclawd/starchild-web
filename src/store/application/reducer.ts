import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ApplicationModal, CoinIdData } from './application'

export interface ApplicationState {
  openModal: ApplicationModal | null
  htmlScollTop: number
  visualViewportHeight: number
  currentRouter: string
  coinIdList: CoinIdData[]
  isWindowVisible: boolean
  isShowMobileMenu: boolean
  isPopoverOpen: boolean
  bindWalletModalAddress: string | null
}

const initialState: ApplicationState = {
  openModal: null,
  htmlScollTop: 0,
  visualViewportHeight: 0,
  currentRouter: window.location.pathname,
  coinIdList: [],
  isWindowVisible: true,
  isShowMobileMenu: false,
  isPopoverOpen: false,
  bindWalletModalAddress: null,
}

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    updateOpenModal: (state, action: PayloadAction<ApplicationModal | null>) => {
      state.openModal = action.payload
    },
    setHtmlScrollTop: (state, action: PayloadAction<number>) => {
      state.htmlScollTop = action.payload
    },
    setVisualViewportHeight: (state, action: PayloadAction<number>) => {
      state.visualViewportHeight = action.payload
    },
    setCurrentRouter(state, action: PayloadAction<string>) {
      state.currentRouter = action.payload
    },
    setCoinIdList(state, action: PayloadAction<CoinIdData[]>) {
      state.coinIdList = action.payload
    },
    setIsWindowVisible(state, action: PayloadAction<boolean>) {
      state.isWindowVisible = action.payload
    },
    setIsShowMobileMenu(state, action: PayloadAction<boolean>) {
      state.isShowMobileMenu = action.payload
    },
    setIsPopoverOpen(state, action: PayloadAction<boolean>) {
      state.isPopoverOpen = action.payload
    },
    setBindWalletModalAddress(state, action: PayloadAction<string | null>) {
      state.bindWalletModalAddress = action.payload
    },
  },
})

export const {
  updateOpenModal,
  setHtmlScrollTop,
  setVisualViewportHeight,
  setCurrentRouter,
  setCoinIdList,
  setIsWindowVisible,
  setIsShowMobileMenu,
  setIsPopoverOpen,
  setBindWalletModalAddress,
} = applicationSlice.actions

export default applicationSlice.reducer
