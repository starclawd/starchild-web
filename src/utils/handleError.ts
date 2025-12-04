export function handleError(error: any) {
  if (error?.reason) {
    error.message = error?.reason
  }
  if (String(error.message).length > 300) {
    error.message = String(error.message).slice(0, 300)
  }
  return error
}

/**
 * 格式化链上错误信息，提取关键部分
 * @param error 错误对象
 * @param maxLength 最大长度，默认 100
 * @returns 格式化后的错误信息
 */
export function formatContractError(error: any, maxLength = 100): string {
  if (!error) return ''

  let message = error?.shortMessage || error?.reason || error?.message || ''

  if (!message) return ''

  message = String(message)

  // 尝试提取 revert reason
  const revertMatch = message.match(/reverted with reason string ['"](.+?)['"]/i)
  if (revertMatch?.[1]) {
    message = revertMatch[1]
  }

  // 尝试提取 Error: 后面的内容
  const errorMatch = message.match(/Error:\s*(.+?)(?:\n|$)/i)
  if (errorMatch?.[1]) {
    message = errorMatch[1]
  }

  // 移除合约地址等技术细节
  message = message.replace(/0x[a-fA-F0-9]{40}/g, '').trim()

  // 如果还是太长，截取并添加省略号
  if (message.length > maxLength) {
    message = message.slice(0, maxLength) + '...'
  }

  return message
}
