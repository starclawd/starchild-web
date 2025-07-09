import { useCallback, useEffect, useState } from 'react'
import { useIsMobile } from 'store/application/hooks'
import { useIsLogin } from 'store/login/hooks'
import { useAuthToken } from 'store/logincache/hooks'
import { useIsFromTaskPage } from 'store/setting/hooks'
import { useAddNewThread, useIsChatPageLoaded } from 'store/tradeai/hooks'

// 速率限制器
class RateLimiter {
  private attempts: Map<string, number[]> = new Map()
  private readonly maxAttempts: number
  private readonly timeWindow: number

  constructor(maxAttempts: number = 60, timeWindow: number = 60000) {
    this.maxAttempts = maxAttempts
    this.timeWindow = timeWindow
  }

  canProceed(key: string): boolean {
    const now = Date.now()
    const attempts = this.attempts.get(key) || []

    // 清理过期的尝试记录
    const validAttempts = attempts.filter((time) => now - time < this.timeWindow)

    if (validAttempts.length >= this.maxAttempts) {
      console.warn(`Rate limit exceeded for ${key}`)
      return false
    }

    validAttempts.push(now)
    this.attempts.set(key, validAttempts)
    return true
  }
}

// 为TypeScript声明window上的flutter_inappwebview和holominds属性
declare global {
  interface Window {
    flutter_inappwebview?: {
      callHandler: (handlerName: string, data?: any, callback?: (response: any) => void) => void
      registerHandler: (
        handlerName: string,
        handler: (data: any, responseCallback: (response: any) => void) => void,
      ) => void
    }
    holominds?: {
      isLogin: boolean
      isChatPageLoaded?: boolean
      setAuthToken: (token: string) => void
      clearAuthToken: () => void
      sendChatContent: () => void
    }
  }
}

export const useJsBridge = () => {
  const isMobile = useIsMobile()
  const isLogin = useIsLogin()
  const [bridgeReady, setBridgeReady] = useState(false)
  const [, setAuthToken] = useAuthToken()
  const addNewThread = useAddNewThread()
  const [isChatPageLoaded] = useIsChatPageLoaded()
  const [, setIsFromTaskPage] = useIsFromTaskPage()

  // 创建速率限制器实例 - 使用useState确保稳定引用
  const [rateLimiter] = useState(() => new RateLimiter())

  const sendChatContent = useCallback(() => {
    addNewThread()
    setIsFromTaskPage(true)
    // setTimeout(() => {
    //   window.holominds?.realSendChatContent()
    // }, 300)
  }, [addNewThread, setIsFromTaskPage])

  // const realSendChatContent = useCallback(() => {
  //   sendAiContent({
  //     value: 'Test try it in chat'
  //   })
  // }, [sendAiContent])

  useEffect(() => {
    // 添加输入验证函数
    const validateToken = (token: string): boolean => {
      if (typeof token !== 'string') return false
      if (token.length === 0 || token.length > 1000) return false
      // 检查是否包含可疑字符
      if (/[<>'"&]/.test(token)) return false
      return true
    }

    // 包装敏感方法
    const secureBridge = {
      isLogin,
      isChatPageLoaded,
      setAuthToken: (token: string) => {
        if (!rateLimiter.canProceed('setAuthToken')) return
        if (!validateToken(token)) {
          console.warn('Invalid token provided to setAuthToken')
          return
        }
        setAuthToken(token)
      },
      clearAuthToken: () => {
        if (!rateLimiter.canProceed('clearAuthToken')) return
        setAuthToken('')
      },
      sendChatContent: () => {
        if (!rateLimiter.canProceed('sendChatContent')) return
        sendChatContent()
      },
    }

    // 初始化window.holominds对象
    if (!window.holominds) {
      window.holominds = secureBridge
    } else {
      // 更新现有对象的属性
      Object.assign(window.holominds, secureBridge)
    }

    const checkBridge = () => {
      if (window.flutter_inappwebview) {
        setBridgeReady(true)
        return
      }

      // 如果没有找到 jsBridge，500ms 后重试
      setTimeout(checkBridge, 500)
    }
    if (isMobile) {
      checkBridge()
    }
  }, [isLogin, isMobile, isChatPageLoaded, setAuthToken, sendChatContent, rateLimiter])

  const callHandler = useCallback((handlerName: string, data?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!window.flutter_inappwebview) {
        reject(new Error('JSBridge 未初始化'))
        return
      }

      try {
        window.flutter_inappwebview.callHandler(handlerName, data, (response) => {
          resolve(response || '')
        })
      } catch (error) {
        reject(error)
      }
    })
  }, [])

  const registerHandler = useCallback(
    (handlerName: string, handler: (data: any, responseCallback: (response: any) => void) => void) => {
      if (!window.flutter_inappwebview) {
        console.error('JSBridge 未初始化')
        return
      }

      window.flutter_inappwebview.registerHandler(handlerName, handler)
    },
    [],
  )

  // 具体的 getAuthToken 实现
  const getAuthToken = useCallback(async (): Promise<any> => {
    try {
      const response = await callHandler('getAuthToken')
      setAuthToken(response)
    } catch (error) {
      console.error('获取 AuthToken 失败:', error)
      throw error
    }
  }, [setAuthToken, callHandler])

  return {
    bridgeReady,
    callHandler,
    registerHandler,
    getAuthToken,
  }
}

export default useJsBridge
