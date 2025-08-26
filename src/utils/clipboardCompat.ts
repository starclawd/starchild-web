/**
 * 剪贴板兼容性工具函数
 * 用于处理不同环境下的剪贴板操作，特别是 PC 端 Telegram miniapp 中 ClipboardItem 不支持的问题
 */

import copy from 'copy-to-clipboard'
import { isTelegramWebApp } from './telegramWebApp'

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
 * 兼容性复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise<boolean> 复制是否成功
 */
export async function copyTextCompat(text: string): Promise<boolean> {
  try {
    // pctg miniapp 降级到使用 document.execCommand (已废弃但仍有兼容性)
    if (isTelegramWebApp()) {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
      } catch (err) {
        console.error('Fallback copy failed', err)
      }
      document.body.removeChild(textarea)
    } else {
      // 首先尝试使用现代 API
      copy(text)
      return true
    }

    return false
  } catch (error) {
    console.error('Copy text failed:', error)
    return false
  }
}

/**
 * 兼容性复制图片和文本到剪贴板
 * @param imageBlob 图片 Blob 对象
 * @param text 要复制的文本
 * @returns Promise<{ success: boolean, copiedType: 'both' | 'text' | 'none' }> 复制结果
 */
export async function copyImageAndTextCompat(imageBlob: Blob, text: string): Promise<{ success: boolean }> {
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
        return { success: true }
      } catch (error) {
        console.warn('Failed to copy both image and text, fallback to text only:', error)
        // 如果复制图片和文本失败，尝试只复制文本
        const textSuccess = await copyTextCompat(text)
        return { success: textSuccess }
      }
    }

    // 如果不支持 ClipboardItem，只复制文本
    const textSuccess = await copyTextCompat(text)
    return { success: textSuccess }
  } catch (error) {
    console.error('Copy image and text failed:', error)
    return { success: false }
  }
}
