import { keccak256, stringToHex } from 'viem'
export const BROKER_HASH = keccak256(stringToHex('orderly'))
