import styled, { css } from 'styled-components'
import { useEffect, useRef } from 'react'
import lottie, { AnimationItem } from 'lottie-web'
import testJson from 'assets/home/starchild.json'

const ScrollDownArrowWrapper = styled.div<{ $opacity: number }>`
  position: absolute;
  bottom: 54px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  opacity: ${(props) => props.$opacity};
`
const LottieContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 72px;
  height: 70px;
`

export default function ScrollDownArrow({ opacity }: { opacity: number }) {
  const lottieRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<AnimationItem | null>(null)
  useEffect(() => {
    if (lottieRef.current) {
      animationRef.current = lottie.loadAnimation({
        container: lottieRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: testJson,
      })
    }
    return () => {
      if (animationRef.current) {
        animationRef.current.destroy()
      }
    }
  }, [])

  return (
    <ScrollDownArrowWrapper $opacity={opacity}>
      <LottieContainer ref={lottieRef} />
    </ScrollDownArrowWrapper>
  )
}
