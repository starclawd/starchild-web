import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

const ROWS = 5
const COLS = 20
const TOTAL_ITEMS = ROWS * COLS

const TransitionPixelWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
`

const TransitionWrapper = styled.div`
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
  z-index: 2;
`

const TransitionMix = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
  z-index: 1;
`

const ItemRow = styled.div<{ $firstMixBg?: string; $secondMixBg?: string }>`
  display: flex;
  align-items: center;
  width: 100%;
  ${({ $firstMixBg, $secondMixBg }) =>
    $firstMixBg &&
    $secondMixBg &&
    css`
      &:nth-child(even) {
        .transition-mix-item:nth-child(even) {
          background-color: ${$firstMixBg};
        }
        .transition-mix-item:nth-child(odd) {
          background-color: ${$secondMixBg};
        }
      }
      &:nth-child(odd) {
        .transition-mix-item:nth-child(even) {
          background-color: ${$secondMixBg};
        }
        .transition-mix-item:nth-child(odd) {
          background-color: ${$firstMixBg};
        }
      }
    `}
`

const Item = styled.div<{ $itemBg?: string; $visible?: boolean }>`
  flex-shrink: 0;
  width: calc(100vw / 20);
  height: calc(100vw / 20);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.1s ease-out;
  ${({ $itemBg }) =>
    $itemBg &&
    css`
      background-color: ${$itemBg};
    `}
`

// 使用种子生成固定的随机打乱数组（确保每次刷新页面顺序一致）
function shuffleArrayWithSeed(length: number, seed: number): number[] {
  const arr = Array.from({ length }, (_, i) => i)
  // 简单的伪随机数生成器
  const random = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default memo(function TransitionPixel({
  baseBg,
  itemBg,
  firstMixBg,
  secondMixBg,
}: {
  baseBg: string
  itemBg: string
  firstMixBg: string
  secondMixBg: string
}) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(0)

  // TransitionWrapper 和 TransitionMix 使用不同的随机顺序
  const wrapperShuffledIndices = useMemo(() => shuffleArrayWithSeed(TOTAL_ITEMS, 12345), [])
  const mixShuffledIndices = useMemo(() => shuffleArrayWithSeed(TOTAL_ITEMS, 67890), [])

  // 计算滚动进度并更新显示数量
  const updateVisibleCount = useCallback(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const rect = wrapper.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const elementHeight = rect.height

    // 计算元素在视口中的可见进度
    // 当元素顶部刚进入视口底部时为 0，当元素底部离开视口顶部时为 1
    const startPoint = viewportHeight // 元素顶部到达视口底部
    const endPoint = -elementHeight // 元素底部离开视口顶部

    // rect.top 表示元素顶部距离视口顶部的距离
    // 当 rect.top = viewportHeight 时，元素刚好在视口下方
    // 当 rect.top = -elementHeight 时，元素刚好完全离开视口上方
    const progress = 1 - (rect.top - endPoint) / (startPoint - endPoint)
    const clampedProgress = Math.max(0, Math.min(1, progress))

    // 根据进度计算应该显示多少个 Item
    const count = Math.floor(clampedProgress * TOTAL_ITEMS)
    setVisibleCount(count)
  }, [])

  // 监听滚动事件
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    // 找到最近的可滚动父元素
    const findScrollParent = (element: HTMLElement): HTMLElement | Window => {
      let parent = element.parentElement
      while (parent) {
        const style = getComputedStyle(parent)
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
          return parent
        }
        parent = parent.parentElement
      }
      return window
    }

    const scrollParent = findScrollParent(wrapper)

    const handleScroll = () => {
      requestAnimationFrame(updateVisibleCount)
    }

    // 初始化
    updateVisibleCount()

    scrollParent.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      scrollParent.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [updateVisibleCount])

  // 根据随机顺序和当前显示数量，判断某个 Item 是否可见
  const getWrapperItemVisibility = useCallback(
    (rowIndex: number, colIndex: number) => {
      const flatIndex = rowIndex * COLS + colIndex
      // 在随机顺序中找到这个 index 的位置
      const orderIndex = wrapperShuffledIndices.indexOf(flatIndex)
      return orderIndex < visibleCount
    },
    [visibleCount, wrapperShuffledIndices],
  )

  const getMixItemVisibility = useCallback(
    (rowIndex: number, colIndex: number) => {
      const flatIndex = rowIndex * COLS + colIndex
      const orderIndex = mixShuffledIndices.indexOf(flatIndex)
      return orderIndex < visibleCount
    },
    [visibleCount, mixShuffledIndices],
  )

  const rows = useMemo(() => Array.from({ length: ROWS }), [])
  const cols = useMemo(() => Array.from({ length: COLS }), [])

  return (
    <TransitionPixelWrapper ref={wrapperRef} style={{ backgroundColor: baseBg }}>
      <TransitionWrapper>
        {rows.map((_, rowIndex) => (
          <ItemRow key={rowIndex}>
            {cols.map((_, colIndex) => (
              <Item $itemBg={itemBg} $visible={getWrapperItemVisibility(rowIndex, colIndex)} key={colIndex} />
            ))}
          </ItemRow>
        ))}
      </TransitionWrapper>
      <TransitionMix>
        {rows.map((_, rowIndex) => (
          <ItemRow key={rowIndex} $firstMixBg={firstMixBg} $secondMixBg={secondMixBg}>
            {cols.map((_, colIndex) => (
              <Item
                $visible={getMixItemVisibility(rowIndex, colIndex)}
                className='transition-mix-item'
                key={colIndex}
              />
            ))}
          </ItemRow>
        ))}
      </TransitionMix>
    </TransitionPixelWrapper>
  )
})
