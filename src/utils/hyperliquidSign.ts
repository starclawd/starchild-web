/**
 * Hyperliquid L1 Action 签名工具
 * 基于 nktkas/hyperliquid 库的实现
 */

import { encode as encodeMsgpack } from '@msgpack/msgpack'
import { keccak256, toBytes, toHex, concat } from 'viem'
import type { LocalAccount } from 'viem'

// 签名对象类型
export interface Signature {
  r: `0x${string}`
  s: `0x${string}`
  v: 27 | 28
}

// L1 action 签名使用固定的 chainId 1337
const L1_CHAIN_ID = 1337n

// EIP-712 Domain 配置
const L1_DOMAIN = {
  name: 'Exchange',
  version: '1',
  chainId: L1_CHAIN_ID,
  verifyingContract: '0x0000000000000000000000000000000000000000' as `0x${string}`,
} as const

// EIP-712 Types - L1 Action 使用 Agent 类型
// 注意：viem 的 signTypedData 会自动处理 EIP712Domain，不要手动添加
const L1_TYPES = {
  Agent: [
    { name: 'source', type: 'string' },
    { name: 'connectionId', type: 'bytes32' },
  ],
} as const

/**
 * 将数字转换为 uint64 大端字节数组
 */
function toUint64Bytes(n: bigint | number): Uint8Array {
  const bytes = new Uint8Array(8)
  new DataView(bytes.buffer).setBigUint64(0, BigInt(n))
  return bytes
}

/**
 * 将大整数转换为 BigInt（用于 MessagePack 编码）
 * MessagePack 对于大整数需要特殊处理
 */
function largeIntToBigInt(obj: unknown): unknown {
  if (typeof obj === 'number' && Number.isInteger(obj) && (obj >= 0x100000000 || obj < -0x80000000)) {
    return BigInt(obj)
  }
  if (Array.isArray(obj)) return obj.map(largeIntToBigInt)
  if (typeof obj === 'object' && obj !== null) {
    const result: Record<string, unknown> = {}
    for (const key in obj) {
      result[key] = largeIntToBigInt((obj as Record<string, unknown>)[key])
    }
    return result
  }
  return obj
}

/**
 * 移除对象中的 undefined 键
 */
function removeUndefinedKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(removeUndefinedKeys)
  if (typeof obj === 'object' && obj !== null) {
    const result: Record<string, unknown> = {}
    for (const key in obj) {
      if ((obj as Record<string, unknown>)[key] !== undefined) {
        result[key] = removeUndefinedKeys((obj as Record<string, unknown>)[key])
      }
    }
    return result
  }
  return obj
}

/**
 * 将 hex 字符串转换为 Uint8Array
 */
function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex
  const bytes = new Uint8Array(cleanHex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16)
  }
  return bytes
}

/**
 * 创建 L1 action 的 hash
 *
 * 计算方式：keccak256(msgpack(action) + nonce_bytes + vault_marker + [vault_bytes] + [expires_marker] + [expires_bytes])
 */
export function createL1ActionHash(args: {
  /** action 对象（hash 依赖于 key 的顺序） */
  action: Record<string, unknown> | unknown[]
  /** 当前时间戳（毫秒） */
  nonce: number
  /** 可选的 vault 地址 */
  vaultAddress?: `0x${string}`
  /** 可选的过期时间（毫秒时间戳） */
  expiresAfter?: number
}): `0x${string}` {
  const { action, nonce, vaultAddress, expiresAfter } = args

  // 1. 使用 MessagePack 编码 action
  const processedAction = largeIntToBigInt(removeUndefinedKeys(action))
  const actionBytes = encodeMsgpack(processedAction)

  // 2. Nonce 转换为 uint64 大端字节
  const nonceBytes = toUint64Bytes(nonce)

  // 3. Vault address 处理
  const vaultMarker = vaultAddress ? new Uint8Array([1]) : new Uint8Array([0])
  const vaultBytes = vaultAddress ? hexToBytes(vaultAddress.slice(2)) : new Uint8Array()

  // 4. Expires after 处理
  const expiresMarker = expiresAfter !== undefined ? new Uint8Array([0]) : new Uint8Array()
  const expiresBytes = expiresAfter !== undefined ? toUint64Bytes(expiresAfter) : new Uint8Array()

  // 5. 拼接所有字节
  const totalLength =
    actionBytes.length +
    nonceBytes.length +
    vaultMarker.length +
    vaultBytes.length +
    expiresMarker.length +
    expiresBytes.length
  const bytes = new Uint8Array(totalLength)
  let offset = 0

  bytes.set(actionBytes, offset)
  offset += actionBytes.length

  bytes.set(nonceBytes, offset)
  offset += nonceBytes.length

  bytes.set(vaultMarker, offset)
  offset += vaultMarker.length

  if (vaultBytes.length > 0) {
    bytes.set(vaultBytes, offset)
    offset += vaultBytes.length
  }

  if (expiresMarker.length > 0) {
    bytes.set(expiresMarker, offset)
    offset += expiresMarker.length
  }

  if (expiresBytes.length > 0) {
    bytes.set(expiresBytes, offset)
  }

  // 6. 计算 keccak256 hash
  const hash = keccak256(bytes)
  return hash
}

/**
 * 将签名字符串解析为 { r, s, v } 对象
 */
function splitSignature(signature: `0x${string}`): Signature {
  const r = `0x${signature.slice(2, 66)}` as `0x${string}`
  const s = `0x${signature.slice(66, 130)}` as `0x${string}`
  const v = parseInt(signature.slice(130, 132), 16) as 27 | 28
  return { r, s, v }
}

/**
 * 签名 L1 action
 *
 * @param args.wallet - 用于签名的钱包账户
 * @param args.action - 要签名的 action 对象
 * @param args.nonce - 当前时间戳（毫秒）
 * @param args.isTestnet - 是否为测试网（默认 false）
 * @param args.vaultAddress - 可选的 vault 地址
 * @param args.expiresAfter - 可选的过期时间
 */
export async function signL1Action(args: {
  wallet: LocalAccount
  action: Record<string, unknown> | unknown[]
  nonce: number
  isTestnet?: boolean
  vaultAddress?: `0x${string}`
  expiresAfter?: number
}): Promise<Signature> {
  const { wallet, action, nonce, isTestnet = false, vaultAddress, expiresAfter } = args

  // 计算 connectionId (action hash)
  const connectionId = createL1ActionHash({ action, nonce, vaultAddress, expiresAfter })

  // 使用 EIP-712 签名
  const signatureHex = await wallet.signTypedData({
    domain: L1_DOMAIN,
    types: L1_TYPES,
    primaryType: 'Agent',
    message: {
      source: isTestnet ? 'b' : 'a',
      connectionId,
    },
  })

  return splitSignature(signatureHex)
}
