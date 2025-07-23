/**
 * 上拉加载更多组件
 * 支持移动端触摸和PC端滚轮操作的上拉加载更多功能
 * 提供流畅的上拉动画和加载状态展示
 */
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import {
  Dispatch,
  memo,
  ReactNode,
  SetStateAction,
  UIEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { ANI_DURATION } from 'constants/index'
import usePrevious from 'hooks/usePrevious'
import { useScrollbarClass } from 'hooks/useScrollbarClass'

/**
 * 组件最外层容器样式
 * 采用flex布局确保内容居中
 */
const PullUpRefreshWrapper = styled.div`
  display: flex;
  justify-content: center;
  overflow: hidden;
  width: 100%;
  height: 100%;
`

/**
 * 内容容器样式组件
 * 设置额外高度以容纳上拉加载区域
 */
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% + 40px);
`

/**
 * 子内容包装器样式组件
 * 使用flex列布局排列内容
 */
const ChildrenWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

/**
 * 上拉加载区域样式组件
 * 处理显示/隐藏状态和动画效果
 */
const PullUpArea = styled.div<{ $showPullUpArea: boolean }>`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  height: 40px;
  padding-top: 5px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.textL2};
  visibility: ${({ $showPullUpArea }) => ($showPullUpArea ? 'visible' : 'hidden')};
  ${({ $showPullUpArea }) =>
    $showPullUpArea
      ? css`
          animation: opacityShow ${ANI_DURATION}s;
        `
      : css`
          animation: opacityDisappear ${ANI_DURATION}s;
        `}
`

/**
 * PullUpRefresh组件属性接口
 */
interface PullUpRefreshProps {
  /** 滚动事件处理函数 */
  onScroll?: UIEventHandler<HTMLDivElement>
  /** 是否禁用上拉加载功能 */
  disabledPull: boolean
  /** 触发组件更新的随机值 */
  randomUpdate?: any
  /** 刷新回调函数 */
  onRefresh: () => void
  /** 子组件内容 */
  children: ReactNode
  /** 是否正在刷新中 */
  isRefreshing: boolean
  /** 子容器的自定义类名 */
  childrenWrapperClassName?: string
  /** 额外的高度调整值 */
  extraHeight?: number
  /** 设置刷新状态的函数 */
  setIsRefreshing: Dispatch<SetStateAction<boolean>>
  /** 是否启用PC端滚轮支持 */
  enableWheel?: boolean
  /** PC端滚轮触发阈值 */
  wheelThreshold?: number
  /** 是否还有更多数据可以加载 */
  hasLoadMore?: boolean
}

/**
 * PullUpRefresh组件
 * 提供移动端触摸和PC端滚轮的上拉加载更多功能
 * 支持自定义刷新回调和滚动事件处理
 */
export default memo(function PullUpRefresh({
  onRefresh,
  children,
  onScroll,
  randomUpdate,
  isRefreshing,
  disabledPull,
  extraHeight = 0,
  setIsRefreshing,
  childrenWrapperClassName,
  enableWheel = true,
  wheelThreshold = 50,
  hasLoadMore = false,
}: PullUpRefreshProps) {
  const childrenWrapperEl = useRef<HTMLDivElement>(null)
  const pullUpAreaEl = useRef<HTMLDivElement>(null)
  const pullUpWrapperEl = useRef<HTMLDivElement>(null)
  const contentWrapperEl = useScrollbarClass<HTMLDivElement>()
  const contentScrollTopRef = useRef(0)
  const previousYRef = useRef(0)
  const startYRef = useRef(0)
  const [isPullUp, setIsPullUp] = useState(false)
  const [showPullUpArea, setShowRefreshArea] = useState(false)
  const clientHeightRef = useRef(document.body.clientHeight)
  const preRandomUpdate = usePrevious(randomUpdate)
  const wheelDeltaRef = useRef(0)
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * 获取最大滚动高度
   * 计算子内容高度与容器高度的差值
   */
  const getMaxScrollTop = useCallback(() => {
    const childrenWrapper = childrenWrapperEl.current
    const pullUpWrapper = pullUpWrapperEl.current
    const childrenWrapperHeight = childrenWrapper ? childrenWrapper.offsetHeight : 0
    const pullUpWrapperHeight = pullUpWrapper ? pullUpWrapper.offsetHeight : 0
    return childrenWrapperHeight - pullUpWrapperHeight
  }, [])

  /**
   * 触发动画效果
   * @param height 动画高度
   * @param duration 动画持续时间
   */
  const triggerAnimation = useCallback(
    (height: number, duration = 0) => {
      if (contentWrapperEl.current) {
        contentWrapperEl.current.style.transition = `transform ${duration}s`
        contentWrapperEl.current.style.transform = `translateY(-${height}px)`
      }
    },
    [contentWrapperEl],
  )

  /**
   * 触摸开始事件处理
   * 记录初始触摸位置
   */
  const onTouchStart = useCallback((event: any) => {
    previousYRef.current = 0
    startYRef.current = event.touches ? event.touches[0].pageY : event.clientY
  }, [])

  /**
   * 开始刷新
   * 触发刷新动画和回调
   */
  const startRefresh = useCallback(() => {
    const pullupArea = pullUpAreaEl.current
    const pullupAreaHeight = pullupArea ? pullupArea.offsetHeight : 0
    setIsRefreshing(true)
    triggerAnimation(pullupAreaHeight, 0.3)
    onRefresh && onRefresh()
  }, [onRefresh, setIsRefreshing, triggerAnimation])

  /**
   * 触摸结束事件处理
   * 根据滚动位置决定是否触发刷新
   */
  const onTouchEnd = useCallback(() => {
    const contentScrollTop = contentScrollTopRef.current - extraHeight
    const pullupArea = pullUpAreaEl.current
    const pullupAreaHeight = pullupArea ? pullupArea.offsetHeight : 0
    const maxScrollTop = getMaxScrollTop()
    if (isPullUp) {
      if (contentScrollTop - maxScrollTop >= pullupAreaHeight) {
        startRefresh()
      } else {
        triggerAnimation(0, 0.3)
        setShowRefreshArea(false)
      }
      setIsPullUp(false)
    }
    contentScrollTopRef.current = maxScrollTop
  }, [isPullUp, extraHeight, startRefresh, triggerAnimation, getMaxScrollTop])

  /**
   * 触摸移动事件处理
   * 处理上拉加载的核心逻辑
   */
  const onTouchMove = useCallback(
    (event: any) => {
      const scrollTop = contentWrapperEl.current?.scrollTop
      if (Number(scrollTop) > 0) {
        event.stopPropagation()
      }
      if (disabledPull || !hasLoadMore) return
      const contentWrapper = contentWrapperEl.current
      let contentScrollTop = contentScrollTopRef.current - extraHeight
      const maxScrollTop = getMaxScrollTop()
      const previousY = previousYRef.current
      const clientHeight = clientHeightRef.current
      const startY = startYRef.current
      if (contentScrollTop < maxScrollTop && maxScrollTop - contentScrollTop > 1) {
        contentScrollTop = contentWrapper ? contentWrapper.scrollTop : 0
        contentScrollTopRef.current = contentScrollTop
        return
      }
      // 获取当前手指位置
      const currentY = event.touches ? event.touches[0].pageY : event.clientY
      if (currentY > clientHeight) {
        onTouchEnd()
        return
      }
      if (!showPullUpArea) setShowRefreshArea(true)

      // 初始化之前的手指位置
      if (!previousY) previousYRef.current = currentY

      // 计算前后2次手指位置Y轴差
      const diff = currentY - previousY
      // 判断对比滑动开始时的位置，是否正在上拉，只有上拉时才触发
      const moveY = currentY - startY
      const dampRate = 0.3
      if (moveY < 0) {
        setIsPullUp(true)
        contentScrollTopRef.current -= diff * dampRate
        // 在ios不使用弹性上拉，避免与原声的反弹冲突
        // if (isIos) {
        //   contentScrollTopRef.current = maxScrollTop + 27
        // }
        // 执行上拉动画
        triggerAnimation(contentScrollTop - maxScrollTop, 0)
      }
      // 将此次手指位置保存为上次
      previousYRef.current = currentY
    },
    [
      contentWrapperEl,
      disabledPull,
      hasLoadMore,
      extraHeight,
      getMaxScrollTop,
      showPullUpArea,
      onTouchEnd,
      triggerAnimation,
    ],
  )

  /**
   * 结束刷新
   * 重置动画和显示状态
   */
  const endRefresh = useCallback(() => {
    triggerAnimation(0, 0.3)
    setShowRefreshArea(false)
  }, [triggerAnimation])

  /**
   * 监听刷新状态变化
   * 当刷新结束时重置组件状态
   */
  useEffect(() => {
    if (!isRefreshing) {
      endRefresh()
    }
  }, [isRefreshing, endRefresh])

  /**
   * 监听 hasLoadMore 和 isRefreshing 变化
   * 当正在刷新时显示加载状态，当没有更多数据时显示提示信息
   */
  useEffect(() => {
    if (isRefreshing) {
      setShowRefreshArea(true)
    } else if (!hasLoadMore) {
      setShowRefreshArea(true)
    } else if (hasLoadMore) {
      setShowRefreshArea(false)
    }
  }, [hasLoadMore, isRefreshing])

  /**
   * 滚轮事件处理（PC端）
   * 处理鼠标滚轮的上拉加载逻辑
   */
  const onWheel = useCallback(
    (event: WheelEvent) => {
      if (!enableWheel || disabledPull || !hasLoadMore) return

      const contentWrapper = contentWrapperEl.current
      if (!contentWrapper) return

      const contentScrollTop = contentWrapper.scrollTop
      const maxScrollTop = getMaxScrollTop()

      // 只有当滚动到底部时才处理滚轮事件
      if (contentScrollTop < maxScrollTop - 1) return

      // 阻止默认滚动行为
      event.preventDefault()

      // 累积滚轮增量
      wheelDeltaRef.current += event.deltaY

      // 显示上拉区域
      if (!showPullUpArea) {
        setShowRefreshArea(true)
      }

      // 当累积的滚轮增量达到阈值时触发刷新
      if (wheelDeltaRef.current >= wheelThreshold) {
        startRefresh()
        wheelDeltaRef.current = 0
      }

      // 清除之前的定时器
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current)
      }

      // 设置定时器，一段时间后重置滚轮增量
      wheelTimeoutRef.current = setTimeout(() => {
        wheelDeltaRef.current = 0
        if (!isRefreshing) {
          setShowRefreshArea(false)
        }
      }, 1000)
    },
    [
      enableWheel,
      disabledPull,
      hasLoadMore,
      getMaxScrollTop,
      showPullUpArea,
      wheelThreshold,
      startRefresh,
      isRefreshing,
      contentWrapperEl,
    ],
  )

  /**
   * 监听随机更新触发器
   * 重置滚动位置以避免上拉加载bug
   */
  useEffect(() => {
    if (preRandomUpdate !== randomUpdate && randomUpdate) {
      contentScrollTopRef.current = 0
    }
  }, [preRandomUpdate, randomUpdate])

  /**
   * 添加滚轮事件监听
   */
  useEffect(() => {
    const contentWrapper = contentWrapperEl.current
    if (!contentWrapper || !enableWheel) return

    const handleWheel = (event: WheelEvent) => onWheel(event)
    contentWrapper.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      contentWrapper.removeEventListener('wheel', handleWheel)
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current)
      }
    }
  }, [onWheel, enableWheel, contentWrapperEl])

  return (
    <PullUpRefreshWrapper
      ref={pullUpWrapperEl as any}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className='pull-up-refresh'
    >
      <ContentWrapper className='pull-up-content scroll-style' onScroll={onScroll} ref={contentWrapperEl as any}>
        <ChildrenWrapper
          className={`pull-up-children ${childrenWrapperClassName ? childrenWrapperClassName : ''}`}
          ref={childrenWrapperEl as any}
        >
          {children}
        </ChildrenWrapper>
        <PullUpArea ref={pullUpAreaEl as any} $showPullUpArea={showPullUpArea}>
          {isRefreshing ? (
            <Trans>Loading</Trans>
          ) : !hasLoadMore ? (
            <>{/* 不再展示All data loaded */}</>
          ) : (
            <Trans>Swipe up to load more</Trans>
          )}
        </PullUpArea>
      </ContentWrapper>
    </PullUpRefreshWrapper>
  )
})
