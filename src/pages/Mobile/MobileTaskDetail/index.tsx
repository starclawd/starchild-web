import { useScrollbarClass } from 'hooks/useScrollbarClass'
import styled from 'styled-components'
import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import Pending from 'components/Pending'
import { Trans } from '@lingui/react/macro'
import { BorderBottom1PxBox } from 'styles/borderStyled'
import { useTheme } from 'store/themecache/hooks'
import { IconBase } from 'components/Icons'
import { vm } from 'pages/helper'
import { ANI_DURATION } from 'constants/index'
import ChatHistory from 'pages/TaskDetail/components/ChatHistory'
import TaskDescription from 'pages/TaskDetail/components/TaskDescription'
import Code from 'pages/TaskDetail/components/Code'
import { useIsGeneratingCode, useIsRunningBacktestTask } from 'store/backtest/hooks'
import Thinking from 'pages/TaskDetail/components/Thinking'
import { useTaskDetailPolling } from 'pages/TaskDetail/components/hooks'

const MobileTaskDetailWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  .icon-loading {
    font-size: 36px !important;
  }
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const TabList = styled(BorderBottom1PxBox)`
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: ${vm(20)};
  width: 100%;
  height: ${vm(48)};
  padding: 0 ${vm(12)};
`

const Line = styled.div<{ $left: number; $width: number }>`
  position: absolute;
  bottom: -1px;
  left: ${({ $left }) => `${$left}px`};
  width: ${({ $width }) => `${$width}px`};
  height: 2px;
  transform: scaleY(0.5);
  background-color: ${({ theme }) => theme.textL1};
  transition: all ${ANI_DURATION}s ease-in-out;
`

const TabItem = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${vm(4)};
  font-size: 0.16rem;
  font-weight: 400;
  line-height: 0.24rem;
  color: ${({ theme, $isActive }) => ($isActive ? theme.textL1 : theme.textL3)};
  transition: all ${ANI_DURATION}s;
  .icon-task-detail,
  .icon-task-detail-his {
    font-size: 0.18rem;
    color: ${({ theme, $isActive }) => ($isActive ? theme.textL1 : theme.textL3)};
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${vm(8)};
  width: 100%;
  height: calc(100% - ${vm(48)});
  padding: ${vm(12)};
`

export default function MobileTaskDetail() {
  const theme = useTheme()
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const contentRef = useScrollbarClass<HTMLDivElement>()
  const [tabIndex, setTabIndex] = useState(0)
  const [lineStyle, setLineStyle] = useState({ left: 12, width: 0 })
  const tabRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isInit, setIsInit] = useState(true)
  const isRunningBacktestTask = useIsRunningBacktestTask()
  const isGeneratingCode = useIsGeneratingCode()
  const { isLoading } = useTaskDetailPolling()
  const tabList = useMemo(() => {
    return [
      {
        title: <Trans>Agent details</Trans>,
        value: 0,
        icon: 'icon-task-detail',
      },
      {
        title: <Trans>Chat history</Trans>,
        value: 1,
        icon: 'icon-task-detail-his',
      },
    ]
  }, [])

  const clickTab = useCallback((index: number) => {
    setTabIndex(index)
  }, [])

  const updateLinePosition = useCallback(() => {
    const activeTabRef = tabRefs.current[tabIndex]
    if (activeTabRef) {
      const tabRect = activeTabRef.getBoundingClientRect()

      if (tabRect.width > 0) {
        const left = activeTabRef.offsetLeft
        const width = tabRect.width
        setLineStyle({ left, width })
      }
    }
  }, [tabIndex])

  useEffect(() => {
    updateLinePosition()
  }, [updateLinePosition])

  useEffect(() => {
    if (isInit) {
      setTimeout(() => {
        setIsInit(false)
        updateLinePosition()
      }, 300)
    }
  }, [updateLinePosition, isInit])

  useEffect(() => {
    const handleResize = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(() => {
        updateLinePosition()
      }, 300)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [updateLinePosition])

  return (
    <MobileTaskDetailWrapper>
      <ContentWrapper>
        <TabList $borderColor={theme.lineDark8}>
          {tabList.map((item, index) => (
            <TabItem
              key={item.value}
              ref={(el) => {
                tabRefs.current[index] = el
              }}
              $isActive={tabIndex === item.value}
              onClick={() => clickTab(item.value)}
            >
              <IconBase className={item.icon} />
              <span>{item.title}</span>
            </TabItem>
          ))}
          <Line $left={lineStyle.left} $width={lineStyle.width} />
        </TabList>
        {isLoading ? (
          <Pending isFetching />
        ) : (
          <Content ref={contentRef} className='scroll-style'>
            {tabIndex === 0 ? (
              <>
                {isGeneratingCode || isRunningBacktestTask ? <Thinking /> : <TaskDescription />}
                <Code />
              </>
            ) : (
              <ChatHistory />
            )}
          </Content>
        )}
      </ContentWrapper>
    </MobileTaskDetailWrapper>
  )
}
