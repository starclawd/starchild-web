import { memo, useState, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import UseCasesTabBar from './components/UseCasesTabBar'
import UseCasesTabView from './components/UseCasesTabView'
import { useScrollbarClass } from 'hooks/useScrollbarClass'

const UseCasesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 80px 0 100px;
  overflow: auto;
`

const InnerContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 1080px;
`

const Title = styled.h1`
  font-size: 36px;
  font-weight: 500;
  line-height: 44px;
  margin-bottom: 12px;
  margin-top: 0;
  width: fit-content;
  background: linear-gradient(90deg, #f84600 0%, #ffffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const Description = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  margin-bottom: 48px;
  color: ${({ theme }) => theme.black200};
`

function UseCases() {
  const useCasesWrapperRef = useScrollbarClass<HTMLDivElement>()

  return (
    <UseCasesWrapper ref={useCasesWrapperRef as any} className='scroll-style'>
      <InnerContent>
        <Title>
          <Trans>Starchild use cases</Trans>
        </Title>
        <Description>
          <Trans>Want to see how Starchild can level up your trading? Just talk to him — he's ready to help.</Trans>
        </Description>
        <UseCasesTabBar />
        <UseCasesTabView />
      </InnerContent>
    </UseCasesWrapper>
  )
}

export default memo(UseCases)
