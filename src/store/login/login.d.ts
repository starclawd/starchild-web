export enum LOGIN_STATUS {
  NO_LOGIN,
  LOGINING,
  LOGGED,
}

export enum QRCODE_STATUS {
  PENDING = 'pending',
  EXPIRED = 'expired',
  CONFIRMED = 'confirmed',
}

export interface QrCodeData {
  token: string,
  expiredAt: number,
  ipAddress: string,
  device: string,
  location: string,
}

export interface QrStatusData {
  status: QRCODE_STATUS,
  authToken: string,
}

export interface UserInfoData {
  aiChatKey: string,
  evmAddress: string,
  solanaAddress: string,
}

export const AUTH_TOKEN_SESSION = 'authTokenSession'