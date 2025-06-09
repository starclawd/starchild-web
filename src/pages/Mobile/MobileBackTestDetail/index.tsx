import { useScrollbarClass } from 'hooks/useScrollbarClass'
import styled from 'styled-components'
import { useCallback, useEffect, useState } from 'react'
import useParsedQueryString from 'hooks/useParsedQueryString'
import Pending from 'components/Pending'

const MobileBackTestDetailWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  padding: 12px;
  cursor: pointer;
  .icon-loading {
    font-size: 36px !important;
  }
`

export default function MobileBackTestDetail() {
  const [isLoading, setIsLoading] = useState(false)
  const { taskId } = useParsedQueryString()
  const backTestWrapperRef = useScrollbarClass<HTMLDivElement>()
  const init = useCallback(async () => {
    try {
      if (taskId) {
        setIsLoading(true)
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
    }
  }, [taskId])
  useEffect(() => {
    init()
  }, [init])

  return <MobileBackTestDetailWrapper 
    ref={backTestWrapperRef as any}
  >
    {isLoading
      ? <Pending isFetching />
      : <>
        
      </>}
    
  </MobileBackTestDetailWrapper>
}
