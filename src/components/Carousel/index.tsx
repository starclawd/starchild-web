/**
 * Carousel移动端轮播图组件
 * 基于Touch事件实现的移动端轮播图
 * 提供滑动切换、进度条指示和动画效果
 */
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { ImgListType } from 'store/application/application.d'
import { ANI_DURATION } from 'constants/index'

/**
 * 轮播图外层容器样式组件
 * 控制整体布局和定位
 */
const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

/**
 * 轮播图列表容器样式组件
 * 使用flex布局实现水平排列
 */
const CarouselList = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
`

/**
 * 进度条容器样式组件
 * 固定定位在底部中间位置
 */
const ProgressBar = styled.div`
  position: absolute;
  bottom: -12px;
  left: calc(50% - 45px);
  width: 90px;
  height: 4px;
  border-radius: 20px;
  overflow: hidden;
`

/**
 * 进度条背景样式组件
 * 半透明效果
 */
const BgBar = styled.div`
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background-color: ${({ theme }) => theme.text1};
`

/**
 * 进度条活动指示器样式组件
 * 根据轮播图数量动态计算宽度
 */
const Bar = styled.div<{ length: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${({ length }) => `calc(100% / ${length})`};
  height: 100%;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.bg3};
  z-index: 1;
`

/**
 * 轮播图项目样式组件
 * 控制单个轮播项的大小和激活状态样式
 */
const CarouselItem = styled.div<{ active: boolean }>`
  width: 350px;
  flex-shrink: 0;
  padding: 0 8px;
  border-radius: 16px;
  ${({ active }) =>
    !active &&
    css`
      height: calc(100% - 70px);
    `
  }
`

/**
 * 图片容器样式组件
 * 居中显示图片内容
 */
const ImgWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 12px;
`

/**
 * Carousel组件属性接口
 */
interface CarouselProps {
  onChange: (index: number) => void     // 轮播图切换回调函数
  dataList: ImgListType[]        // 轮播图数据列表
}

/**
 * Carousel组件
 * 提供移动端轮播图功能，支持触摸滑动和自动播放
 */
export default memo(function Carousel({
  dataList,
  onChange,
}: CarouselProps) {
  const carouselTimer = useRef<NodeJS.Timeout>(null)
  const carouselListRef = useRef<HTMLDivElement>(null)
  const carouselWrapperRef = useRef<HTMLDivElement>(null)
  const startPageX = useRef(0)
  const startPageY = useRef(0)
  const diff = useRef(0)
  const [translateIndex, setTranslateIndex] = useState(0)
  const [pitureTransitionTime, setPitureTransitionTime] = useState(0.3)
  const stop = useCallback(() => {
    carouselTimer.current && clearTimeout(carouselTimer.current)
  }, [])
  const touchMove = useCallback((e: any) => {
    if (carouselListRef.current && carouselWrapperRef.current) {
      const movePageX = e.changedTouches[0].pageX
      const carouselListEl = carouselListRef.current
      const carouselWrapperEl = carouselWrapperRef.current
      diff.current = movePageX - startPageX.current
      if (
        (translateIndex === 0 && diff.current > 0) ||
        (translateIndex === dataList.length - 1 && diff.current < 0)
      ) {
        return
      }
      const originTranslate = (carouselWrapperEl.clientWidth - 80) * translateIndex - 40
      carouselListEl.style.transition = 'none'
      carouselListEl.style.transform = `translateX(-${originTranslate - diff.current}px)`
    }
  }, [translateIndex, dataList])
  const touchEnd = useCallback((e: any) => {
    if (diff.current < 0) {
      if (translateIndex === dataList.length - 1) return
      setTranslateIndex(translateIndex + 1)
      onChange && onChange(translateIndex + 1)
      setPitureTransitionTime(0.3)
    } else if (diff.current > 0) {
      if (translateIndex === 0) return
      const nextIndex = translateIndex - 1
      setTranslateIndex(nextIndex)
      onChange && onChange(nextIndex)
      setPitureTransitionTime(0.3)
    }
  }, [translateIndex, dataList, onChange])
  const touchStart = useCallback((e: any) => {
    diff.current = 0
    startPageX.current = e.touches[0].pageX
    startPageY.current = e.touches[0].pageY
    stop()
  }, [stop])
  const transformStyle = useMemo(() => {
    const margin = (window.innerWidth - 350)
    return `translateX(${(0 - ((window.innerWidth - margin)) * translateIndex + margin / 2)}px)`
  }, [translateIndex])
  return (
    <CarouselWrapper ref={carouselWrapperRef as any}>
      <CarouselList
        ref={carouselListRef as any}
        onTouchEnd={touchEnd}
        onTouchMove={touchMove}
        onTouchStart={dataList.length <= 1 ? undefined : touchStart}
        style={{transform: transformStyle, transition: `all ${pitureTransitionTime}s`}}
      >
        {dataList.map((data, index) => {
          const { key, customerItem } = data
          return <CarouselItem active={index === translateIndex} key={key}>
            <ImgWrapper>
              {customerItem}
            </ImgWrapper>
          </CarouselItem>
        })}
      </CarouselList>
      {dataList.length > 1 && <ProgressBar>
        <BgBar></BgBar>
        <Bar
          length={dataList.length}
          style={{left: `${(90 / dataList.length) * translateIndex}px`, transition: `all ${ANI_DURATION}s`}}
        ></Bar>
      </ProgressBar>}
    </CarouselWrapper>
  )
})
 