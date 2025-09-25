// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let lastExecTime = 0
  return (...args: Parameters<T>) => {
    const currentTime = Date.now()
    if (currentTime - lastExecTime > delay) {
      func(...args)
      lastExecTime = currentTime
    }
  }
}

// 获取 favicon URL
export const getFaviconUrl = (id: string): [string, string] => {
  if (!id) return ['', '']
  try {
    const urlPattern = /(https?:\/\/[^\s?]+)/
    const match = id.match(urlPattern)
    const url = match ? match[1] : id.split('?')[0]

    // 从URL中提取主域名
    const urlObj = new URL(url)
    const hostParts = urlObj.hostname.split('.')
    const mainDomain =
      hostParts.length >= 2 ? `${hostParts[hostParts.length - 2]}.${hostParts[hostParts.length - 1]}` : urlObj.hostname
    const origin = `https://${mainDomain}`
    return [origin, `https://www.google.com/s2/favicons?domain=${origin}&sz=32`]
  } catch (e) {
    return ['', '']
  }
}

// 获取域名主体部分
export const getDomain = (url: string | undefined): string => {
  if (!url) return ''
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
    const hostname = urlObj.hostname
    const parts = hostname.split('.')
    // 只提取域名主体部分，不包括顶级域名后缀
    if (parts.length >= 2) {
      return parts[parts.length - 2] // 取倒数第二个部分
    }
    return hostname
  } catch {
    return ''
  }
}
