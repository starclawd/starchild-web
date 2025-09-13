export enum ApplicationModal {
  SHARE,
  CREATE_IDEA_MODAL,
  QR_CODE_MODAL,
  ADD_QUESTION_MODAL,
  DISLIKE_MODAL,
  WALLET_ADDRESS_MODAL,
  SETTING_MODAL,
  CREATE_AGENT_MODAL,
  DELETE_MY_AGENT_MODAL,
}

export interface ImgListType {
  key: string
  id: string
  customerItem: ReactNode
}

export enum MOBILE_TABS_TYPE {
  BORDER,
  COMMON,
}

type ID = number
type NAME = string
type SYMBOL = string
export type CoinIdData = [ID, NAME, SYMBOL]
