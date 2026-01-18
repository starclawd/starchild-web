import { memo } from 'react'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'
import { useCurrentRouter } from 'store/application/hooks'
import { isMatchCurrentRouter } from 'utils'
import { ROUTER } from 'pages/router'
import { ANI_DURATION } from 'constants/index'
import { useIsShowStrategyMarket } from 'store/vaultsdetailcache/hooks'
import { useVibeTradingStrategyInfo } from 'store/vaultsdetail/hooks'
import useParsedQueryString from 'hooks/useParsedQueryString'
import Markdown from 'components/Markdown'

const AiSummaryWrapper = styled.div<{ $isShowStrategyMarket: boolean; $isVaultDetailPage?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  padding: 20px;
  width: 100%;
  height: 100%;
  position: relative;
  transition: all ${ANI_DURATION}s;
  ${({ $isVaultDetailPage, theme, $isShowStrategyMarket }) =>
    $isVaultDetailPage &&
    css`
      padding: 20px 40px;
      ${theme.mediaMaxWidth.width1280`
        padding: 20px;
      `}
      ${$isShowStrategyMarket &&
      css`
        ${theme.mediaMaxWidth.width1440`
          padding: 20px;
        `}
      `}
    `}
`

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
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
  const { strategyId } = useParsedQueryString()
  const [isShowStrategyMarket] = useIsShowStrategyMarket()
  const currentRouter = useCurrentRouter()
  const isVaultDetailPage = isMatchCurrentRouter(currentRouter, ROUTER.VAULT_DETAIL)
  const { strategyInfo } = useVibeTradingStrategyInfo({ strategyId: strategyId || null })
  const summary = strategyInfo?.ai_summary || ''
  return (
    <AiSummaryWrapper $isShowStrategyMarket={isShowStrategyMarket} $isVaultDetailPage={isVaultDetailPage}>
      <ContentSection>
        <IconWrapper>
          <AiIcon className='icon-ai-summary' />
        </IconWrapper>

        <TextWrapper>
          {/* <TitleText>AI summary:</TitleText> */}
          <SummaryText>
            <Markdown>{summary}</Markdown>
          </SummaryText>
        </TextWrapper>
      </ContentSection>
    </AiSummaryWrapper>
  )
})

AiSummary.displayName = 'AiSummary'

export default AiSummary
