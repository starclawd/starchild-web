import { memo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import Pending from 'components/Pending'
import { useLeaderboardData, LeaderboardVault } from 'store/vaults/hooks/useLeaderboardData'
import NoData from 'components/NoData'

const RankingSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const RankingList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    `
    gap: 8px;
  `}
`

const RankingCard = styled.div<{ $rank: number }>`
  width: calc((100% - 48px) / 5);
  border-radius: 4px;
  padding: 7px 12px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 16px;

  /* 根据排名设置背景颜色 */
  ${({ $rank, theme }) => {
    if ($rank === 1) {
      return `
        background: linear-gradient(270deg, rgba(241, 215, 121, 0.0225) -2.05%, rgba(216, 144, 0, 0.45) 100%);
      `
    } else if ($rank === 2) {
      return `
        background: linear-gradient(270deg, rgba(102, 102, 102, 0.0225) -2.05%, rgba(159, 159, 159, 0.45) 100%);
      `
    } else if ($rank === 3) {
      return `
        background: linear-gradient(270deg, rgba(145, 64, 3, 0.0225) -2.05%, rgba(150, 72, 16, 0.45) 100%);
      `
    } else {
      return `
        background: ${theme.black900};
      `
    }
  }}

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.1);
  }

  ${({ theme }) =>
    theme.isMobile &&
    `
    width: calc((100% - 8px) / 2);
    padding: 10px 12px;
    gap: 12px;
  `}
`

const RankBadge = styled.div<{ $rank: number }>`
  font-weight: 700;
  flex-shrink: 0;
  text-align: center;

  /* 根据排名设置字体大小、行高、斜体和颜色 */
  ${({ $rank, theme }) => {
    if ($rank <= 3) {
      const colors = {
        1: '#FF9500',
        2: theme.black100,
        3: '#CA8555',
      }
      return `
        font-size: 26px;
        line-height: 34px;
        font-style: italic;
        color: ${colors[$rank as 1 | 2 | 3]};
      `
    } else {
      return `
        font-size: 16px;
        line-height: 24px;
        font-style: normal;
        color: ${theme.black300};
      `
    }
  }}

  ${({ $rank, theme }) =>
    theme.isMobile &&
    ($rank <= 3
      ? `
      font-size: 22px;
      line-height: 28px;
    `
      : `
      font-size: 14px;
      line-height: 20px;
    `)}
`

const VaultContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`

const VaultName = styled.div`
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: #ffffff;
  text-align: left;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: 14px;
  `}
`

const PnLValue = styled.div`
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;
  color: #ffffff;
  text-align: left;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: 15px;
  `}
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: ${({ theme }) => theme.textL3};

  & > div:first-child {
    font-size: 48px;
    margin-bottom: 12px;
  }
`

interface RankingCardItemProps {
  vault: LeaderboardVault
  rank: number
}

const RankingCardItem = memo<RankingCardItemProps>(({ vault, rank }) => {
  return (
    <RankingCard $rank={rank}>
      <RankBadge $rank={rank}>{rank}</RankBadge>
      <VaultContent>
        <VaultName>{vault.name}</VaultName>
        <PnLValue>{vault.pnlFormatted}</PnLValue>
      </VaultContent>
    </RankingCard>
  )
})

RankingCardItem.displayName = 'RankingCardItem'

const RankingSection = memo(() => {
  const { topVaults, isLoading } = useLeaderboardData()

  if (isLoading) {
    return (
      <RankingSectionContainer>
        <LoadingContainer>
          <Pending isFetching />
        </LoadingContainer>
      </RankingSectionContainer>
    )
  }

  if (topVaults.length === 0) {
    return (
      <RankingSectionContainer>
        <EmptyState>
          <NoData />
          <div>
            <Trans>No performance data available</Trans>
          </div>
        </EmptyState>
      </RankingSectionContainer>
    )
  }

  return (
    <RankingSectionContainer>
      <RankingList>
        {topVaults.map((vault, index) => (
          <RankingCardItem key={vault.id} vault={vault} rank={index + 1} />
        ))}
      </RankingList>
    </RankingSectionContainer>
  )
})

RankingSection.displayName = 'RankingSection'

export default RankingSection
