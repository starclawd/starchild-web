import { isPro } from 'utils/url'

export const PAGE_SIZE = 10

export const ANI_DURATION = 0.2

// 动画时长常量（5秒）
export const TYPING_ANIMATION_DURATION = 5000

export const LOCAL_AUTHTOKEN = import.meta.env.VITE_TG_AUTH_TOKEN || ''

export const MOBILE_DESIGN_WIDTH = 375

export const SHOW_APR_AGE_DAYS = isPro ? 30 : 7

// Agent Hub constants
export * from './agentHub'
