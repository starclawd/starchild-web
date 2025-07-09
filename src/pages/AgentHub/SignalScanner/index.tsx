import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo, useEffect } from 'react'
import { vm } from 'pages/helper'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import SignalScannerSection from '../components/SignalScannerSection'
import { SIGNAL_SCANNER } from 'constants/agentHub'
import { useSignalScannerAgents, useGetSignalScannerList, useIsLoading } from 'store/agenthub/hooks'
import Pending from 'components/Pending'

const SignalScannerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  
  ${({ theme }) => theme.isMobile && `
    padding: ${vm(16)};
  `}
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  
  ${({ theme }) => theme.isMobile && `
    margin-bottom: ${vm(16)};
  `}
  
  h1 {
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    color: ${({ theme }) => theme.textL1};
    margin: 0;
    
    ${({ theme }) => theme.isMobile && `
      font-size: ${vm(20)};
    `}
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1080px;
  gap: 20px;
  flex: 1;
  margin: 0 auto;
  width: 100%;
  
  ${({ theme }) => theme.isMobile && `
    gap: ${vm(16)};
  `}
`

export default memo(function SignalScanner() {
  const signalScannerWrapperRef = useScrollbarClass<HTMLDivElement>()
  
  const [signalScannerAgents] = useSignalScannerAgents()
  const [isLoading] = useIsLoading()
  const getSignalScannerList = useGetSignalScannerList()

  useEffect(() => {
    getSignalScannerList({ page: 1, pageSize: 20 })
  }, [getSignalScannerList])

  return (
    <SignalScannerWrapper ref={signalScannerWrapperRef as any} className="scroll-style">
      <Header>
        <h1>
          <Trans>{SIGNAL_SCANNER.titleKey}</Trans>
        </h1>
      </Header>
      <Content>
      <SignalScannerSection
            category={{
              id: SIGNAL_SCANNER.id,
              title: <Trans>{SIGNAL_SCANNER.titleKey}</Trans>,
              description: <Trans>{SIGNAL_SCANNER.descriptionKey}</Trans>,
              hasCustomComponent: SIGNAL_SCANNER.hasCustomComponent
            }}
            showViewMore={false}
            customAgents={signalScannerAgents}
            isLoading={isLoading}
          />
      </Content>
    </SignalScannerWrapper>
  )
}) 