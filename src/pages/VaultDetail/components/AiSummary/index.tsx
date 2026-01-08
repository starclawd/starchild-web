import { memo } from 'react'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'
import { useCurrentRouter } from 'store/application/hooks'
import { isMatchCurrentRouter } from 'utils'
import { ROUTER } from 'pages/router'

const AiSummaryWrapper = styled.div<{ $isVaultDetailPage?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  padding: 20px;
  width: 65%;
  height: 100%;
  position: relative;
  border-right: 1px solid ${({ theme }) => theme.black800};

  ${({ $isVaultDetailPage }) =>
    $isVaultDetailPage &&
    css`
      padding: 20px 40px;
    `}
`

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      text-align: center;
      gap: ${vm(24)};
    `}
`

const IconWrapper = styled.div`
  display: flex;
  align-items: flex-start;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      justify-content: center;
    `}
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
    `}
`

const AiIcon = styled(IconBase)`
  font-size: 24px;
  color: ${({ theme }) => theme.black100};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(24)};
    `}
`

const TitleText = styled.div`
  font-size: 13px;
  line-height: 20px;
  font-weight: 400;
  color: ${({ theme }) => theme.black200};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(13)};
    `}
`

const SummaryText = styled.div`
  font-size: 16px;
  line-height: 22px;
  font-weight: 400;
  color: ${({ theme }) => theme.black0};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(16)};
    `}
`

/**
 * AI总结组件
 * 展示策略的AI分析总结
 */
const AiSummary = memo(() => {
  const currentRouter = useCurrentRouter()
  const isVaultDetailPage = isMatchCurrentRouter(currentRouter, ROUTER.VAULT_DETAIL)
  const summary =
    'This strategy operates with high selectivity. Despite low frequency—just 5 trades in the last month—it maintains high accuracy...'
  return (
    <AiSummaryWrapper $isVaultDetailPage={isVaultDetailPage}>
      <ContentSection>
        <IconWrapper>
          <AiIcon className='icon-ai-summary' />
        </IconWrapper>

        <TextWrapper>
          <TitleText>AI summary:</TitleText>
          <SummaryText>{summary}</SummaryText>
        </TextWrapper>
      </ContentSection>
    </AiSummaryWrapper>
  )
})

AiSummary.displayName = 'AiSummary'

export default AiSummary
