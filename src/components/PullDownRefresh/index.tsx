/**
 * PullDownRefresh移动端下拉刷新组件
 * 提供自定义下拉刷新功能和动画效果
 * 支持iOS和Android平台，包含阻尼效果
*/
import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
// import JojoLoading from 'components/JojoLoading'
import { ANI_DURATION } from 'constants/index'

/**
 * 下拉刷新外层容器样式组件
 * 提供基础布局和平台适配
 */
const PullDownRefreshWrapper = styled.div`
  display: flex;
  justify-content: center;
  overflow: hidden;
  width: 100%;
  height: 100%;
`

/**
 * 内容容器样式组件
 * 包含下拉区域和主要内容
 */
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% + 50px);
`

/**
 * 子内容容器样式组件
 * 控制主要内容区域的布局
 */
const ChildrenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 50px);
`

/**
 * 下拉区域样式组件
 * 控制下拉提示和加载动画的显示
 */
const PullDownArea = styled.div<{ 
  $showPullDownArea: boolean,     // 是否显示下拉区域
  $pullDownAreaHeight: string,    // 下拉区域高度
  $isRefreshing: boolean         // 是否正在刷新
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: ${({ $pullDownAreaHeight, $isRefreshing }) => $pullDownAreaHeight && $isRefreshing ? $pullDownAreaHeight : '50px'};
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  flex-shrink: 0;
  transition: height ${ANI_DURATION}s;
  visibility: ${({ $showPullDownArea }) => $showPullDownArea ? 'visible' : 'hidden'};
  .domain {
    font-weight: 600;
    font-size: 12px;
    line-height: 12px;
    margin-top: 4px;
  }
  .jojo-loading-wrapper {
    width: auto;
    height: auto;
    margin-right: 4px;
    align-items: flex-start;
    span {
      width: 24px;
      height: 24px;
    }
  }
`

/**
 * PullDownRefresh组件属性接口
 */
interface PullDownRefreshProps {
  children: ReactNode                                  // 子内容
  pullDownAreaHeight?: string                         // 下拉区域高度
  onRefresh?: () => void                         // 刷新回调函数
  isRefreshing: boolean                              // 是否正在刷新
  setIsRefreshing: Dispatch<SetStateAction<boolean>> // 设置刷新状态
}

/**
 * PullDownRefresh组件
 * 提供移动端下拉刷新功能
 * 包含触摸事件处理和动画效果
 */
export default memo(function PullDownRefresh({
  onRefresh,
  children,
  isRefreshing,
  setIsRefreshing,
  pullDownAreaHeight = '50px',
}: PullDownRefreshProps) {
  // 初始化常量和引用
  const initTranslate = -50
  const childrenWrapperEl = useRef<HTMLDivElement>(null)
  const pullDownAreaEl = useRef<HTMLDivElement>(null)
  const pullDownWrapperEl = useRef<HTMLDivElement>(null)
  const contentWrapperEl = useRef<HTMLDivElement>(null)
  const contentScrollTopRef = useRef(initTranslate)
  const previousYRef = useRef(0)
  const startYRef = useRef(0)
  const clientHeightRef = useRef(document.body.clientHeight)

  // 状态管理
  const [isPullDown, setIsPullDown] = useState(false)
  const [translate, setTranslate] = useState(initTranslate)
  const [duration, setDuration] = useState(0)
  const [showPullDownArea, setShowRefreshArea] = useState(false)

  // 触发动画效果
  const triggerAnimation = (height: number, duration = 0) => {
    setTranslate(height)
    setDuration(duration)
  }

  // 触摸开始事件处理
  const onTouchStart = useCallback((event: any) => {
    previousYRef.current = 0
    contentScrollTopRef.current = initTranslate
    startYRef.current = event.touches ? event.touches[0].pageY : event.clientY
  }, [initTranslate])

  // 开始刷新处理
  const startRefresh = useCallback(() => {
    setIsRefreshing(true)
    triggerAnimation(0, 0.3)
    onRefresh && onRefresh()
  }, [onRefresh, setIsRefreshing])

  // 结束刷新处理
  const endRefresh = useCallback(() => {
    triggerAnimation(initTranslate, 0.3)
    setShowRefreshArea(false)
  }, [initTranslate])

  // 触摸结束事件处理
  const onTouchEnd = useCallback(() => {
    const contentWrapper = contentWrapperEl.current
    const contentScrollTop = contentScrollTopRef.current
    if (isPullDown) {
      contentScrollTopRef.current = contentWrapper ? contentWrapper.scrollTop : 0
      if (contentScrollTop >= 0) {
        startRefresh()
      } else {
        triggerAnimation(initTranslate, 0.3)
        setShowRefreshArea(false)
      }
      setIsPullDown(false)
    }
  }, [isPullDown, initTranslate, startRefresh])

  // 触摸移动事件处理
  const onTouchMove = useCallback((event: any) => {
    const previousY = previousYRef.current
    const clientHeight = clientHeightRef.current
    const startY = startYRef.current
    const currentY = event.touches ? event.touches[0].pageY : event.clientY

    // 超出屏幕边界处理
    if (currentY > clientHeight) {
      onTouchEnd()
      return
    }

    if (!showPullDownArea) setShowRefreshArea(true)

    // 计算移动距离和阻尼效果
    if (!previousY) previousYRef.current = currentY
    let diff = currentY - previousYRef.current
    const moveY = currentY - startY
    const dampRate = 0.3

    if (moveY > 0) {
      setIsPullDown(true)
      if (diff > 0) {
        diff = diff > Math.abs(initTranslate) ? Math.abs(initTranslate) : diff
        contentScrollTopRef.current += diff * dampRate
      } else {
        contentScrollTopRef.current += diff * dampRate
      }
      triggerAnimation(contentScrollTopRef.current, 0)
    }
    previousYRef.current = currentY
  }, [onTouchEnd, showPullDownArea, initTranslate])

  // 监听刷新状态变化
  useEffect(() => {
    if (!isRefreshing) {
      endRefresh()
    }
  }, [isRefreshing, endRefresh])

  return (
    <PullDownRefreshWrapper
      ref={pullDownWrapperEl as any}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <ContentWrapper
        ref={contentWrapperEl as any}
        style={{
          transitionDuration: `${duration}s`,
          transform: `translateY(${translate}px)`
        }}
      >
        <PullDownArea
          $isRefreshing={isRefreshing}
          $pullDownAreaHeight={pullDownAreaHeight}
          ref={pullDownAreaEl as any}
          $showPullDownArea={showPullDownArea}
        >
          {/* <JojoLoading isLoading={true} /> */}
          <span className="domain">{window.location.hostname}</span>
        </PullDownArea>
        <ChildrenWrapper className="children-wrapper" ref={childrenWrapperEl as any}>
          {children}
        </ChildrenWrapper>
      </ContentWrapper>
    </PullDownRefreshWrapper>
  )
})
