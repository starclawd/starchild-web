import styled from 'styled-components'
import { memo } from 'react'
import { vm } from 'pages/helper'
import { ButtonCommon } from 'components/Button'
import { ANI_DURATION } from 'constants/index'

const RunAgentCardWrapper = styled.div`
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border-radius: 20px;
  padding: 32px;
  color: white;
  position: relative;
  overflow: hidden;
  grid-row: span 2; /* RunAgent占据2行 */
  display: flex;
  flex-direction: column;
  justify-content: center;

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
    `
    margin: 0 ${vm(16)};
    padding: ${vm(24)};
    border-radius: ${vm(16)};
    grid-row: span 1;
  `}
`

const RunAgentTitle = styled.h3`
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 16px 0;
  line-height: 1.2;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: 0.24rem;
    margin-bottom: ${vm(12)};
  `}
`

const RunAgentDescription = styled.p`
  font-size: 16px;
  margin: 0 0 24px 0;
  opacity: 0.9;
  line-height: 1.5;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: 0.14rem;
    margin-bottom: ${vm(20)};
  `}
`

const RunAgentButton = styled(ButtonCommon)`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  transition: all ${ANI_DURATION}s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-1px);
  }

  ${({ theme }) =>
    theme.isMobile &&
    `
    padding: ${vm(10)} ${vm(20)};
    border-radius: ${vm(10)};
    font-size: 0.14rem;
  `}
`

interface RunAgentCardProps {
  title?: string
  description?: string
  buttonText?: string
  onRunAgent?: () => void
}

export default memo(function RunAgentCard({
  title = 'See how your AI Agent would respond',
  description = 'Send alerts for any tweets that could impact the price of $HYPE.',
  buttonText = 'Run Agent →',
  onRunAgent,
}: RunAgentCardProps) {
  const handleRunAgent = () => {
    console.log('Run Agent clicked')
    onRunAgent?.()
  }

  return (
    <RunAgentCardWrapper>
      <RunAgentTitle>{title}</RunAgentTitle>
      <RunAgentDescription>{description}</RunAgentDescription>
      <RunAgentButton onClick={handleRunAgent}>{buttonText}</RunAgentButton>
    </RunAgentCardWrapper>
  )
})
