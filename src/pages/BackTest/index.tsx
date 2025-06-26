import styled from 'styled-components'
import { useBacktestData, useGetBacktestData } from 'store/backtest/hooks'
import { useCallback, useEffect, useState } from 'react'
import useParsedQueryString from 'hooks/useParsedQueryString'
import Content from './components/Content'

const BackTestWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100%;
  width: 100%;
`

export default function BackTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [backtestData] = useBacktestData()
  const { taskId } = useParsedQueryString()
  const triggerGetBacktestData = useGetBacktestData()
  const init = useCallback(async () => {
    try {
      if (taskId) {
        setIsLoading(true)
        const data = await triggerGetBacktestData(taskId)
        if (!(data as any).data.success) {
          setIsLoading(false)
        } else {
          setIsLoading(false)
        }
      }
    } catch (error) {
      setIsLoading(false)
    }
  }, [taskId, triggerGetBacktestData])
  useEffect(() => {
    init()
  }, [init])
  return <BackTestWrapper>
    <Content
      isLoading={isLoading}
      backtestData={backtestData}
    />
  </BackTestWrapper>
}
