export type DateNumber = number
export type NumberString = string
export type Version = string
export type DateString = string
export type PriceString = string
export type VolumeString = string
export type CoinString = string
export type TotalCoinString = string
export type ProgressString = string
export type SumProgressString = string
export type UsdcOrCoinString = string
export type TotalUsdcOrCoinString = string
export type CommonFun<T> = (param?: T) => void
export type ParamFun<T> = (param: T) => void
export type PromiseReturnFun<T> = (param: T) => Promise<any>
export type EmptyReturnFun = () => Promise<any>
export type TradingDataFeedCallback = (...param: any) => any
export interface CommonObjType {
  [propName: string]: any
}

export enum OPEN_ALL_PERMISSIONS {
  MAIN_NET = 'mainnet',
}

declare module '*.json' {
  const value: any
  export default value
}
