import { useMemo } from 'react'
import { Address, keccak256, encodeAbiParameters, parseAbiParameters, Hex } from 'viem'
import { BROKER_HASH } from 'constants/brokerHash'

/**
 * 计算 Orderly Vault 的 accountId
 * accountId = keccak256(abi.encode(address, brokerHash))
 *
 * @param address - 用户钱包地址
 * @returns accountId (bytes32) 或 undefined
 */
export function useAccountId(address: Address | string | undefined): Hex | undefined {
  return useMemo(() => {
    if (!address) return undefined
    const encoded = encodeAbiParameters(parseAbiParameters('address, bytes32'), [address as Address, BROKER_HASH])
    return keccak256(encoded) as Hex
  }, [address])
}
