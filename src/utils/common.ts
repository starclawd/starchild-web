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

/**
 * Google Analytics 事件追踪
 * @param eventName 事件名称
 * @param eventParams 事件参数
 * @param callback 可选的回调函数，在事件发送后执行
 */
export const trackEvent = (eventName: string, eventParams?: Record<string, any>, callback?: () => void) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      // 如果有回调函数，添加 event_callback
      if (callback) {
        let callbackExecuted = false
        const executeCallback = () => {
          if (!callbackExecuted) {
            callbackExecuted = true
            console.log('📊 GA Event callback executed:', eventName)
            callback()
          }
        }

        // 设置一个可靠的超时，确保回调一定会执行（即使 GA 的 event_callback 失败）
        const timeoutId = setTimeout(() => {
          console.warn('📊 GA Event timeout, executing callback anyway:', eventName)
          executeCallback()
        }, 500) // 500ms 超时，比 GA 的 event_timeout 更短

        const paramsWithCallback = {
          ...eventParams,
          event_callback: () => {
            clearTimeout(timeoutId)
            console.log('📊 GA Event sent:', eventName)
            executeCallback()
          },
          event_timeout: 2000, // 2秒超时作为备用
        }
        window.gtag('event', eventName, paramsWithCallback)
      } else {
        window.gtag('event', eventName, eventParams)
      }
      console.log('📊 GA Event triggered:', eventName, eventParams)
    } else {
      // 如果 gtag 不可用，直接执行回调
      console.warn('gtag not available, executing callback directly')
      callback?.()
    }
  } catch (error) {
    console.error('Failed to track event:', error)
    // 即使出错也执行回调，避免阻塞用户操作
    callback?.()
  }
}
