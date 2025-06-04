import { useScrollbarClass } from 'hooks/useScrollbarClass'
import CryptoChart from 'pages/BackTest/components/CryptoChart'
import styled from 'styled-components'
import { useState, useCallback, useEffect } from 'react'

// 声明 Telegram WebView 类型
declare global {
  interface Window {
    TelegramWebview?: {
      post: (method: string, params?: any) => void
      resolveShare: (shareUrl: string) => void
    }
  }
}

const MobileBackTestWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  overflow: hidden;
  padding: 12px;
  cursor: pointer;
  @media screen and (orientation:landscape) {
    width: 100vw;
    height: 100vh;
  }
`

export default function MobileBackTest() {
  const backTestWrapperRef = useScrollbarClass<HTMLDivElement>()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isTelegramWebView, setIsTelegramWebView] = useState(false)

  // 检测是否在 Telegram WebView 环境中
  useEffect(() => {
    const checkTelegramWebView = () => {
      return !!(window.TelegramWebview)
    }
    
    setIsTelegramWebView(checkTelegramWebView())
  }, [])

  const handleFullscreenToggle = useCallback(async () => {
    try {
      if (isTelegramWebView && window.TelegramWebview) {
        // Telegram WebView 环境
        if (!isFullscreen) {
          // 请求进入全屏模式
          window.TelegramWebview.post('web_app_expand')
          setIsFullscreen(true)
        } else {
          // 请求退出全屏模式
          window.TelegramWebview.post('web_app_close')
          setIsFullscreen(false)
        }
      } else {
        // 普通浏览器环境
        if (!isFullscreen) {
          // 进入全屏
          if (backTestWrapperRef.current?.requestFullscreen) {
            await backTestWrapperRef.current.requestFullscreen()
            setIsFullscreen(true)
          }
        } else {
          // 退出全屏
          if (document.exitFullscreen) {
            await document.exitFullscreen()
            setIsFullscreen(false)
          }
        }
      }
    } catch (error) {
      console.error('全屏切换失败:', error)
    }
  }, [isFullscreen, backTestWrapperRef, isTelegramWebView])

  // 监听浏览器全屏状态变化（非 Telegram 环境）
  useEffect(() => {
    if (isTelegramWebView) return

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [isTelegramWebView])

  return <MobileBackTestWrapper 
    ref={backTestWrapperRef as any}
    onClick={handleFullscreenToggle}
  >
    <CryptoChart
      symbol="BTC"
      ref={backTestWrapperRef as any}
      isBinanceSupport={true}
      isMobileBackTestPage={true}
    />
  </MobileBackTestWrapper>
}
