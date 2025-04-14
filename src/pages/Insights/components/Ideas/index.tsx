import styled, { css } from 'styled-components'
import IdeaItem from '../../../TradeAi/components/IdeaItem'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useIsMobile } from 'store/application/hooks'
import PullUpRefresh from 'components/PullUpRefresh'
import { useAllNewsData, useGetAllNews } from 'store/tradeai/hooks'

const IdeasWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: calc(100% - 72px);
  padding-right: 4px;
  gap: 20px;
  ${({ theme }) => theme.isMobile && css`
    flex-wrap: unset;
    flex-direction: column;
    height: auto;
    padding-right: 0;
    gap: 10px;
  `}
`

export default memo(function Ideas() {
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = useState(false)
  const [isPullUpRefreshing, setIsPullUpRefreshing] = useState(false)
  const [pageIndex, setPageIndex] = useState(1)
  const triggerGetAllNews = useGetAllNews()
  const [list, totalSize] = useAllNewsData()
  const length = list.length
  const wrapperRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  // 移动端下拉刷新
  const onRefresh = useCallback(() => {
    setIsPullUpRefreshing(true)
    setTimeout(() => {
      setIsPullUpRefreshing(false)
    }, 1000)
  }, [])

  // 加载更多数据
  const loadMoreIdeas = useCallback(async () => {
    if (length >= totalSize) return
    setIsPullUpRefreshing(true)
    const nextPage = pageIndex + 1
    setPageIndex(nextPage)
  }, [pageIndex, length, totalSize])

  // 初始加载数据
  useEffect(() => {
    if (pageIndex === 1) {
      setIsLoading(true)
    } 
    triggerGetAllNews({ pageIndex }).then((res) => {
      setIsPullUpRefreshing(false)
      setIsLoading(false)
    }).catch((err) => {
      setIsPullUpRefreshing(false)
      setIsLoading(false)
    })
  }, [pageIndex, triggerGetAllNews])

  // 监听滚动加载更多
  useEffect(() => {
    if (isMobile) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreIdeas()
        }
      },
      { threshold: 0.1 }
    )
    const currentLoadingRef = loadingRef.current;
    
    if (currentLoadingRef) {
      observer.observe(currentLoadingRef)
    }

    return () => {
      if (currentLoadingRef) {
        observer.unobserve(currentLoadingRef)
      }
    }
  }, [isMobile, loadMoreIdeas])

  if (length >= totalSize) {
    return <div>No Data</div>
  }

  if (isMobile) {
    return <PullUpRefresh
      onRefresh={onRefresh}
      isRefreshing={isPullUpRefreshing}
      setIsRefreshing={setIsPullUpRefreshing}
      disabledPull={length >= totalSize}
    >
      <IdeasWrapper className='scroll-style'>
        {list.map((idea, index) => (
          <IdeaItem key={idea.id} index={index} />
        ))}
      </IdeasWrapper>
    </PullUpRefresh>
  }
  
  return <>
    <IdeasWrapper className='scroll-style' ref={wrapperRef}>
      {list.map((idea, index) => (
        <IdeaItem key={idea.id} index={index} />
      ))}
      <div ref={loadingRef} style={{ height: '10px', width: '100%' }}></div>
    </IdeasWrapper>
  </>
})
