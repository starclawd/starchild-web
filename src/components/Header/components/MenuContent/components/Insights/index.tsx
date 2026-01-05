import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { useCurrentRouter, useIsMobile, useIsShowMobileMenu } from 'store/application/hooks'
import {
  useGetSystemSignalAgents,
  useSystemSignalAgents,
  useSystemSignalOverviewList,
} from 'store/insights/hooks/useSystemSignalHooks'
import styled, { css } from 'styled-components'
import { useEffect, useRef, useCallback, useMemo } from 'react'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import { ButtonCommon } from 'components/Button'
import { ROUTER } from 'pages/router'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import useParsedQueryString from 'hooks/useParsedQueryString'
import AgentItem from 'pages/MyAgent/components/AgentItem'
import NoData from 'components/NoData'

const InsightsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 100%;
  gap: 8px;
  outline: none;
  &:focus {
    outline: none;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
    `}
`

const Overview = styled(ButtonCommon)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
  height: ${vm(32)};
  padding: ${vm(8)};
  border-radius: ${vm(6)};
  font-size: 0.13rem;
  line-height: 0.2rem;
  color: ${({ theme }) => theme.black100};
  background: ${({ theme }) => theme.black900};
`

const InsightList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  ${({ theme }) =>
    !theme.isMobile &&
    css`
      margin-right: 0 !important;
      padding-right: 4px !important;
    `}
`

export default function Insights() {
  const isMobile = useIsMobile()
  const [, setCurrentRouter] = useCurrentRouter()
  const [, setIsShowMobileMenu] = useIsShowMobileMenu()
  const { agentId: insightId } = useParsedQueryString()
  const [systemSignalList] = useSystemSignalAgents()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const scrollRef = useScrollbarClass<HTMLDivElement>()

  const sortInsights = useMemo(() => {
    return [...systemSignalList].sort((a, b) => {
      return (
        (Number(b.triggered_at) || Number(b.created_at) || 0) - (Number(a.triggered_at) || Number(a.created_at) || 0)
      )
    })
  }, [systemSignalList])

  // 获取当前选中项的索引
  const getCurrentSelectedIndex = useCallback(() => {
    if (!insightId || sortInsights.length === 0) return -1
    return sortInsights.findIndex((insight) => insight.id === Number(insightId))
  }, [insightId, sortInsights])

  // 处理键盘导航
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (sortInsights.length === 0) return

      const currentIndex = getCurrentSelectedIndex()
      let newIndex = currentIndex

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault()
          if (currentIndex <= 0) {
            newIndex = sortInsights.length - 1 // 循环到最后一个
          } else {
            newIndex = currentIndex - 1
          }
          break

        case 'ArrowDown':
          event.preventDefault()
          if (currentIndex >= sortInsights.length - 1) {
            newIndex = 0 // 循环到第一个
          } else {
            newIndex = currentIndex + 1
          }
          break

        case 'ArrowLeft':
          event.preventDefault()
          // 左键和上键功能相同
          if (currentIndex <= 0) {
            newIndex = sortInsights.length - 1
          } else {
            newIndex = currentIndex - 1
          }
          break

        case 'ArrowRight':
          event.preventDefault()
          // 右键和下键功能相同
          if (currentIndex >= sortInsights.length - 1) {
            newIndex = 0
          } else {
            newIndex = currentIndex + 1
          }
          break

        default:
          return
      }

      if (newIndex >= 0 && newIndex < sortInsights.length) {
        setCurrentRouter(`${ROUTER.AGENT_DETAIL}?agentId=${sortInsights[newIndex].id}&from=insights`)
      }
    },
    [sortInsights, getCurrentSelectedIndex, setCurrentRouter],
  )

  // 添加键盘事件监听
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    wrapper.addEventListener('keydown', handleKeyDown)

    return () => {
      wrapper.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  // 点击容器时获得焦点，以便能够接收键盘事件
  const handleWrapperClick = useCallback(() => {
    wrapperRef.current?.focus()
  }, [])

  const showOverview = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setCurrentRouter(ROUTER.SIGNALS)
      setIsShowMobileMenu(false)
    },
    [setCurrentRouter, setIsShowMobileMenu],
  )

  return (
    <InsightsWrapper ref={wrapperRef} tabIndex={0} onClick={handleWrapperClick}>
      <InsightList className={isMobile ? '' : 'scroll-style'} ref={isMobile ? undefined : scrollRef}>
        {sortInsights.length > 0 ? (
          sortInsights.map((item) => {
            return <AgentItem key={item.id} data={item} fromPage='insights' />
          })
        ) : (
          <NoData />
        )}
      </InsightList>
    </InsightsWrapper>
  )
}
