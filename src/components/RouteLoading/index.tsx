import Pending from 'components/Pending'
import styled, { css } from 'styled-components'

const RouteLoadingWrapper = styled.div`
  display: flex; 
  justify-content: center; 
  align-items: center; 
  width: 100%;
  height: 100%;
  .icon-loading {
    font-size: 40px !important;
  }
`

export default function RouteLoading() {
  return <RouteLoadingWrapper>
    <Pending />
  </RouteLoadingWrapper>
}
