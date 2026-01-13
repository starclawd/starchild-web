export interface ApproveWalletInfo {
  agentAddress: string
  privateKey: string
}

export interface LocalApproveWalletType {
  [account: string]: ApproveWalletInfo
}
