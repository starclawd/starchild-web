import { memo, useCallback, useState, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { useFollowStrategy, useUnfollowStrategy, useAllStrategiesOverview } from 'store/vaults/hooks'
import { formatKMBNumber, formatPercent, shouldShowApr } from 'utils/format'
import { useSetCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import { ANI_DURATION } from 'constants/index'
import Rank, { RANK_TYPE } from '../../../Leaderboard/components/Rank'
import Avatar from 'components/Avatar'
import { StrategiesOverviewDataType } from 'api/strategy'
import { useTheme } from 'store/themecache/hooks'
import Snapshot from '../Snapshort'
import { useIsLogin, useUserInfo } from 'store/login/hooks'
import { useAllFollowedStrategiesOverview, useMyStrategies } from 'store/mystrategy/hooks'
import { Trans } from '@lingui/react/macro'
import { ButtonCommon, ButtonBorder } from 'components/Button'
import Tooltip from 'components/Tooltip'
import Pending from 'components/Pending'
import { STRATEGY_STATUS } from 'store/createstrategy/createstrategy.d'
import { useCurrentStrategyId, useRestartStrategy } from 'store/mystrategy/hooks/useMyStrategies'
import {
  useDeleteStrategyModalToggle,
  useDelistStrategyModalToggle,
  useDeployModalToggle,
  usePauseStrategyModalToggle,
} from 'store/application/hooks'
import { useAppKitAccount } from '@reown/appkit/react'
import { isPro } from 'utils/url'

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
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme, $isPositive, $isNegative }) =>
    $isPositive ? theme.green100 : $isNegative ? theme.red100 : theme.black100};
  span {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
  }
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

const ActionButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;
`

const ButtonAction = styled(ButtonBorder)`
  width: fit-content;
  padding: 0 12px;
  height: 24px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  border: 1px solid ${({ theme }) => theme.black600};
`

const ButtonPrimary = styled(ButtonCommon)`
  width: fit-content;
  padding: 0 12px;
  height: 24px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.black1000};
`

const LaunchButton = styled(ButtonCommon)`
  width: 52px;
  height: 24px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
`

function ActionButtons({ strategy }: { strategy: StrategiesOverviewDataType }) {
  const { status, strategy_id } = strategy
  const { address } = useAppKitAccount()
  const [isLoading, setIsLoading] = useState(false)
  const { refetch: refetchMyStrategies } = useMyStrategies()
  const [, setCurrentStrategyId] = useCurrentStrategyId()
  const triggerRestartStrategy = useRestartStrategy()
  const toggleDelistStrategyModal = useDelistStrategyModalToggle()
  const toggleDeleteStrategyModal = useDeleteStrategyModalToggle()
  const togglePauseStrategyModal = usePauseStrategyModalToggle()
  const toggleDeployModal = useDeployModalToggle()
  const setCurrentRouter = useSetCurrentRouter()

  const isReleased = useMemo(() => {
    return status === STRATEGY_STATUS.DEPLOYED || status === STRATEGY_STATUS.PAUSED
  }, [status])
  const isUnreleased = useMemo(() => {
    return (
      status === STRATEGY_STATUS.DRAFT ||
      status === STRATEGY_STATUS.DRAFT_READY ||
      status === STRATEGY_STATUS.DEPLOYING ||
      status === STRATEGY_STATUS.PAPER_TRADING
    )
  }, [status])
  const isDraftReady = useMemo(() => {
    return status === STRATEGY_STATUS.PAPER_TRADING
  }, [status])
  const isDelisted = useMemo(() => {
    return status === STRATEGY_STATUS.DELISTED || status === STRATEGY_STATUS.ARCHIVED
  }, [status])

  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setCurrentRouter(`${ROUTER.CREATE_STRATEGY}?strategyId=${strategy_id}`)
    },
    [strategy_id, setCurrentRouter],
  )

  const handleDelist = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setCurrentStrategyId(strategy_id)
      toggleDelistStrategyModal()
    },
    [toggleDelistStrategyModal, setCurrentStrategyId, strategy_id],
  )

  const handlePause = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setCurrentStrategyId(strategy_id)
      togglePauseStrategyModal()
    },
    [togglePauseStrategyModal, setCurrentStrategyId, strategy_id],
  )

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setCurrentStrategyId(strategy_id)
      toggleDeleteStrategyModal()
    },
    [toggleDeleteStrategyModal, setCurrentStrategyId, strategy_id],
  )

  const handleDeploy = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      toggleDeployModal(strategy_id)
    },
    [toggleDeployModal, strategy_id],
  )

  const handleRestart = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()
      if (isLoading) return
      try {
        if (address && strategy_id) {
          setIsLoading(true)
          const data = await triggerRestartStrategy({ strategyId: strategy_id, walletId: address })
          if ((data as any)?.data?.status === 'success') {
            await refetchMyStrategies()
          }
          setIsLoading(false)
          return data
        }
      } catch (error) {
        setIsLoading(false)
        return error
      }
    },
    [strategy_id, address, refetchMyStrategies, triggerRestartStrategy, isLoading],
  )

  if (isReleased) {
    return (
      <ActionButtonsWrapper>
        <ButtonAction onClick={handleEdit}>
          <Trans>Edit</Trans>
        </ButtonAction>
        <ButtonAction onClick={handleDelist}>
          <Trans>Delist</Trans>
        </ButtonAction>
        {status === STRATEGY_STATUS.DEPLOYED ? (
          <ButtonAction onClick={handlePause}>
            <Trans>Pause</Trans>
          </ButtonAction>
        ) : (
          <ButtonPrimary onClick={handleRestart}>{isLoading ? <Pending /> : <Trans>Restart</Trans>}</ButtonPrimary>
        )}
      </ActionButtonsWrapper>
    )
  } else if (isUnreleased) {
    return (
      <ActionButtonsWrapper>
        <ButtonAction onClick={handleEdit}>
          <Trans>Edit</Trans>
        </ButtonAction>
        <ButtonAction onClick={handleDelete}>
          <Trans>Delete</Trans>
        </ButtonAction>
        {/* {isDraftReady && (
          <LaunchButton onClick={handleDeploy}>
            <Trans>Launch</Trans>
          </LaunchButton>
        )} */}
      </ActionButtonsWrapper>
    )
  } else if (isDelisted) {
    return (
      <ActionButtonsWrapper>
        <ButtonAction onClick={handleEdit}>
          <Trans>Edit</Trans>
        </ButtonAction>
      </ActionButtonsWrapper>
    )
  }
  return null
}

interface StrategyItemProps {
  record: StrategiesOverviewDataType
  roeRank: number
  showActions?: boolean
}

const StrategyItem = memo(({ record, roeRank, showActions }: StrategyItemProps) => {
  const theme = useTheme()
  const isLogin = useIsLogin()
  const [{ userInfoId }] = useUserInfo()
  const [isLoading, setIsLoading] = useState(false)
  const followStrategy = useFollowStrategy()
  const unfollowStrategy = useUnfollowStrategy()
  const { allFollowedStrategies, refetch: refetchAllFollowedStrategies } = useAllFollowedStrategiesOverview()
  const { refetch: refetchAllStrategies } = useAllStrategiesOverview()
  const { refetch: refetchMyStrategies } = useMyStrategies()
  const setCurrentRouter = useSetCurrentRouter()

  // 计算派生数据
  const vibe = record.vibe
  const vibeTitle = record.vibe_title || ''
  const tvf = record.tvf || 0
  const followers = record.followers || 0
  const userName = record.user_info?.user_name || ''
  const columnCount = 9
  // 根据 roe 倒序排名，前三名显示特殊样式
  const showRank = roeRank >= 1 && roeRank <= 3
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
        await refetchMyStrategies()
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
      refetchMyStrategies,
      refetchAllStrategies,
      refetchAllFollowedStrategies,
    ],
  )

  return (
    <StrategyTbody onClick={handleRowClick}>
      <DataRow>
        <TableCell>
          {roeRank > 0 ? (
            showRank ? (
              <Rank type={RANK_TYPE.TABLE} rank={roeRank} />
            ) : (
              <NormalRank>{roeRank}</NormalRank>
            )
          ) : (
            <NormalRank>--</NormalRank>
          )}
        </TableCell>
        <TableCell>
          <StrategyName>{record.strategy_name}</StrategyName>
        </TableCell>
        <TableCell>
          <LeaderWrapper>
            <Avatar avatar={record.user_info?.user_avatar} name={userName} size={24} />
            <LeaderName>
              {userName}&nbsp;
              <CurrentUser>{isCurrentUser && !showActions ? `(you)` : ''}</CurrentUser>
            </LeaderName>
          </LeaderWrapper>
        </TableCell>
        <TableCell>
          <PercentageText
            $isPositive={record.roe != null && record.roe > 0}
            $isNegative={record.roe != null && record.roe < 0}
          >
            {record.roe != null ? formatPercent({ value: record.roe }) : '--'}
            {shouldShowApr(record) && (
              <span
                style={{ color: theme.green300 }}
              >{` (APR: ${formatPercent({ value: record.all_time_apr })})`}</span>
            )}
          </PercentageText>
        </TableCell>
        <TableCell>{Math.floor(record.age_days)}</TableCell>
        <TableCell>
          <MaxDrawdownText>{formatPercent({ value: record.max_drawdown })}</MaxDrawdownText>
        </TableCell>
        <TableCell>
          <TvfText $isFollowed={isFollowed}>{tvf ? formatKMBNumber(tvf, 2, { showDollar: true }) : '0'}</TvfText>
        </TableCell>
        <TableCell>
          <FollowWrapper>
            <FollowText $isFollowed={isFollowed}>
              {isFollowed && <BoostIcon className='icon-boost' />}
              <span>{followers ? followers : '0'}</span>
            </FollowText>
            {isLogin && (
              <FollowButton
                onClick={handleFollowClick}
                $disabled={isLoading}
                $isFollowed={isFollowed}
                className='follow-button'
              >
                {isLoading ? <Pending /> : <>{isFollowed ? <Trans>Followed</Trans> : <Trans>Follow</Trans>}</>}
              </FollowButton>
            )}
          </FollowWrapper>
        </TableCell>
        <TableCell $align='right'>
          {showActions ? <ActionButtons strategy={record} /> : <Snapshot data={record.s24h} />}
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
