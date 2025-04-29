import styled from 'styled-components'

const RouteLoadingWrapper = styled.div`
  display: flex; 
  justify-content: center; 
  align-items: center; 
  width: 100%;
  height: 100%; 
  color: #fff;
  font-size: 60px;
`

export default function RouteLoading() {
  return <RouteLoadingWrapper>
    Loading...
  </RouteLoadingWrapper>
}
