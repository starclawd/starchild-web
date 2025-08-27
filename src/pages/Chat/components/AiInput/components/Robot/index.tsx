import styled from 'styled-components'
import robot from 'assets/chat/robot.png'
import robotPop from 'assets/chat/robot-pop.svg'
import { useMemo, useState, useEffect, useRef } from 'react'
import { t } from '@lingui/core/macro'

const RobotWrapper = styled.div`
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
  }
`

const Content = styled.div`
  display: flex;
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
`

export default function Robot({ isFocus }: { isFocus: boolean }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const switchTimerRef = useRef<NodeJS.Timeout | null>(null)
  const initialDelayRef = useRef<NodeJS.Timeout | null>(null)

  const emojiList = useMemo(() => ['💡', '🚀', '🦾', '📊', '🪙', '🔮', '🎯', '⚡', '🧩', '🕹️'], [])

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
        typingTimerRef.current = setTimeout(typeNextChar, 50) // 50ms 每个字符
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

  // 初始化加载后等待1秒再开始显示
  useEffect(() => {
    initialDelayRef.current = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    return () => {
      if (initialDelayRef.current) {
        clearTimeout(initialDelayRef.current)
      }
    }
  }, [])

  // 当可见状态改变或当前文字索引改变时，触发打字机效果
  useEffect(() => {
    if (isVisible && textList[currentTextIndex]) {
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
  }, [currentTextIndex, isVisible, textList])

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
    }
  }, [])

  return (
    <RobotWrapper>
      <img className='robot' src={robot} alt='' />
      {!isFocus && isVisible && (
        <Content>
          <img src={robotPop} alt='' />
          <span>
            {emojiList[currentTextIndex]}&nbsp;
            {displayedText}
          </span>
        </Content>
      )}
    </RobotWrapper>
  )
}
