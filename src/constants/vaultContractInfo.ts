import { keccak256, stringToHex } from 'viem'

export const USDC_HASH = keccak256(stringToHex('USDC'))
