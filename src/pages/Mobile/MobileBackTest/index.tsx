import { useScrollbarClass } from 'hooks/useScrollbarClass'
import CryptoChart from 'pages/BackTest/components/CryptoChart'
import styled from 'styled-components'
import { useState, useCallback, useEffect } from 'react'

// 声明 Telegram WebApp 类型
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        expand: () => void
        close: () => void
        isExpanded: boolean
        onEvent: (eventType: string, eventHandler: () => void) => void
        offEvent: (eventType: string, eventHandler: () => void) => void
      }
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
      return !!(window.Telegram?.WebApp)
    }
    
    setIsTelegramWebView(checkTelegramWebView())
    
    // 如果在 Telegram 环境中，监听展开/收缩状态变化
    if (checkTelegramWebView()) {
      const webApp = window.Telegram!.WebApp!
      setIsFullscreen(webApp.isExpanded)
      
      const handleViewportChanged = () => {
        setIsFullscreen(webApp.isExpanded)
      }
      
      webApp.onEvent('viewportChanged', handleViewportChanged)
      
      return () => {
        webApp.offEvent('viewportChanged', handleViewportChanged)
      }
    }
  }, [])

  const handleFullscreenToggle = useCallback(async () => {
    try {
      if (isTelegramWebView) {
        // Telegram WebView 环境
        const webApp = window.Telegram!.WebApp!
        if (!isFullscreen) {
          // 展开到全屏
          webApp.expand()
        } else {
          // 收缩回正常大小
          webApp.close()
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
