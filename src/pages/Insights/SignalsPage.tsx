import { memo } from 'react'
import styled from 'styled-components'
import SystemSignalOverview from './components/Signals'
import { useUserInfo } from 'store/login/hooks'
import Pending from 'components/Pending'

const SignalsWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.black900};
`

const Empty = styled.div`
  display: flex;
  visibility: hidden;
`

const InnerContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const ContentWrapper = styled.div`
  flex: 1;
  overflow: hidden;
`

const Signals = memo(() => {
  const [{ userInfoId }] = useUserInfo()

  if (!userInfoId) {
    return (
      <SignalsWrapper>
        <Pending isFetching={true} />
      </SignalsWrapper>
    )
  }

  return (
    <SignalsWrapper>
      <Empty />
      <InnerContent>
        <ContentWrapper>
          <SystemSignalOverview />
        </ContentWrapper>
      </InnerContent>
    </SignalsWrapper>
  )
})

Signals.displayName = 'Signals'

export default Signals
