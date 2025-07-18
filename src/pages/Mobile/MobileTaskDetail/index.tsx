import { useScrollbarClass } from 'hooks/useScrollbarClass'
import styled from 'styled-components'
import { useCallback, useEffect, useMemo, useState, useRef, useLayoutEffect, use } from 'react'
import useParsedQueryString from 'hooks/useParsedQueryString'
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
import { useGetTaskDetail, useIsCodeTaskType, useTaskDetail } from 'store/backtest/hooks'
import Thinking from 'pages/TaskDetail/components/Thinking'
import { GENERATION_STATUS, TASK_TYPE } from 'store/backtest/backtest'

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
  padding: ${vm(12)} ${vm(12)};
`

export default function MobileTaskDetail() {
  const theme = useTheme()
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const pollingTimer = useRef<NodeJS.Timeout | null>(null)
  const triggerGetTaskDetail = useGetTaskDetail()
  const contentRef = useScrollbarClass<HTMLDivElement>()
  const [isLoading, setIsLoading] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)
  const [lineStyle, setLineStyle] = useState({ left: 12, width: 0 })
  const { taskId } = useParsedQueryString()
  const tabRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isInit, setIsInit] = useState(true)
  const isCodeTaskType = useIsCodeTaskType()
  const [{ generation_status, task_type }] = useTaskDetail()
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

  const tabList = useMemo(() => {
    return [
      {
        title: <Trans>Task details</Trans>,
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

  const getTaskDetail = useCallback(
    async (showLoading = false) => {
      if (!taskId) return

      try {
        if (showLoading) {
          setIsLoading(true)
        }
        const data = await triggerGetTaskDetail(taskId)
        if (!(data as any).isSuccess) {
          if (showLoading) {
            setIsLoading(false)
          }
        } else {
          if (showLoading) {
            setIsLoading(false)
          }
        }
      } catch (error) {
        if (showLoading) {
          setIsLoading(false)
        }
      }
    },
    [taskId, triggerGetTaskDetail],
  )

  const startPolling = useCallback(() => {
    if (pollingTimer.current) {
      clearInterval(pollingTimer.current)
    }

    pollingTimer.current = setInterval(() => {
      getTaskDetail(false) // 轮询时不显示loading
    }, 5000) // 5秒轮询一次
  }, [getTaskDetail])

  const stopPolling = useCallback(() => {
    if (pollingTimer.current) {
      clearInterval(pollingTimer.current)
      pollingTimer.current = null
    }
  }, [])

  // 初始加载
  useEffect(() => {
    getTaskDetail(true) // 初始加载时显示loading
  }, [getTaskDetail])

  // 根据generation_status控制轮询
  useEffect(() => {
    if (generation_status === GENERATION_STATUS.PENDING && isCodeTaskType) {
      startPolling()
    } else {
      stopPolling()
    }

    // 清理函数：组件卸载时清除定时器
    return () => {
      stopPolling()
    }
  }, [generation_status, isCodeTaskType, startPolling, stopPolling])

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
                {generation_status === GENERATION_STATUS.PENDING && isCodeTaskType ? <Thinking /> : <TaskDescription />}
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
