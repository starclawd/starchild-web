import styled from 'styled-components'
import { memo } from 'react'
import { vm } from 'pages/helper'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import AgentCard from './components/AgentCard'
import { ButtonBorder } from 'components/Button'
import { Trans } from '@lingui/react/macro'
import AgentList from './components/AgentList'
import RunAgentCard from './components/RunAgentCard'
import { ROUTER } from 'pages/router'
import { useNavigate } from 'react-router-dom'
import { SignalScannerAgent } from 'store/agenthub/agenthub'
import Pending from 'components/Pending'
import PullUpRefresh from 'components/PullUpRefresh'

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;

  ${({ theme }) =>
    theme.isMobile &&
    `
    gap: ${vm(24)};
  `}
`

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${({ theme }) =>
    theme.isMobile &&
    `
    gap: ${vm(8)};
    padding: 0 ${vm(16)};
  `}
`

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(20)};
  `}
`

const SectionDescription = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.textL2};
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(14)};
  `}
`

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;

  ${({ theme }) =>
    theme.isMobile &&
    `
    grid-template-columns: 1fr;
    gap: ${vm(16)};
  `}
`

interface Category {
  id: string
  title: React.ReactNode
  description: React.ReactNode
  hasCustomComponent: boolean
}

interface SignalScannerProps {
  category: Category
  showViewMore?: boolean
  isLoading: boolean
  maxAgents?: number
  customAgents?: SignalScannerAgent[]
  onLoadMore?: () => void
  isLoadMoreLoading?: boolean
  hasLoadMore?: boolean
}

export default memo(function SignalScanner({
  category,
  showViewMore = true,
  isLoading = false,
  maxAgents,
  customAgents,
  onLoadMore,
  isLoadMoreLoading = false,
  hasLoadMore = true,
}: SignalScannerProps) {
  const navigate = useNavigate()

  // 使用传入的自定义数据，并根据 maxAgents 限制显示数量
  const agentsToShow = customAgents?.slice(0, maxAgents) || []

  const handleRunAgent = () => {
    console.log('Run Agent clicked')
    // Handle run agent action
  }

  // 渲染内容区域
  const renderContent = () => (
    <ContentWrapper>
      {/* RunAgent - 占据左侧2行 */}
      <RunAgentCard onRunAgent={handleRunAgent} />

      {/* AgentCards */}
      {isLoading ? (
        <Pending isFetching={true} />
      ) : (
        <AgentList
          agents={agentsToShow || []}
          onAgentClick={(agent) => {
            console.log('Agent clicked:', agent)
          }}
        />
      )}
    </ContentWrapper>
  )

  return (
    <SectionWrapper id={category.id}>
      <SectionHeader>
        <SectionTitle>{category.title}</SectionTitle>
        <SectionDescription>{category.description}</SectionDescription>
      </SectionHeader>

      {/* 如果有 onLoadMore 回调，使用 PullUpRefresh 包裹 */}
      {onLoadMore ? (
        <PullUpRefresh
          onRefresh={onLoadMore}
          isRefreshing={isLoading || isLoadMoreLoading}
          disabledPull={isLoading || isLoadMoreLoading}
          setIsRefreshing={() => {}}
          hasLoadMore={hasLoadMore}
        >
          {renderContent()}
        </PullUpRefresh>
      ) : (
        renderContent()
      )}

      {showViewMore && (
        <ButtonBorder onClick={() => navigate(ROUTER.AGENT_HUB_SIGNAL)}>
          <Trans>View more</Trans>
        </ButtonBorder>
      )}
    </SectionWrapper>
  )
})
