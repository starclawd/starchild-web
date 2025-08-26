/**
 * 剪贴板兼容性工具函数
 * 用于处理不同环境下的剪贴板操作，特别是 PC 端 Telegram miniapp 中 ClipboardItem 不支持的问题
 */

/**
 * 检查是否支持 ClipboardItem
 */
export function isClipboardItemSupported(): boolean {
  return typeof ClipboardItem !== 'undefined'
}

/**
 * 检查是否支持 navigator.clipboard.write
 */
export function isClipboardWriteSupported(): boolean {
  return typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.write === 'function'
}

/**
 * 检查是否支持 navigator.clipboard.writeText
 */
export function isClipboardWriteTextSupported(): boolean {
  return typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function'
}

/**
 * 兼容性复制图片和文本到剪贴板
 * @param imageBlob 图片 Blob 对象
 * @param text 要复制的文本
 * @returns Promise<{ success: boolean, copiedType: 'both' | 'text' | 'none' }> 复制结果
 */
export async function copyImageAndTextCompat(
  imageBlob: Blob,
  text: string,
): Promise<{ success: boolean; copiedType: 'both' | 'text' | 'none' }> {
  try {
    // 检查是否支持现代剪贴板API和ClipboardItem
    if (isClipboardWriteSupported() && isClipboardItemSupported()) {
      try {
        const textBlob = new Blob([text], { type: 'text/plain' })
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/plain': textBlob,
            [imageBlob.type]: imageBlob,
          }),
        ])
        return { success: true, copiedType: 'both' }
      } catch (error) {
        console.warn('Failed to copy both image and text, fallback to text only:', error)
        return { success: false, copiedType: 'none' }
      }
    }

    // 如果不支持 ClipboardItem，只复制文本
    return { success: false, copiedType: 'none' }
  } catch (error) {
    console.error('Copy image and text failed:', error)
    return { success: false, copiedType: 'none' }
  }
}

/**
 * 获取环境信息，用于调试
 */
export function getClipboardSupportInfo() {
  return {
    hasNavigator: typeof navigator !== 'undefined',
    hasClipboard: typeof navigator !== 'undefined' && !!navigator.clipboard,
    hasClipboardWrite: isClipboardWriteSupported(),
    hasClipboardWriteText: isClipboardWriteTextSupported(),
    hasClipboardItem: isClipboardItemSupported(),
    hasDocumentExecCommand: typeof document !== 'undefined' && !!document.execCommand,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
  }
}
