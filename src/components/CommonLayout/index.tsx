import { memo } from 'react'
import styled from 'styled-components'

const TempWrapper = styled.div`
  display: flex;
`

export default memo(function Temp() {
  return <TempWrapper></TempWrapper>
})
