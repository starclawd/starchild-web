import { memo, useState, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import RankingSection from './components/RankingSection'
import PnLChart from './components/PnLChart'
import { vm } from 'pages/helper'

const LeaderboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: ${({ theme }) => theme.black800};
  border-radius: 6px;
  padding: 16px;
  margin: 60px 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(16)};
      gap: ${vm(20)};
    `}
`

const LeaderboardTitle = styled.h2`
  font-size: 20px;
  line-height: 28px;
  font-weight: 400;
  color: ${({ theme }) => theme.textL1};
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.2rem;
    `}
`

const ArrowButton = styled.button<{ $isExpanded: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textL1};
  transition:
    transform 0.2s ease-in-out,
    color 0.2s ease-in-out;
  transform: ${({ $isExpanded }) => ($isExpanded ? 'rotate(90deg)' : 'rotate(-90deg)')};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(4)};
    `}

  .icon-chat-expand {
    font-size: 24px;

    ${({ theme }) =>
      theme.isMobile &&
      css`
        font-size: ${vm(24)};
      `}
  }
`

const LeaderboardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(24)};
    `}
`

const Leaderboard = memo(() => {
  const [isExpanded, setIsExpanded] = useState(true)

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  return (
    <LeaderboardContainer>
      <LeaderboardTitle>
        <Trans>Leaderboard</Trans>
        <ArrowButton $isExpanded={isExpanded} onClick={toggleExpanded}>
          <IconBase className='icon-chat-expand' />
        </ArrowButton>
      </LeaderboardTitle>
      <LeaderboardContent>
        {/* 排行榜部分 */}
        <RankingSection />

        {/* PnL折线图部分 */}
        {isExpanded && <PnLChart />}
      </LeaderboardContent>
    </LeaderboardContainer>
  )
})

Leaderboard.displayName = 'Leaderboard'

export default Leaderboard
