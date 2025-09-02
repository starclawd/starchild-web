import { isLocalEnv, isPro } from 'utils/url'

export enum LOGIN_STATUS {
  NO_LOGIN,
  LOGINING,
  LOGGED,
}

export enum QRCODE_STATUS {
  PENDING = 'pending',
  SCANNED = 'scanned',
  EXPIRED = 'expired',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export interface QrCodeData {
  token: string
  expiredAt: number
  ipAddress: string
  device: string
  location: string
}

export interface QrStatusData {
  status: QRCODE_STATUS
  authToken: string
}

export interface UserInfoData {
  aiChatKey: string
  evmAddress: string
  solanaAddress: string
  telegramUserId: string
  telegramUserName: string
  telegramUserAvatar: string
  language: string
  inWhitelist: boolean
  burnAt: string
}

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username: string
  photo_url?: string
  auth_date: number
  hash: string
}

export interface TelegramLoginButtonProps {
  onAuth: (user: TelegramUser) => void
  size?: 'small' | 'medium' | 'large'
  children?: React.ReactNode
}

const tgOriginConfig = {
  dev: {
    username: 'HolomindsTgLoginBot',
    botId: '7566663122',
  },
  test: {
    username: 'onchain_aiagent_bot',
    botId: '7872801986',
  },
  pro: {
    username: 'iamstarchild_bot',
    botId: '7822088016',
  },
}

export const tgLoginConfig = isLocalEnv ? tgOriginConfig.dev : isPro ? tgOriginConfig.pro : tgOriginConfig.test

export const AUTH_TOKEN_SESSION = 'authTokenSession'
