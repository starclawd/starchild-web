import styled, { css } from 'styled-components'
import InsightItem from '../InsightItem'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useIsMobile } from 'store/application/hooks'
import PullUpRefresh from 'components/PullUpRefresh'
import { useAllInsightsList, useCurrentShowId, useGetAllInsights } from 'store/insights/hooks'
// import NoData from 'components/NoData'
import { vm } from 'pages/helper'
import NoData from 'components/NoData'
import { useIsLogin } from 'store/login/hooks'

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
  const [isLoading, setIsLoading] = useState(false)
  const [isPullUpRefreshing, setIsPullUpRefreshing] = useState(false)
  const [pageIndex, setPageIndex] = useState(1)
  const triggerGetAllInsights = useGetAllInsights()
  const [list, totalSize] = useAllInsightsList()
  const length = list.length
  const wrapperRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef<HTMLDivElement>(null)
  const [currentShowId, setCurrentShowId] = useCurrentShowId()

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
      triggerGetAllInsights({ pageIndex: 1 })
    }
  }, [isLogin, triggerGetAllInsights])

  useEffect(() => {
    if (!currentShowId) {
      setCurrentShowId(list[0]?.id.toString() || '')
    }
  }, [list, currentShowId, setCurrentShowId])
  
  return <InsightsListWrapper id="insightsListWrapperEl" className='scroll-style' ref={wrapperRef}>
    {list.length > 0
      ? list.map((idea, index) => {
        const { id } = idea
        return <InsightItem
        key={id}
        data={idea}
        isActive={currentShowId === id.toString()}
        currentShowId={currentShowId}
        setCurrentShowId={setCurrentShowId}
        />
      })
      : <NoData />
    }
    {/* <div ref={loadingRef} style={{ height: '10px', width: '100%' }}></div> */}
  </InsightsListWrapper>
})
