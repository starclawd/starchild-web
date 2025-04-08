import styled, { css } from 'styled-components'
import { memo, useMemo } from 'react'
import { useIsLogin } from 'store/login/hooks'

const AiLoadingWrapper = styled.div<{ isRecording: boolean, isLoading: boolean, isLogin: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.5px;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 8px;
  /* cursor: pointer; */
  background-color: ${({ theme, isRecording }) => !isRecording ? 'transparent' : theme.depthGreen};
  span {
    position: relative;
    width: 2px;
    height: 12px;
    border-radius: 2px;
    background-color: ${({ theme }) => theme.green};
    &:nth-child(even) {
      top: -2px;
    }
    &:nth-child(odd) {
      bottom: -1px;
    }
  }
  ${({ isRecording }) =>
    isRecording &&
    css`
      span {
        &:nth-child(even) {
          top: 0;
        }
        &:nth-child(odd) {
          bottom: 0;
        }
      }
    `
  }
  ${({ isLoading }) =>
    isLoading &&
    css`
      span {
        animation: colorChange 1s infinite;
        &:first-child {
          background-color: #46DBAF;
          animation-delay: 0s;
        }
        &:nth-child(2) {
          background-color: #A7DE40;
          animation-delay: 0.125s;
        }
        &:nth-child(3) {
          background-color: #FFA800;
          animation-delay: .25s;
        }
        &:last-child {
          background-color: #FF6A68;
          animation-delay: .375s;
        }
      }
      @keyframes colorChange {
        0%, 100% {
          background-color: #46DBAF;
        }
        25% {
          background-color: #A7DE40;
        }
        50% {
          background-color: #FFA800;
        }
        75% {
          background-color: #FF6A68;
        }
      }
    `
  }
  ${({ isLogin }) =>
    !isLogin &&
    css`
      cursor: not-allowed;
    `
  }
`
const AiLoading = memo(({ audioVolume = 0, isLoading, isRecording, onClick }: {
  audioVolume?: number
  isLoading: boolean 
  isRecording: boolean
  onClick?: () => void
}) => {
  const isLogin = useIsLogin()
  const volumeBarHeight = useMemo(() => {
    return [
      2 + audioVolume * 6,
      2 + audioVolume * 20,
      2 + audioVolume * 20,
      2 + audioVolume * 6,
    ]
  }, [audioVolume])
  return (
    <AiLoadingWrapper
      isLogin={isLogin}
      isLoading={isLoading} 
      isRecording={isRecording}
      onClick={onClick}
      className='ai-loading-wrapper'
    >
       {volumeBarHeight.map((data, index) => {
          return <span key={index} style={isRecording ? { height: `${data}px` } : {}}></span>
        })}
    </AiLoadingWrapper>
  )
})

AiLoading.displayName = 'AiLoading'

export default AiLoading

