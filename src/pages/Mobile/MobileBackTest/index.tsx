import { useScrollbarClass } from 'hooks/useScrollbarClass'
import CryptoChart from 'pages/BackTest/components/CryptoChart'
import styled from 'styled-components'
import { useState, useCallback } from 'react'

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

  const handleFullscreenToggle = useCallback(async () => {
    try {
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
    } catch (error) {
      console.error('全屏切换失败:', error)
    }
  }, [isFullscreen, backTestWrapperRef])

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
