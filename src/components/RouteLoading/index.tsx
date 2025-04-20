import styled from 'styled-components'

const RouteLoadingWrapper = styled.div`
  display: flex; 
  justify-content: center; 
  align-items: center; 
  height: 100%; 
`

export default function RouteLoading() {
  return <RouteLoadingWrapper>
    Loading...
  </RouteLoadingWrapper>
}
