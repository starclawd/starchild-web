export interface CandidateStatusDataType extends Record<string, any> {
  burnAt: string
  hasMinted: boolean
  inWhitelist: boolean
  inWaitList: boolean
  burnNftIconUrl: string
  nftIconUrl: string
  mintEligibleAt: number
}
