import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo, useEffect, useCallback } from 'react'
import { vm } from 'pages/helper'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import IndicatorHubSection, { IndicatorAgent } from '../components/IndicatorHubSection'
import { INDICATOR_HUB, mockIndicatorAgents } from 'constants/agentHub'

const IndicatorHubWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(16)};
    `}
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin-bottom: ${vm(16)};
    `}

  h1 {
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    color: ${({ theme }) => theme.textL1};
    margin: 0;

    ${({ theme }) =>
      theme.isMobile &&
      css`
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

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(16)};
    `}
`

export default memo(function IndicatorHub() {
  const indicatorHubWrapperRef = useScrollbarClass<HTMLDivElement>()

  // 模拟加载状态
  const isLoading = false
  const isLoadMoreLoading = false
  const hasLoadMore = false

  // 处理 load more
  const handleLoadMore = useCallback(async () => {
    console.log('Load more clicked')
    // 这里应该实现实际的数据加载逻辑
  }, [])

  return (
    <IndicatorHubWrapper ref={indicatorHubWrapperRef as any} className='scroll-style'>
      <Header>
        <h1>
          <Trans>{INDICATOR_HUB.titleKey}</Trans>
        </h1>
      </Header>
      <Content>
        <IndicatorHubSection
          category={{
            id: INDICATOR_HUB.id,
            title: <Trans>{INDICATOR_HUB.titleKey}</Trans>,
            description: <Trans>{INDICATOR_HUB.descriptionKey}</Trans>,
            hasCustomComponent: INDICATOR_HUB.hasCustomComponent,
          }}
          showViewMore={false}
          customAgents={mockIndicatorAgents}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
          isLoadMoreLoading={isLoadMoreLoading}
          hasLoadMore={hasLoadMore}
        />
      </Content>
    </IndicatorHubWrapper>
  )
})
