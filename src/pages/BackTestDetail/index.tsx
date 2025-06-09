import styled from 'styled-components'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { useCallback, useEffect, useState } from 'react'
import useParsedQueryString from 'hooks/useParsedQueryString'
import Pending from 'components/Pending'

const BackTestDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  max-width: 1920px;
  width: 100%;
`

const Content = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

const Left = styled.div`
  display: flex;
  flex-direction: column;
`

const Right = styled.div`
  display: flex;
  flex-direction: column;
`

export default function BackTestDetail() {
  const [isLoading, setIsLoading] = useState(false)
  const { taskId } = useParsedQueryString()
  const backTestWrapperRef = useScrollbarClass<HTMLDivElement>()
  const init = useCallback(async () => {
    try {
      if (taskId) {
        setIsLoading(true)
        const data = 2
        if (!(data as any).data.success) {
          setIsLoading(false)
        } else {
          setIsLoading(false)
        }
      }
    } catch (error) {
      setIsLoading(false)
    }
  }, [taskId])
  useEffect(() => {
    init()
  }, [init])
  return <BackTestDetailWrapper
    className="scroll-style"
    ref={backTestWrapperRef as any}
  >
    <Content>
      {isLoading
      ? <Pending isFetching />
      : <>
        <Left>
          
        </Left>
        <Right>

        </Right>
      </>}
    </Content>
  </BackTestDetailWrapper>
}
