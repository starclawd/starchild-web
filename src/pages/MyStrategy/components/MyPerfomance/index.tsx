import { memo } from 'react'
import styled from 'styled-components'

const MyPerfomanceWrapper = styled.div`
  display: flex;
`

export default memo(function MyPerfomance() {
  return <MyPerfomanceWrapper></MyPerfomanceWrapper>
})
