import { memo } from 'react'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'
import AiSummaryBg from 'assets/vaults/ai-summary-bg.png'

const AiSummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  width: 100%;
  height: 200px;
  position: relative;
  background-image: url(${AiSummaryBg});
  background-repeat: no-repeat;
  background-position: top right;
  background-size: auto;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(20)};
      height: ${vm(200)};
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

interface AiSummaryProps {
  /** AI总结内容 */
  summary: string
}

/**
 * AI总结组件
 * 展示策略的AI分析总结
 */
const AiSummary = memo<AiSummaryProps>(({ summary }) => {
  return (
    <AiSummaryWrapper>
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
