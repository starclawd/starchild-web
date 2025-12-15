import { keccak256, stringToHex } from 'viem'

export const BROKER_HASH = keccak256(stringToHex('orderly'))
export const USDC_TOKEN_HASH = keccak256(stringToHex('USDC'))

// Vault 合约地址
export const VAULT_CONTRACT_ADDRESSES = {
  production: '0x816f722424B49Cf1275cc86DA9840Fbd5a6167e9' as const,
  test: '0x0EaC556c0C2321BA25b9DC01e4e3c95aD5CDCd2f' as const,
} as const
