import styled, { css, keyframes } from 'styled-components'
import robot from 'assets/chat/robot.png'
import robotPop from 'assets/chat/robot-pop.svg'
import { useMemo, useState, useEffect, useRef } from 'react'
import { t } from '@lingui/core/macro'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'

// 机器人图片弹出动画
const robotPopAnimation = keyframes`
  0% {
    transform: translateY(20px) scale(0);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`

const RobotWrapper = styled.div<{ $showText: boolean; $robotAnimationComplete: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 64px;
  .robot {
    position: absolute;
    left: 7px;
    top: 0;
    width: 52px;
    height: 52px;
    opacity: 0;
    transition: all ${ANI_DURATION}s;
    transform: translateY(20px) scale(0);
    ${({ $robotAnimationComplete }) =>
      $robotAnimationComplete
        ? css`
            animation: ${robotPopAnimation} 0.5s ease-out forwards;
          `
        : css`
            opacity: 0;
            transform: translateY(20px) scale(0);
          `};
  }
  ${({ $showText }) =>
    !$showText &&
    css`
      .robot {
        opacity: 0.54 !important;
      }
    `}
  ${({ theme }) =>
    theme.isMobile
      ? css`
          padding-left: ${vm(64)};
          .robot {
            left: ${vm(7)};
            width: ${vm(52)};
            height: ${vm(52)};
          }
        `
      : css`
          cursor: pointer;
          &:hover {
            .robot-content {
              display: flex !important;
            }
          }
        `}
`

const Content = styled.div<{ $show: boolean }>`
  display: none;
  align-items: flex-end;
  height: 24px;
  img {
    width: 6px;
    height: 9px;
  }
  span {
    display: flex;
    align-items: center;
    width: fit-content;
    padding: 0 6px;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    border-radius: 4px 4px 4px 0;
    color: ${({ theme }) => theme.textL2};
    background-color: ${({ theme }) => theme.brand100};
  }
  ${({ $show }) =>
    $show &&
    css`
      display: flex;
    `}
  ${({ theme }) =>
    theme.isMobile
      ? css`
          height: ${vm(24)};
          img {
            width: ${vm(6)};
            height: ${vm(9)};
          }
          span {
            padding: 0 ${vm(6)};
            font-size: 0.13rem;
            line-height: 0.2rem;
            border-radius: ${vm(4)} ${vm(4)} ${vm(4)} 0;
          }
        `
      : css``}
`

export default function Robot({ isFocus }: { isFocus: boolean }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [robotAnimationComplete, setRobotAnimationComplete] = useState(false)
  const [textAnimationStarted, setTextAnimationStarted] = useState(false)
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const switchTimerRef = useRef<NodeJS.Timeout | null>(null)
  const initialDelayRef = useRef<NodeJS.Timeout | null>(null)
  const robotAnimationDelayRef = useRef<NodeJS.Timeout | null>(null)

  const showText = useMemo(() => {
    return !isFocus && isVisible
  }, [isFocus, isVisible])

  const textList = useMemo(() => {
    return [
      {
        text: t`Type a coin or strategy, let's see what AI cooks up!`,
      },
      {
        text: t`Bottom fishing or top chasing? Tell me!`,
      },
      {
        text: t`Drop me a signal, I'll crunch the charts!`,
      },
      {
        text: t`Trend check or quick trade idea? Your call!`,
      },
      {
        text: t`Try typing BTC / ETH or any token name!`,
      },
      {
        text: t`Curious about price or volume? Ask away!`,
      },
      {
        text: t`Share a trading direction, I'll sharpen it!`,
      },
      {
        text: t`Coin + timeframe = instant AI analysis!`,
      },
      {
        text: t`Stuck on strategy? Toss me a keyword!`,
      },
      {
        text: t`Wanna test AI's trading instincts? Type anything!`,
      },
    ]
  }, [])

  // 打字机效果函数
  const typeText = (text: string) => {
    setDisplayedText('')
    setIsTyping(true)

    let currentIndex = 0
    const typeNextChar = () => {
      if (currentIndex < text.length) {
        const char = text[currentIndex]
        setDisplayedText((prev) => prev + char)
        currentIndex++
        typingTimerRef.current = setTimeout(typeNextChar, 25) // 50ms 每个字符
      } else {
        setIsTyping(false)
        // 打字机效果结束后，等待1秒切换到下一项
        switchTimerRef.current = setTimeout(() => {
          setCurrentTextIndex((prevIndex) => (prevIndex + 1) % textList.length)
        }, 2000)
      }
    }

    // 立即开始打字第一个字符
    typeNextChar()
  }

  // 初始化加载后等待3秒再开始显示机器人图片
  useEffect(() => {
    initialDelayRef.current = setTimeout(() => {
      setIsVisible(true)
      // 立即开始机器人图片动画
      setRobotAnimationComplete(true)

      // 机器人图片动画完成后等待0.5秒开始文字动画
      robotAnimationDelayRef.current = setTimeout(() => {
        setTextAnimationStarted(true)
      }, 500) // 等待机器人动画完成（0.5秒）
    }, 3000) // 改为3秒

    return () => {
      if (initialDelayRef.current) {
        clearTimeout(initialDelayRef.current)
      }
      if (robotAnimationDelayRef.current) {
        clearTimeout(robotAnimationDelayRef.current)
      }
    }
  }, [])

  // 当文字动画开始或当前文字索引改变时，触发打字机效果
  useEffect(() => {
    if (textAnimationStarted && textList[currentTextIndex]) {
      typeText(textList[currentTextIndex].text)
    }

    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current)
      }
      if (switchTimerRef.current) {
        clearTimeout(switchTimerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTextIndex, textAnimationStarted, textList])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current)
      }
      if (switchTimerRef.current) {
        clearTimeout(switchTimerRef.current)
      }
      if (initialDelayRef.current) {
        clearTimeout(initialDelayRef.current)
      }
      if (robotAnimationDelayRef.current) {
        clearTimeout(robotAnimationDelayRef.current)
      }
    }
  }, [])

  return (
    <RobotWrapper $showText={showText} $robotAnimationComplete={robotAnimationComplete}>
      <img className='robot' src={robot} alt='' />
      <Content className='robot-content' $show={showText}>
        {textAnimationStarted && <img src={robotPop} alt='' />}
        <span>{textAnimationStarted ? displayedText : ''}</span>
      </Content>
    </RobotWrapper>
  )
}
