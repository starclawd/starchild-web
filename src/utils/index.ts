import { Chain, CHAIN_INFO, SupportedChain } from 'constants/chainInfo'

export function isMatchCurrentRouter(currentRouter: string, matchRouter: string) {
  try {
    return currentRouter.toLowerCase() === matchRouter.toLowerCase()
  } catch (error) {
    return false
  }
}

export function isMatchFatherRouter(currentRouter: string, fatherRouter: string) {
  try {
    return currentRouter.toLowerCase().startsWith(`${fatherRouter.toLowerCase()}/`)
  } catch (error) {
    return false
  }
}

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) {
    return `${bytes} B`
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }
}

export const getFileType = (fileType: string) => {
  if (fileType.startsWith('image/')) return 'Image'
  if (fileType.startsWith('video/')) return 'Video'
  if (fileType.startsWith('audio/')) return 'Audio'
  if (fileType.startsWith('text/')) return 'Text'
  if (fileType.includes('pdf')) return 'PDF'
  if (fileType.includes('excel') || fileType.includes('sheet')) return 'Excel'
  if (fileType.includes('word') || fileType.includes('document')) return 'Word'
  return 'File'
}

export function getExplorerLink(chain: Chain, hash: string): string {
  const prefix = CHAIN_INFO[chain as SupportedChain]?.explorer
  if (!prefix) {
    throw new Error(`Chain ${chain} is not supported`)
  }
  return `${prefix}/tx/${hash}`
}

export function handleSignature(signature: string) {
  return signature.replace('0x', '')
}

export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function getChainLabel(address: string): string {
  return address.startsWith('0x') ? 'EVM' : 'SOLANA'
}

export function addUrlParam(key: string, value: string) {
  const url = new URL(window.location.href)
  url.searchParams.set(key, value)
  window.history.replaceState({}, '', url.toString())
}
