/**
 * 上拉加载更多组件
 * 基于触摸事件实现的移动端上拉加载更多功能
 * 提供流畅的上拉动画和加载状态展示
 */
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { Dispatch, memo, ReactNode, SetStateAction, UIEventHandler, useCallback, useEffect, useRef, useState } from 'react'
import { ANI_DURATION } from 'constants/index'
import usePrevious from 'hooks/usePrevious'

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
  overflow: auto;
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
  visibility: ${({ $showPullUpArea }) => $showPullUpArea ? 'visible' : 'hidden'};
  color: ${({ theme }) => theme.text3};
  ${({ $showPullUpArea }) =>
    $showPullUpArea
      ? css`
        animation: opacityShow ${ANI_DURATION}s;
      `
      : css`
        animation: opacityDisappear ${ANI_DURATION}s;
      `
  }
`

/**
 * PullToRefresh组件
 * 提供移动端上拉加载更多功能
 * 支持自定义刷新回调和滚动事件处理
 */
export default memo(function PullToRefresh({
  onRefresh,
  children,
  onScroll,
  randomUpdate,
  isRefreshing,
  disabledPull,
  extraHeight = 0,
  setIsRefreshing,
  childrenWrapperClassName,
}: {
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
}) {
  const childrenWrapperEl = useRef<HTMLDivElement>(null)
  const pullUpAreaEl = useRef<HTMLDivElement>(null)
  const pullUpWrapperEl = useRef<HTMLDivElement>(null)
  const contentWrapperEl = useRef<HTMLDivElement>(null)
  const contentScrollTopRef = useRef(0)
  const previousYRef = useRef(0)
  const startYRef = useRef(0)
  const [isPullUp, setIsPullUp] = useState(false)
  const [showPullUpArea, setShowRefreshArea] = useState(false)
  const clientHeightRef = useRef(document.body.clientHeight)
  const preRandomUpdate = usePrevious(randomUpdate)

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
  const triggerAnimation = (height: number, duration = 0) => {
    if (contentWrapperEl.current) {
      contentWrapperEl.current.style.transition = `transform ${duration}s`
      contentWrapperEl.current.style.transform = `translateY(-${height}px)`
    }
  }

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
  }, [onRefresh, setIsRefreshing])

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
  }, [isPullUp, extraHeight, startRefresh, getMaxScrollTop])

  /**
   * 触摸移动事件处理
   * 处理上拉加载的核心逻辑
   */
  const onTouchMove = useCallback((event: any) => {
    const scrollTop = contentWrapperEl.current?.scrollTop
    if (Number(scrollTop) > 0) {
      event.stopPropagation()
    }
    if (disabledPull) return
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
  }, [onTouchEnd, getMaxScrollTop, showPullUpArea, disabledPull, extraHeight])

  /**
   * 结束刷新
   * 重置动画和显示状态
   */
  const endRefresh = useCallback(() => {
    triggerAnimation(0, 0.3)
    setShowRefreshArea(false)
  }, [])

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
   * 监听随机更新触发器
   * 重置滚动位置以避免上拉加载bug
   */
  useEffect(() => {
    if (preRandomUpdate !== randomUpdate && randomUpdate) {
      contentScrollTopRef.current = 0
    }
  }, [preRandomUpdate, randomUpdate])

  return (
    <PullUpRefreshWrapper
      ref={pullUpWrapperEl as any}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="pull-up-refresh"
    >
      <ContentWrapper
        className="pull-up-content"
        onScroll={onScroll}
        ref={contentWrapperEl as any}
      >
        <ChildrenWrapper className={`pull-up-children ${childrenWrapperClassName ? childrenWrapperClassName : ''}`} ref={childrenWrapperEl as any}>
          {children}
        </ChildrenWrapper>
        <PullUpArea
          ref={pullUpAreaEl as any}
          $showPullUpArea={showPullUpArea}
        >
          {isRefreshing ? <Trans>Loading</Trans> : <Trans>Swipe up to load more</Trans>}
        </PullUpArea>
      </ContentWrapper>
    </PullUpRefreshWrapper>
  )
})
