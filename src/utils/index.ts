import { Chain, CHAIN_INFO } from "constants/chainInfo";

export function isMatchCurrentRouter(currentRouter: string, matchRouter: string) {
  try {
    return currentRouter.toLowerCase() === matchRouter.toLowerCase()
  } catch (error) {
    return false
  }
}

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}

export const getFileType = (fileType: string) => {
  if (fileType.startsWith('image/')) return 'Image';
  if (fileType.startsWith('video/')) return 'Video';
  if (fileType.startsWith('audio/')) return 'Audio';
  if (fileType.startsWith('text/')) return 'Text';
  if (fileType.includes('pdf')) return 'PDF';
  if (fileType.includes('excel') || fileType.includes('sheet')) return 'Excel';
  if (fileType.includes('word') || fileType.includes('document')) return 'Word';
  return 'File';
};

export const getTokenImg = (symbol: string) => {
  return `https://oss.woo.network/static/symbol_logo/${symbol}.png`
}

export function getExplorerLink(chain: Chain, hash: string): string {
  const prefix = CHAIN_INFO[chain].explorer
  return `${prefix}/tx/${hash}`
}