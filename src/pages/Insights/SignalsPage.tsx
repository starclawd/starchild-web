import { memo } from 'react'
import styled from 'styled-components'
import SystemSignalOverview from './components/Signals'
import { useUserInfo } from 'store/login/hooks'
import Pending from 'components/Pending'
import Insights from 'components/Header/components/MenuContent/components/Insights'
import { Trans } from '@lingui/react/macro'

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
  width: 1080px;
  margin: 0 auto;
  display: flex;
  overflow: hidden;
`

const LeftPanel = styled.div`
  width: 260px;
  flex-shrink: 0;
  overflow: hidden;
  padding-top: 20px;
`

const RightPanel = styled.div`
  flex: 1;
  overflow: hidden;
`

const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: ${({ theme }) => theme.black0};
  margin-bottom: 12px;
`

const Signals = memo(() => {
  const [{ userInfoId }] = useUserInfo()

  if (!userInfoId) {
    return (
      <SignalsWrapper>
        <Pending isNotButtonLoading />
      </SignalsWrapper>
    )
  }

  return (
    <SignalsWrapper>
      <Empty />
      <InnerContent>
        <ContentWrapper>
          <LeftPanel>
            <Title>
              <Trans>Agent list</Trans>
            </Title>
            <Insights />
          </LeftPanel>
          <RightPanel>
            <SystemSignalOverview />
          </RightPanel>
        </ContentWrapper>
      </InnerContent>
    </SignalsWrapper>
  )
})

Signals.displayName = 'Signals'

export default Signals
