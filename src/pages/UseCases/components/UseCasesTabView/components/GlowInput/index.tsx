import styled, { css } from 'styled-components'
import { InputHTMLAttributes, memo, useEffect, useState, useRef } from 'react'
import Aurora from '../Aurora'
import { IconBase } from 'components/Icons'
import {
  GLOW_INPUT_FADE_IN_DURATION,
  GLOW_INPUT_MOVE_UP_DURATION,
  TYPEWRITER_START_DELAY,
  TYPEWRITER_CHAR_INTERVAL,
  BUTTON_SCALE_DURATION,
} from 'constants/useCases'
import usePrevious from 'hooks/usePrevious'
import { vm } from 'pages/helper'

interface GlowInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 输入框要显示的文本内容 */
  inputValue: string
  /** 打字机效果完成后的回调 */
  onTypingComplete?: () => void
  /** 是否向上移出视图 */
  shouldMoveUp?: boolean
  /** 按钮是否处于悬停状态（放大） */
  isButtonHovered?: boolean
}

const GlowInputWrapper = styled.div<{ $shouldMoveUp?: boolean }>`
  position: absolute;
  left: calc(50% - 300px);
  top: 240px;
  width: 600px;
  height: 98px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(6px);
  overflow: hidden;
  pointer-events: none;
  opacity: 1;
  animation: ${({ $shouldMoveUp }) =>
    $shouldMoveUp
      ? `moveUpAndFadeOut ${GLOW_INPUT_MOVE_UP_DURATION}ms ease-in forwards`
      : `fadeIn ${GLOW_INPUT_FADE_IN_DURATION}ms ease-out`};

  /* 输入框初始淡入动画 */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* 输入框向上移出并淡出动画 */
  @keyframes moveUpAndFadeOut {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-300px);
    }
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(335)};
      height: ${vm(80)};
      left: ${vm(20)};
      top: calc(50% - ${vm(40)});
    `}
`

const AuroraWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 4px;
  border-radius: 16px;
  background: ${({ theme }) => theme.black900};
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0) border-box;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0) border-box;
  mask-composite: exclude; /* Firefox, spec */
  -webkit-mask-composite: xor; /* Chrome/Safari */
  overflow: hidden;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(4)};
      border-radius: ${vm(16)};
    `}
`

const InnerContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  z-index: 1;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)};
      gap: ${vm(12)};
    `}
`

const StyledInput = styled.input`
  width: 100%;
  height: 42px;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: 0.6px;
  padding-bottom: 12px;
  background: transparent;
  color: ${({ theme }) => theme.textL1};
  border-bottom: 2px solid ${({ theme }) => theme.brand100};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(16)};
      font-weight: 600;
      line-height: ${vm(24)};
      padding-bottom: ${vm(12)};
    `}
`

const ActionButton = styled.div<{ $isHovered?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.brand100};
  transition: transform ${BUTTON_SCALE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${({ $isHovered }) => ($isHovered ? 'scale(1.5)' : 'scale(1)')}; /* 悬停时放大到 1.5 倍 */

  .icon-chat-back {
    font-size: 20px;
    color: ${({ theme }) => theme.textL1};
    transform: rotate(90deg);
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(40)};
      height: ${vm(40)};
      .icon-chat-back {
        font-size: ${vm(20)};
      }
    `}
`

export default memo(function GlowInput({
  inputValue,
  onTypingComplete,
  shouldMoveUp,
  isButtonHovered,
}: GlowInputProps) {
  const [value, setValue] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const preIsComplete = usePrevious(isComplete)
  const inputRef = useRef<HTMLInputElement>(null)

  // 打字机效果
  useEffect(() => {
    // 初始化后延迟一段时间再开始打字机效果
    const startDelay = setTimeout(() => {
      let currentIndex = 0

      const typewriterInterval = setInterval(() => {
        if (currentIndex <= inputValue.length) {
          const newValue = inputValue.slice(0, currentIndex)
          setValue(newValue)
          currentIndex++

          // 每次更新后，将输入框滚动到最右侧
          if (inputRef.current) {
            inputRef.current.scrollLeft = inputRef.current.scrollWidth
          }
        } else {
          clearInterval(typewriterInterval)
          // 打字完成后设置状态
          setIsComplete(true)
        }
      }, TYPEWRITER_CHAR_INTERVAL) // 每个字符的显示间隔

      return () => {
        clearInterval(typewriterInterval)
      }
    }, TYPEWRITER_START_DELAY)

    return () => {
      clearTimeout(startDelay)
    }
  }, [inputValue])

  // 监听打字完成状态，触发回调
  useEffect(() => {
    if (!preIsComplete && isComplete) {
      onTypingComplete?.()
    }
  }, [isComplete, preIsComplete, onTypingComplete])

  return (
    <GlowInputWrapper $shouldMoveUp={shouldMoveUp}>
      <AuroraWrapper>
        <Aurora
          key='glow-input-aurora'
          colorStops={['#f84600', '#ffffff', '#f84600']}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </AuroraWrapper>
      <InnerContent>
        <StyledInput ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} />
        <ActionButton $isHovered={isButtonHovered}>
          <IconBase className='icon-chat-back' />
        </ActionButton>
      </InnerContent>
    </GlowInputWrapper>
  )
})
