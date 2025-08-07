export interface CandidateStatusDataType extends Record<string, any> {
  burnAt: string
  hasMinted: boolean
  inWhitelist: boolean
  inWaitList: boolean
}
