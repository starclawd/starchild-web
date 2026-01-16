import { memo, useCallback, useState } from 'react'
import styled, { css } from 'styled-components'
import { useFollowStrategy, useUnfollowStrategy, useAllStrategiesOverview } from 'store/vaults/hooks'
import { toFix } from 'utils/calc'
import { formatKMBNumber } from 'utils/format'
import { useSetCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import { ANI_DURATION } from 'constants/index'
import Rank, { RANK_TYPE } from '../../../Leaderboard/components/Rank'
import Avatar from 'components/Avatar'
import { StrategiesOverviewDataType } from 'api/strategy'
import Divider from 'components/Divider'
import { useTheme } from 'store/themecache/hooks'
import Snapshot from '../Snapshort'
import { useIsLogin, useUserInfo } from 'store/login/hooks'
import { useAllFollowedStrategiesOverview } from 'store/mystrategy/hooks'
import { Trans } from '@lingui/react/macro'
import { ButtonCommon } from 'components/Button'
import Tooltip from 'components/Tooltip'
import Pending from 'components/Pending'

const StrategyTbody = styled.tbody`
  cursor: pointer;
  position: relative;

  tr td {
    transition: background-color ${ANI_DURATION}s;
  }

  &:hover tr td {
    background-color: ${({ theme }) => theme.black800};
    .follow-button {
      display: flex;
    }
    .vibe-wrapper {
      span:last-child {
        color: ${({ theme }) => theme.black0};
      }
    }
  }
`

const DataRow = styled.tr`
  height: 28px;

  td {
    padding-top: 10px;
    box-sizing: content-box;
  }
`

const TagsRow = styled.tr`
  height: 40px;

  td {
    padding-bottom: 10px;
    box-sizing: content-box;
  }
`

const TableCell = styled.td<{ $align?: 'left' | 'center' | 'right' }>`
  text-align: ${(props) => props.$align || 'left'};
  color: ${({ theme }) => theme.black100};
  padding: 0 12px;
  vertical-align: middle;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;

  &:first-child {
    padding-left: 0;
    border-top-left-radius: 8px;
  }
  &:last-child {
    padding-left: 0;
    padding-right: 0;
    border-top-right-radius: 8px;
  }
`

const TagsCell = styled.td`
  padding: 0 12px;
  vertical-align: top;

  &:first-child {
    border-bottom-left-radius: 8px;
  }
  &:last-child {
    border-bottom-right-radius: 8px;
  }
`

const PercentageText = styled.span<{ $isPositive?: boolean; $isNegative?: boolean }>`
  color: ${({ theme, $isPositive, $isNegative }) =>
    $isPositive ? theme.green100 : $isNegative ? theme.red100 : theme.black100};
`

const MaxDrawdownText = styled.span`
  color: ${({ theme }) => theme.black100};
`

const StrategyName = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.black0};
`

const LeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const LeaderName = styled.span`
  display: flex;
  align-items: center;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black0};
`

const CurrentUser = styled.span`
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.brand100};
`

const FollowText = styled.div<{ $isFollowed?: boolean }>`
  display: flex;
  align-items: center;
  width: fit-content;
  gap: 4px;
  transition: all ${ANI_DURATION}s;
  ${({ $isFollowed, theme }) =>
    $isFollowed
      ? css`
          background: ${theme.thinkingGradient};
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        `
      : css`
          color: ${theme.black100};
        `}
`

const FollowButton = styled(ButtonCommon)<{ $isFollowed?: boolean }>`
  display: none;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  min-width: 50px;
  width: fit-content;
  height: 20px;
  color: ${({ theme }) => theme.black1000};
  transition: all ${ANI_DURATION}s;
  ${({ $isFollowed, theme }) =>
    $isFollowed &&
    css`
      color: ${theme.black100};
      background-color: ${theme.black600};
    `}
  ${({ $disabled }) =>
    $disabled &&
    css`
      display: flex;
    `}
`

const FollowWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const BoostIcon = styled.span`
  font-size: 18px;
`

const TvfText = styled.span<{ $isFollowed?: boolean }>`
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  transition: all ${ANI_DURATION}s;
  ${({ $isFollowed, theme }) =>
    $isFollowed &&
    css`
      background: ${theme.thinkingGradient};
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    `}
`

const NormalRank = styled.span`
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black0};
`

const VibeWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  span {
    font-size: 13px;
    font-style: italic;
    font-weight: 400;
    line-height: 18px;
    transition: color ${ANI_DURATION}s;
    color: ${({ theme }) => theme.black200};
  }
`

interface StrategyItemProps {
  record: StrategiesOverviewDataType
  aprRank: number
}

const StrategyItem = memo(({ record, aprRank }: StrategyItemProps) => {
  const theme = useTheme()
  const isLogin = useIsLogin()
  const [{ userInfoId }] = useUserInfo()
  const [isLoading, setIsLoading] = useState(false)
  const followStrategy = useFollowStrategy()
  const unfollowStrategy = useUnfollowStrategy()
  const { allFollowedStrategies, refetch: refetchAllFollowedStrategies } = useAllFollowedStrategiesOverview()
  const { refetch: refetchAllStrategies } = useAllStrategiesOverview()
  const setCurrentRouter = useSetCurrentRouter()

  // 计算派生数据
  const vibe = record.vibe
  const vibeTitle = record.vibe_title || ''
  const tvf = record.tvf || 0
  const followers = record.followers || 0
  const userName = record.user_info?.user_name || ''
  const columnCount = 9
  // 根据 all_time_apr 倒序排名，前三名显示特殊样式
  const showRank = aprRank >= 1 && aprRank <= 3
  const isCurrentUser = record.user_info?.user_info_id === Number(userInfoId)
  const isFollowed = allFollowedStrategies.some((s) => s.strategy_id === record.strategy_id)

  // 行点击跳转到详情页
  const handleRowClick = useCallback(() => {
    setCurrentRouter(`${ROUTER.VAULT_DETAIL}?strategyId=${record.strategy_id}`)
  }, [setCurrentRouter, record.strategy_id])

  const handleFollowClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()
      if (isLoading || !record.strategy_id || !isLogin) return
      try {
        setIsLoading(true)
        if (isFollowed) {
          await unfollowStrategy(record.strategy_id)
        } else {
          await followStrategy(record.strategy_id)
        }
        await refetchAllStrategies()
        await refetchAllFollowedStrategies()
      } catch (err) {
        console.error('Follow strategy failed:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [
      isLoading,
      isLogin,
      isFollowed,
      record.strategy_id,
      unfollowStrategy,
      followStrategy,
      refetchAllStrategies,
      refetchAllFollowedStrategies,
    ],
  )

  // 格式化百分比显示
  const formatPercent = (value: number) => {
    const formatted = toFix(value * 100, 1)
    return `${formatted}%`
  }

  return (
    <StrategyTbody onClick={handleRowClick}>
      <DataRow>
        <TableCell>
          {showRank ? <Rank type={RANK_TYPE.TABLE} rank={aprRank} /> : <NormalRank>{aprRank}</NormalRank>}
        </TableCell>
        <TableCell>
          <StrategyName>{record.strategy_name}</StrategyName>
        </TableCell>
        <TableCell>
          <LeaderWrapper>
            <Avatar avatar={record.user_info?.user_avatar} name={userName} size={24} />
            <LeaderName>
              {userName}&nbsp;
              <CurrentUser>{isCurrentUser ? `(you)` : ''}</CurrentUser>
            </LeaderName>
          </LeaderWrapper>
        </TableCell>
        <TableCell>
          <PercentageText $isPositive={record.all_time_apr > 0} $isNegative={record.all_time_apr < 0}>
            {formatPercent(record.all_time_apr)}
          </PercentageText>
        </TableCell>
        <TableCell>{Math.floor(record.age_days)}</TableCell>
        <TableCell>
          <MaxDrawdownText>{formatPercent(record.max_drawdown)}</MaxDrawdownText>
        </TableCell>
        <TableCell>
          <TvfText $isFollowed={isFollowed}>{tvf ? formatKMBNumber(tvf, 2, { showDollar: true }) : '0'}</TvfText>
        </TableCell>
        <TableCell>
          <FollowWrapper>
            <FollowText $isFollowed={isFollowed}>
              {isFollowed && (
                <Tooltip content={<Trans>My followed</Trans>} placement='top'>
                  <BoostIcon className='icon-boost' />
                </Tooltip>
              )}
              <span>{followers ? followers : '0'}</span>
            </FollowText>
            <FollowButton
              onClick={handleFollowClick}
              $disabled={isLoading}
              $isFollowed={isFollowed}
              className='follow-button'
            >
              {isLoading ? <Pending /> : <>{isFollowed ? <Trans>Followed</Trans> : <Trans>Follow</Trans>}</>}
            </FollowButton>
          </FollowWrapper>
        </TableCell>
        <TableCell $align='right'>
          <Snapshot data={record.s24h} />
        </TableCell>
      </DataRow>
      <TagsRow>
        <TagsCell />
        <TagsCell colSpan={columnCount - 1}>
          <VibeWrapper className='vibe-wrapper'>
            <span>"{vibe || '--'}"</span>
          </VibeWrapper>
        </TagsCell>
      </TagsRow>
    </StrategyTbody>
  )
})

StrategyItem.displayName = 'StrategyItem'

export default StrategyItem
