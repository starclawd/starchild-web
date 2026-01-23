import styled, { keyframes } from 'styled-components'
import type { TypewriterCursorProps } from './types'

export type { TypewriterCursorProps }

// 光标闪烁动画
const cursorBlink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`

// 光标组件
const StyledCursor = styled.span<{ $width: number; $height: number }>`
  display: inline-block;
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  background-color: ${({ theme }) => theme.brand100};
  animation: ${cursorBlink} 1s ease-in-out infinite;
  vertical-align: middle;
`

export default function TypewriterCursor({ width = 8, height = 20 }: TypewriterCursorProps) {
  return <StyledCursor className='typewriter-cursor' $width={width} $height={height} />
}
