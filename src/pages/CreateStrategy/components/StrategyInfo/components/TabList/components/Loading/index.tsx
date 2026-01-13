import { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ParamFun } from 'types/global'

const LoadingWrapper = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  height: 3px;
  width: 100%;
`

const Progress = styled.div`
  height: 100%;
  will-change: width;
  background-color: ${({ theme }) => theme.brand100};
`

export default memo(function Loading({
  intervalDuration = 120000,
  loadingPercentProp,
  setLoadingPercentProp,
}: {
  intervalDuration?: number
  loadingPercentProp?: number
  setLoadingPercentProp?: ParamFun<number>
}) {
  let [loadingPercent, setLoadingPercent] = useState(0)
  if (loadingPercentProp !== undefined && setLoadingPercentProp !== undefined) {
    loadingPercent = loadingPercentProp
    setLoadingPercent = setLoadingPercentProp as Dispatch<SetStateAction<number>>
  }
  // 进度动画函数
  const animateLoading = useCallback(() => {
    const startTime = Date.now()

    const updateProgress = () => {
      const now = Date.now()
      const elapsed = now - startTime

      // 计算当前是第几个周期
      const currentCycle = Math.floor(elapsed / intervalDuration)
      // 当前周期内的进度 (0-1)
      const cycleProgress = (elapsed % intervalDuration) / intervalDuration

      // 计算当前进度百分比
      let currentPercent = 0

      // 每个周期走剩余的60%
      for (let i = 0; i <= currentCycle; i++) {
        const remaining = 100 - currentPercent
        if (i === currentCycle) {
          // 当前周期：根据cycleProgress计算部分进度
          currentPercent += remaining * 0.6 * cycleProgress
        } else {
          // 已完成的周期：直接加上60%的剩余
          currentPercent += remaining * 0.6
        }
      }

      // 确保不超过99%（永远不到100%）
      currentPercent = Math.min(currentPercent, 99)
      setLoadingPercent(currentPercent)

      // 继续动画直到外部停止
      requestAnimationFrame(updateProgress)
    }

    requestAnimationFrame(updateProgress)
  }, [intervalDuration, setLoadingPercent])

  useEffect(() => {
    animateLoading()
  }, [animateLoading])

  return (
    <LoadingWrapper>
      <Progress style={{ width: `${loadingPercent}%` }}></Progress>
    </LoadingWrapper>
  )
})
