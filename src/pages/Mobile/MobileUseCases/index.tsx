import { memo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { BottomSafeArea } from 'components/SafeAreaWrapper'
import UseCasesTabBar from '../../UseCases/components/UseCasesTabBar'
import UseCasesTabView from '../../UseCases/components/UseCasesTabView'
import MobileHeader from '../components/MobileHeader'
import { useActiveTab, useIsPlaying } from 'store/usecases/hooks/useUseCasesHooks'
import { TAB_CONTENT_CONFIG, TabKey } from 'constants/useCases'

const MobileUseCasesWrapper = styled(BottomSafeArea)<{ $isPlaying?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.bgL0};
  padding: ${vm(20)} ${vm(16)} ${vm(20)};
  ${({ $isPlaying }) =>
    $isPlaying &&
    css`
      padding: 0 0 ${vm(16)};
    `}
`

const Title = styled.h1`
  font-size: ${vm(26)};
  font-weight: 500;
  line-height: ${vm(34)};
  margin-bottom: ${vm(12)};
  width: fit-content;
  background: linear-gradient(90deg, #f84600 0%, #ffffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const Description = styled.p`
  font-size: ${vm(13)};
  font-weight: 400;
  line-height: ${vm(20)};
  margin-bottom: ${vm(20)};
  color: ${({ theme }) => theme.textL3};
`

const CloseDemo = styled.div`
  font-size: ${vm(14)};
  font-weight: 500;
  line-height: ${vm(20)};
  color: ${({ theme }) => theme.brand100};
  padding-right: ${vm(12)};
`

const LeftTitleContent = styled.div`
  font-size: ${vm(16)};
  font-weight: 500;
  line-height: ${vm(24)};
  color: ${({ theme }) => theme.textL1};
  padding-left: ${vm(12)};
`

function MobileUseCases() {
  const [activeTab] = useActiveTab()
  const [isPlaying, setIsPlaying] = useIsPlaying()
  const content = TAB_CONTENT_CONFIG[activeTab as TabKey]
  const closeDemo = useCallback(() => {
    setIsPlaying(false)
  }, [setIsPlaying])
  return (
    <>
      <MobileHeader
        hideMenu={isPlaying}
        leftSection={<LeftTitleContent>{content.title}</LeftTitleContent>}
        title={''}
        rightSection={
          isPlaying ? (
            <CloseDemo onClick={closeDemo}>
              <Trans>Close demo</Trans>
            </CloseDemo>
          ) : null
        }
      />
      <MobileUseCasesWrapper $isPlaying={isPlaying}>
        {!isPlaying && (
          <Title>
            <Trans>Starchild use cases</Trans>
          </Title>
        )}
        {!isPlaying && (
          <Description>
            <Trans>Want to see how Starchild can level up your trading? Just talk to him — he's ready to help.</Trans>
          </Description>
        )}
        {!isPlaying && <UseCasesTabBar />}
        <UseCasesTabView />
      </MobileUseCasesWrapper>
    </>
  )
}

export default memo(MobileUseCases)
