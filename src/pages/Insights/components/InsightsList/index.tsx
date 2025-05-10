import styled, { css } from 'styled-components'
import InsightItem from '../InsightItem'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIsMobile } from 'store/application/hooks'
import PullUpRefresh from 'components/PullUpRefresh'
import { useInsightsList, useCurrentShowId, useGetAllInsights, useIsLoadingInsights } from 'store/insights/hooks'
import { vm } from 'pages/helper'
import NoData from 'components/NoData'
import { useIsLogin } from 'store/login/hooks'
import Pending from 'components/Pending'
import { useCurrentInsightToken } from 'store/insightscache/hooks'

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

export default memo(function InsightsList() {
  const isMobile = useIsMobile()
  const isLogin = useIsLogin()
  const [currentInsightToken] = useCurrentInsightToken()
  const [isPullUpRefreshing, setIsPullUpRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useIsLoadingInsights()
  const [pageIndex, setPageIndex] = useState(1)
  const triggerGetAllInsights = useGetAllInsights()
  const [insightsList] = useInsightsList()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef<HTMLDivElement>(null)
  const [currentShowId, setCurrentShowId] = useCurrentShowId()
  const filterInsightsList = useMemo(() => {
    return insightsList.filter((insight) => (insight.marketId.toUpperCase() === currentInsightToken.toUpperCase()) || !currentInsightToken)
  }, [insightsList, currentInsightToken])

  // 移动端下拉刷新
  const onRefresh = useCallback(() => {
    setIsPullUpRefreshing(true)
    setTimeout(() => {
      setIsPullUpRefreshing(false)
    }, 1000)
  }, [])

  // 加载更多数据
  // const loadMoreIdeas = useCallback(async () => {
  //   if (length >= totalSize) return
  //   setIsPullUpRefreshing(true)
  //   const nextPage = pageIndex + 1
  //   setPageIndex(nextPage)
  // }, [pageIndex, length, totalSize])

  // 初始加载数据
  // useEffect(() => {
  //   if (pageIndex === 1) {
  //     setIsLoading(true)
  //   } 
  //   triggerGetAllNews({ pageIndex }).then((res) => {
  //     setIsPullUpRefreshing(false)
  //     setIsLoading(false)
  //   }).catch((err) => {
  //     setIsPullUpRefreshing(false)
  //     setIsLoading(false)
  //   })
  // }, [pageIndex, triggerGetAllNews])

  // // 监听滚动加载更多
  // useEffect(() => {
  //   if (isMobile) return

  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting) {
  //         loadMoreIdeas()
  //       }
  //     },
  //     { threshold: 0.1 }
  //   )
  //   const currentLoadingRef = loadingRef.current;
    
  //   if (currentLoadingRef) {
  //     observer.observe(currentLoadingRef)
  //   }

  //   return () => {
  //     if (currentLoadingRef) {
  //       observer.unobserve(currentLoadingRef)
  //     }
  //   }
  // }, [isMobile, loadMoreIdeas])

  // if (length >= totalSize) {
  //   return <NoData />
  // }

  // if (isMobile) {
    // return <PullUpRefresh
    //   onRefresh={onRefresh}
    //   isRefreshing={isPullUpRefreshing}
    //   setIsRefreshing={setIsPullUpRefreshing}
    //   disabledPull={length >= totalSize}
    // >
      
    // </PullUpRefresh>
  // }

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
  
  return <InsightsListWrapper id="insightsListWrapperEl" className='scroll-style' ref={wrapperRef}>
    {filterInsightsList.length > 0
      ? filterInsightsList.map((idea, index) => {
        const { id } = idea
        return <InsightItem
        key={id}
        data={idea}
        isActive={currentShowId === id.toString()}
        currentShowId={currentShowId}
        setCurrentShowId={setCurrentShowId}
        />
      })
      : isLoading
        ? <Pending isFetching />
        : <NoData />
    }
    {/* <div ref={loadingRef} style={{ height: '10px', width: '100%' }}></div> */}
  </InsightsListWrapper>
})
