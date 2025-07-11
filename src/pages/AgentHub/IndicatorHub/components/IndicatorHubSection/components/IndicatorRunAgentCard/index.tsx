import styled, { css } from 'styled-components'
import { memo } from 'react'
import { vm } from 'pages/helper'
import { ButtonCommon } from 'components/Button'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'

const MainCardWrapper = styled.div`
  background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%);
  border-radius: 20px;
  padding: 32px;
  color: white;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: start;
  grid-column: span 2; /* 占据2列 */
  height: 388px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    z-index: 1;
  }

  > * {
    position: relative;
    z-index: 2;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin: 0 ${vm(16)};
      padding: ${vm(24)};
      border-radius: ${vm(16)};
    `}
`

const MainCardTitle = styled.h3`
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 16px 0;
  line-height: 1.2;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(24)};
      margin-bottom: ${vm(12)};
    `}
`

const MainCardDescription = styled.p`
  font-size: 16px;
  margin: 0 0 24px 0;
  opacity: 0.9;
  line-height: 1.5;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(14)};
      margin-bottom: ${vm(20)};
    `}
`

const MainCardIndicators = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 14px;
  width: fit-content;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(12)};
      padding: ${vm(6)} ${vm(12)};
      gap: ${vm(6)};
      margin-bottom: ${vm(20)};
    `}
`

const MainCardButton = styled(ButtonCommon)`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
  width: fit-content;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-1px);
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(10)} ${vm(20)};
      border-radius: ${vm(10)};
      font-size: ${vm(14)};
    `}
`

interface IndicatorRunAgentCardProps {
  title?: string
  description?: string
  buttonText?: string
  onRunAgent?: () => void
}

export default memo(function IndicatorRunAgentCard({
  title = 'Test Any Idea on Historical Market Data',
  description = 'Buy BTC on RSI 4H oversold signals, sell on overbought signals',
  buttonText = 'Run Agent',
  onRunAgent,
}: IndicatorRunAgentCardProps) {
  const handleRunAgent = () => {
    console.log('Run Agent clicked')
    onRunAgent?.()
  }

  return (
    <MainCardWrapper>
      <MainCardTitle>
        <Trans>{title}</Trans>
      </MainCardTitle>
      <MainCardDescription>
        <Trans>{description}</Trans>
      </MainCardDescription>
      <MainCardIndicators>
        <IconBase className='icon-plus' />
        <Trans>Indicators</Trans>
      </MainCardIndicators>
      <MainCardButton onClick={handleRunAgent}>
        <Trans>{buttonText}</Trans> →
      </MainCardButton>
    </MainCardWrapper>
  )
})
