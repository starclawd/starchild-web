import styled, { css } from 'styled-components'
import { memo, useMemo } from 'react'
import { useIsLogin } from 'store/login/hooks'
import { colorChange } from 'styles/animationStyled'

const AiLoadingWrapper = styled.div<{ $isRecording: boolean; $isLoading: boolean; $isLogin: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.5px;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 8px;
  span {
    position: relative;
    width: 2px;
    height: 12px;
    border-radius: 2px;
    &:nth-child(even) {
      top: -2px;
    }
    &:nth-child(odd) {
      bottom: -1px;
    }
  }
  ${({ $isRecording }) =>
    $isRecording &&
    css`
      span {
        &:nth-child(even) {
          top: 0;
        }
        &:nth-child(odd) {
          bottom: 0;
        }
      }
    `}
  ${({ $isLoading }) =>
    $isLoading &&
    css`
      span {
        animation: ${colorChange} 1s infinite;
        &:first-child {
          background-color: #46dbaf;
          animation-delay: 0s;
        }
        &:nth-child(2) {
          background-color: #a7de40;
          animation-delay: 0.125s;
        }
        &:nth-child(3) {
          background-color: #ffa800;
          animation-delay: 0.25s;
        }
        &:last-child {
          background-color: #ff6a68;
          animation-delay: 0.375s;
        }
      }
    `}
  ${({ $isLogin }) =>
    !$isLogin &&
    css`
      cursor: not-allowed;
    `}
`
const AiLoading = memo(
  ({
    audioVolume = 0,
    isLoading,
    isRecording,
    onClick,
  }: {
    audioVolume?: number
    isLoading: boolean
    isRecording: boolean
    onClick?: () => void
  }) => {
    const isLogin = useIsLogin()
    const volumeBarHeight = useMemo(() => {
      return [2 + audioVolume * 6, 2 + audioVolume * 20, 2 + audioVolume * 20, 2 + audioVolume * 6]
    }, [audioVolume])
    return (
      <AiLoadingWrapper
        $isLogin={isLogin}
        $isLoading={isLoading}
        $isRecording={isRecording}
        onClick={onClick}
        className='ai-loading-wrapper'
      >
        {volumeBarHeight.map((data, index) => {
          return <span key={index} style={isRecording ? { height: `${data}px` } : {}}></span>
        })}
      </AiLoadingWrapper>
    )
  },
)

AiLoading.displayName = 'AiLoading'

export default AiLoading
