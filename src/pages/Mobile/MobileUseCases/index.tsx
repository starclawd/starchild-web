import { memo } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { BottomSafeArea } from 'components/SafeAreaWrapper'
import UseCasesTabBar from '../../UseCases/components/UseCasesTabBar'
import UseCasesTabView from '../../UseCases/components/UseCasesTabView'

const MobileUseCasesWrapper = styled(BottomSafeArea)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.bgL0};
  padding: ${vm(20)} ${vm(16)} ${vm(20)};
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

function MobileUseCases() {
  return (
    <MobileUseCasesWrapper>
      <Title>
        <Trans>Starchild use cases</Trans>
      </Title>
      <Description>
        <Trans>Want to see how Starchild can level up your trading? Just talk to him — he's ready to help.</Trans>
      </Description>
      <UseCasesTabBar />
      <UseCasesTabView />
    </MobileUseCasesWrapper>
  )
}

export default memo(MobileUseCases)
