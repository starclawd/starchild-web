import { memo } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import Pending from 'components/Pending'
import { useLeaderboardData, LeaderboardVault } from 'store/vaults/hooks/useLeaderboardData'
import { useGetStrategyIconName } from 'store/vaults/hooks/useVaultData'
import { IconBase } from 'components/Icons'
import NoData from 'components/NoData'
import { formatNumber } from 'utils/format'
import { toFix } from 'utils/calc'

const RankingSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const RankingList = styled.div<{ $itemCount: number }>`
  display: grid;
  gap: 8px;

  /* 根据卡片数量动态设置列数，最多5列 */
  grid-template-columns: repeat(${({ $itemCount }) => Math.min($itemCount, 5)}, 1fr);

  ${({ theme }) =>
    theme.isMobile &&
    `
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  `}
`

const RankingCard = styled.div<{ $rank: number }>`
  border-radius: 4px;
  padding: 7px 12px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 16px;
  overflow: hidden;
  min-width: 0;

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

  ${({ theme }) =>
    theme.isMobile &&
    `
    padding: 10px 12px;
    gap: 12px;
  `}
`

const RankBadge = styled.div<{ $rank: number }>`
  font-weight: 700;
  flex-shrink: 0;
  text-align: center;
  position: relative;
  z-index: 1;

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
  position: relative;
  z-index: 1;
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

const StrategyIconContainer = styled.div`
  position: absolute;
  bottom: -18px;
  right: -8px;
  z-index: 0;

  .icon-strategy1,
  .icon-strategy2,
  .icon-strategy3 {
    font-size: 64px;
    color: ${({ theme }) => theme.text10};
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      .icon-strategy1,
      .icon-strategy2,
      .icon-strategy3 {
        font-size: 0.4rem;
      }
    `}
`

const CreatorAvatarContainer = styled.div`
  position: absolute;
  bottom: -18px;
  right: -8px;
  z-index: 0;
  width: 64px;
  height: 64px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 40px;
      height: 40px;
    `}
`

const CreatorAvatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  opacity: 0.6;
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
  strategyIconMapping: Record<string, string>
}

const RankingCardItem = memo<RankingCardItemProps>(({ vault, rank, strategyIconMapping }) => {
  const iconClassName = strategyIconMapping[vault.strategyId]

  return (
    <RankingCard $rank={rank}>
      <RankBadge $rank={rank}>{rank}</RankBadge>
      <VaultContent>
        <VaultName>{vault.strategyName}</VaultName>
        <PnLValue>${formatNumber(toFix(vault.balance, 2))}</PnLValue>
      </VaultContent>

      {/* AI powered strategy: 显示创建者头像 */}
      {vault.creatorAvatar && (
        <CreatorAvatarContainer>
          <CreatorAvatar src={vault.creatorAvatar} alt='Creator Avatar' />
        </CreatorAvatarContainer>
      )}

      {/* AI generated strategy: 显示策略图标 */}
      {iconClassName && (
        <StrategyIconContainer>
          <IconBase className={iconClassName} />
        </StrategyIconContainer>
      )}
    </RankingCard>
  )
})

RankingCardItem.displayName = 'RankingCardItem'

const RankingSection = memo(() => {
  const { topVaults, isLoading } = useLeaderboardData()
  const strategyIconNameMapping = useGetStrategyIconName()

  if (isLoading) {
    return (
      <RankingSectionContainer>
        <LoadingContainer>
          <Pending isNotButtonLoading />
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
      <RankingList $itemCount={topVaults.length}>
        {topVaults.map((vault, index) => (
          <RankingCardItem
            key={vault.strategyId}
            vault={vault}
            rank={index + 1}
            strategyIconMapping={strategyIconNameMapping}
          />
        ))}
      </RankingList>
    </RankingSectionContainer>
  )
})

RankingSection.displayName = 'RankingSection'

export default RankingSection
