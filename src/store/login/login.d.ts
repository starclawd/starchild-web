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

export interface qrCodeData {
  token: string,
  expiredAt: number,
  ipAddress: string,
  device: string,
  location: string,
}

export interface qrStatusData {
  status: QRCODE_STATUS,
  authToken: string,
}

export const AUTH_TOKEN_SESSION = 'authTokenSession'