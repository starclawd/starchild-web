import styled, { css } from 'styled-components'
import InsightItem from '../InsightItem'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { useIsMobile } from 'store/application/hooks'
import { useInsightsList, useCurrentShowId, useGetAllInsights, useIsLoadingInsights } from 'store/insights/hooks'
import { vm } from 'pages/helper'
import NoData from 'components/NoData'
import { useIsLogin, useIsLogout } from 'store/login/hooks'
import Pending from 'components/Pending'
import { useCurrentInsightTokenData } from 'store/insightscache/hooks'

const InsightsListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  gap: 8px;
  ${({ theme }) => theme.isMobile && css`
    height: calc(100% - ${vm(68)});
    gap: ${vm(8)};
  `}
`

// 定义窗口大小常量
const WINDOW_SIZE = 10; // 窗口中最多显示10条数据
const BUFFER_SIZE = 5;  // 上下缓冲区各5条数据

export default memo(function InsightsList() {
  const isMobile = useIsMobile()
  const isLogin = useIsLogin()
  const isLogout = useIsLogout()
  const [{ symbol: currentInsightToken }] = useCurrentInsightTokenData()
  const [isLoading, setIsLoading] = useIsLoadingInsights()
  const triggerGetAllInsights = useGetAllInsights()
  const [insightsList,, setAllInsightsData] = useInsightsList()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [currentShowId, setCurrentShowId] = useCurrentShowId()
  const [windowStart, setWindowStart] = useState(0) // 窗口起始索引
  const lastScrollPosition = useRef(0)
  const scrollDirectionUp = useRef(false)
  // 记录上次设置的windowStart值
  const lastSetWindowStart = useRef(windowStart)
  // 标记是否已经显示第一条或最后一条数据
  const isAtTop = useRef(false)
  const isAtBottom = useRef(false)

  const filterInsightsList = useMemo(() => {
    return insightsList.filter((insight) => (insight.marketId.toUpperCase() === currentInsightToken.toUpperCase()) || !currentInsightToken)
  }, [insightsList, currentInsightToken])

  // 每当窗口位置改变时，更新边界标记
  useEffect(() => {
    if (filterInsightsList.length === 0) return
    
    // 如果窗口起始位置为0，标记为已到达顶部
    isAtTop.current = windowStart === 0
    
    // 如果窗口结束位置达到或超过列表长度，标记为已到达底部
    const windowEnd = windowStart + WINDOW_SIZE
    isAtBottom.current = windowEnd >= filterInsightsList.length
  }, [windowStart, filterInsightsList.length])

  // 使用滑动窗口计算要显示的数据
  const displayedInsights = useMemo(() => {
    if (!isMobile || filterInsightsList.length <= WINDOW_SIZE || currentInsightToken) {
      return filterInsightsList
    }
    
    // 根据当前窗口位置计算显示范围
    const end = Math.min(windowStart + WINDOW_SIZE, filterInsightsList.length)
    return filterInsightsList.slice(windowStart, end)
  }, [filterInsightsList, isMobile, windowStart, currentInsightToken])

  // 监听滚动事件调整窗口位置
  useEffect(() => {
    if (!isMobile || filterInsightsList.length <= WINDOW_SIZE || currentInsightToken) return

    const wrapperElement = document.getElementById('insightsListWrapperEl')
    
    // 防止重复滚动计算的标志
    let isProcessingScroll = false
    
    const handleScroll = () => {
      if (!wrapperElement || isProcessingScroll) return
      
      isProcessingScroll = true
      
      const { scrollTop, scrollHeight, clientHeight } = wrapperElement
      
      // 确定滚动方向
      scrollDirectionUp.current = scrollTop < lastScrollPosition.current
      lastScrollPosition.current = scrollTop
      
      // 计算滚动位置的百分比
      const scrollPercentage = scrollTop / (scrollHeight - clientHeight)
      
      // 根据滚动方向和位置调整窗口
      if (scrollDirectionUp.current) {
        // 向上滚动(显示更早的数据)
        // 如果已经在顶部，则不做任何处理
        if (isAtTop.current) {
          isProcessingScroll = false
          return
        }
        
        // 当接近顶部10%时加载前面的数据
        if (scrollPercentage < 0.1 && windowStart > 0) {
          const newStart = Math.max(0, windowStart - BUFFER_SIZE)
          
          // 只有当窗口位置发生变化时才更新状态
          if (newStart !== windowStart && newStart !== lastSetWindowStart.current) {
            lastSetWindowStart.current = newStart
            setWindowStart(newStart)
            
            // 保持滚动位置以防止突然跳动
            setTimeout(() => {
              isProcessingScroll = false
              if (!wrapperElement) return
              const itemHeight = wrapperElement.scrollHeight / displayedInsights.length
              wrapperElement.scrollTop = scrollTop + (BUFFER_SIZE * itemHeight)
            }, 50)
          } else {
            isProcessingScroll = false
          }
        } else {
          isProcessingScroll = false
        }
      } else {
        // 向下滚动(显示更新的数据)
        // 如果已经在底部，则不做任何处理
        if (isAtBottom.current) {
          isProcessingScroll = false
          return
        }
        
        // 当接近底部10%时加载更多数据
        if (scrollPercentage > 0.9) {
          // 计算理论上的最大起始索引（保证能显示WINDOW_SIZE个项目）
          const maxStartIndex = Math.max(0, filterInsightsList.length - WINDOW_SIZE)
          
          // 计算下一个窗口起始位置，确保不会出现重复值
          let newStart
          
          // 使用等距离间隔计算，避免在特定值之间徘徊
          if (windowStart + BUFFER_SIZE > maxStartIndex) {
            // 如果加上缓冲区后超过了最大索引，直接设为最大索引
            newStart = maxStartIndex
          } else {
            // 否则使用固定步长递增
            newStart = windowStart + BUFFER_SIZE
          }
          
          // 确保新值与上次设置的值不同，避免循环
          if (newStart !== windowStart && newStart !== lastSetWindowStart.current) {
            lastSetWindowStart.current = newStart
            setWindowStart(newStart)
            
            // 使用延时确保状态更新完成后再处理新的滚动
            setTimeout(() => {
              isProcessingScroll = false
            }, 50)
          } else {
            isProcessingScroll = false
          }
        } else {
          isProcessingScroll = false
        }
      }
    }
    
    wrapperElement?.addEventListener('scroll', handleScroll)
    
    return () => {
      wrapperElement?.removeEventListener('scroll', handleScroll)
    }
  }, [isMobile, currentInsightToken, filterInsightsList.length, windowStart, displayedInsights.length])

  useEffect(() => {
    if (isLogin) {
      triggerGetAllInsights({ pageIndex: 1 }).then((res) => {
        setIsLoading(false)
      }).catch((err) => {
        setIsLoading(false)
      })
    }
  }, [isLogin, setIsLoading, triggerGetAllInsights])

  useEffect(() => {
    if (!currentShowId || (filterInsightsList.length > 0 && !filterInsightsList.some((insight) => insight.id.toString() === currentShowId))) {
      setCurrentShowId(filterInsightsList[0]?.id.toString() || '')
    }
  }, [filterInsightsList, currentShowId, setCurrentShowId])

  useEffect(() => {
    if (isLogout) {
      setIsLoading(false)
      setAllInsightsData([])
    }
  }, [isLogout, setIsLoading, setAllInsightsData])
  
  // 计算是否显示顶部和底部加载指示器
  // const showTopLoader = isMobile && filterInsightsList.length > WINDOW_SIZE && !isAtTop.current
  // const showBottomLoader = isMobile && filterInsightsList.length > WINDOW_SIZE && !isAtBottom.current
  
  return <InsightsListWrapper id="insightsListWrapperEl" className='scroll-style' ref={wrapperRef}>
    {displayedInsights.length > 0
      ? displayedInsights.map((idea, index) => {
        const { id } = idea
        return <InsightItem
        key={id}
        data={idea}
        isActive={currentShowId === id.toString()}
        />
      })
      : isLoading
        ? <Pending isFetching />
        : <NoData />
    }
    
    {/* {showBottomLoader && (
      <div ref={loadingBottomRef} style={{ height: '30px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Pending isFetching />
      </div>
    )} */}
  </InsightsListWrapper>
})
