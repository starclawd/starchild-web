import styled from 'styled-components'
import Chat from './components/Chat'
import StrategyInfo from './components/StrategyInfo'
import { memo, useState, useCallback, useRef, useEffect } from 'react'
import { IconBase } from 'components/Icons'
import { useLeftWidth } from 'store/createstrategycache/hooks'

const MIN_WIDTH = 240
const MAX_WIDTH = 480

const CreateStrategyWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

const LeftContent = styled.div<{ $width: number; $isHovering: boolean; $isDragging: boolean }>`
  width: ${({ $width }) => $width}px;
  height: 100%;
  flex-shrink: 0;
  border-right: 1px solid
    ${({ theme, $isHovering, $isDragging }) => ($isHovering || $isDragging ? theme.brand100 : theme.black800)};
  position: relative;
  transition: ${({ $isDragging }) => ($isDragging ? 'none' : 'border-color 0.2s ease')};
`

const RightContent = styled.div<{ $leftWidth: number }>`
  width: ${({ $leftWidth }) => `calc(100% - ${$leftWidth}px)`};
  height: 100%;
  flex-shrink: 0;
`

const ResizeHandle = styled.div<{ $isVisible: boolean; $isDragging: boolean; $topY: number }>`
  position: absolute;
  right: -12px;
  top: ${({ $topY }) => $topY}px;
  transform: translateY(-50%);
  width: 24px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: col-resize;
  z-index: 10;
  opacity: ${({ $isVisible, $isDragging }) => ($isVisible || $isDragging ? 1 : 0)};
  transition: opacity 0.2s ease;

  .icon-drag-expand {
    font-size: 24px;
    color: ${({ theme }) => theme.brand100};
  }
`

const HoverZone = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 20px;
  height: 100%;
  z-index: 5;
`

export default memo(function CreateStrategy() {
  const [leftWidth, setLeftWidth] = useLeftWidth()
  const [isHovering, setIsHovering] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [mouseY, setMouseY] = useState(0)
  const startXRef = useRef(0)
  const startWidthRef = useRef(leftWidth)
  const leftContentRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)
      startXRef.current = e.clientX
      startWidthRef.current = leftWidth
    },
    [leftWidth],
  )

  const updateMouseY = useCallback((clientY: number) => {
    if (leftContentRef.current) {
      const rect = leftContentRef.current.getBoundingClientRect()
      const relativeY = Math.max(20, Math.min(clientY - rect.top, rect.height - 20))
      setMouseY(relativeY)
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const deltaX = e.clientX - startXRef.current
      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidthRef.current + deltaX))
      setLeftWidth(newWidth)
      updateMouseY(e.clientY)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, setLeftWidth, updateMouseY])

  const handleHoverZoneEnter = useCallback(() => {
    setIsHovering(true)
  }, [])

  const handleHoverZoneLeave = useCallback(() => {
    if (!isDragging) {
      setIsHovering(false)
    }
  }, [isDragging])

  const handleHoverZoneMouseMove = useCallback(
    (e: React.MouseEvent) => {
      updateMouseY(e.clientY)
    },
    [updateMouseY],
  )

  return (
    <CreateStrategyWrapper>
      <LeftContent ref={leftContentRef} $width={leftWidth} $isHovering={isHovering} $isDragging={isDragging}>
        <Chat />
        <HoverZone
          onMouseEnter={handleHoverZoneEnter}
          onMouseLeave={handleHoverZoneLeave}
          onMouseMove={handleHoverZoneMouseMove}
        />
        <ResizeHandle
          $isVisible={isHovering}
          $isDragging={isDragging}
          $topY={mouseY}
          onMouseDown={handleMouseDown}
          onMouseEnter={handleHoverZoneEnter}
          onMouseLeave={handleHoverZoneLeave}
          onMouseMove={handleHoverZoneMouseMove}
        >
          <IconBase className='icon-drag-expand' />
        </ResizeHandle>
      </LeftContent>
      <RightContent $leftWidth={leftWidth}>
        <StrategyInfo />
      </RightContent>
    </CreateStrategyWrapper>
  )
})
