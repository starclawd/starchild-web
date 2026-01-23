import { Trans } from '@lingui/react/macro'
import { ANI_DURATION } from 'constants/index'
import { ROUTER } from 'pages/router'
import { memo, useCallback, useMemo, useState, useRef } from 'react'
import { useSetCurrentRouter } from 'store/application/hooks'
import { useAllStrategiesOverview } from 'store/vaults/hooks'
import styled, { css } from 'styled-components'
import Pending from 'components/Pending'
import { isInvalidValue } from 'utils/calc'
import { formatPercent } from 'utils/format'
import Rank, { RANK_TYPE } from 'pages/Vaults/components/Leaderboard/components/Rank'
import { StrategiesOverviewDataType } from 'api/strategy'
import { useTheme } from 'store/themecache/hooks'

const LeaderboardWrapper = styled.div<{ $gradientAngle: number; $isHovering: boolean }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc((100% - 12px) / 2);
  height: 100%;
  padding: 2px;
  border-radius: 8px;
  background: ${({ theme }) => theme.black900};
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);

  &::before {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    content: '';
    z-index: 1;
    border-radius: 8px;
    opacity: ${({ $isHovering }) => ($isHovering ? 1 : 0)};
    transition: opacity ${ANI_DURATION}s;
    background-image: conic-gradient(
      from ${({ $gradientAngle }) => $gradientAngle}deg,
      rgba(18, 19, 21, 0),
      rgba(248, 70, 0, 1) 30deg,
      rgba(18, 19, 21, 0) 60deg,
      rgba(18, 19, 21, 0) 360deg
    );
  }
`

const InnerContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 18px;
  border-radius: 8px;
  background: ${({ theme }) => theme.black900};
`

const Title = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  color: ${({ theme }) => theme.black0};
`

const LeaderboardList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  flex-grow: 1;
`

const PendingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

const LeaderboardItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 34px;
  cursor: pointer;
  &:hover {
    .strategy-name {
      color: ${({ theme }) => theme.black0};
    }
  }
`

const LeftContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const RightContent = styled.div<{ $isPositive: boolean; $invalidVaule: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.black100};
  ${({ $isPositive, theme }) =>
    $isPositive &&
    css`
      color: ${$isPositive ? theme.green100 : theme.red100};
    `}
  ${({ $invalidVaule, theme }) =>
    $invalidVaule &&
    css`
      color: ${theme.black300};
    `}
`

const StrategyName = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.black0};
  span:last-child {
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    color: ${({ theme }) => theme.black300};
  }
`

const Footer = styled.div`
  width: 100%;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.black200};
  cursor: pointer;
  text-align: right;
  transition: all ${ANI_DURATION}s;
  &:hover {
    color: ${({ theme }) => theme.black0};
  }
`

export default memo(function Leaderboard() {
  const theme = useTheme()
  const setCurrentRouter = useSetCurrentRouter()
  const { allStrategies, isLoading } = useAllStrategiesOverview()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [gradientAngle, setGradientAngle] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const sortedStrategies = useMemo(() => {
    return allStrategies.slice(0, 3)
  }, [allStrategies])

  const goVibePage = useCallback(() => {
    setCurrentRouter(ROUTER.VAULTS)
  }, [setCurrentRouter])

  const goVaultDetailPage = useCallback(
    (strategyId: string) => {
      return () => {
        setCurrentRouter(`${ROUTER.VAULT_DETAIL}?strategyId=${strategyId}`)
      }
    },
    [setCurrentRouter],
  )

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) return

    const rect = wrapperRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // 计算鼠标相对于中心的角度
    // atan2 返回的是从 x 轴正方向逆时针的弧度
    // CSS conic-gradient 从顶部顺时针，所以需要转换
    const radians = Math.atan2(mouseY - centerY, mouseX - centerX)
    // 转换为度数，并调整为从顶部开始（加90度）
    let degrees = (radians * 180) / Math.PI + 90
    // 确保角度在 0-360 范围内
    if (degrees < 0) degrees += 360

    setGradientAngle(degrees)
  }, [])

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
  }, [])

  return (
    <LeaderboardWrapper
      ref={wrapperRef}
      $gradientAngle={gradientAngle}
      $isHovering={isHovering}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <InnerContent>
        <Title>
          <Trans>Top Performing Strategies</Trans>
        </Title>
        <LeaderboardList>
          {isLoading ? (
            <PendingWrapper>
              <Pending />
            </PendingWrapper>
          ) : (
            sortedStrategies.map((strategy: StrategiesOverviewDataType, index: number) => (
              <LeaderboardItemWrapper onClick={goVaultDetailPage(strategy.strategy_id)} key={strategy.strategy_id}>
                <LeftContent>
                  <Rank type={RANK_TYPE.CHAT} rank={index + 1} />
                  <StrategyName className='strategy-name'>
                    <span>{strategy.strategy_name}</span>
                    <span>{strategy.user_info?.user_name}</span>
                  </StrategyName>
                </LeftContent>
                <RightContent $isPositive={Number(strategy.roe) > 0} $invalidVaule={isInvalidValue(strategy.roe)}>
                  {!isInvalidValue(strategy.roe) ? formatPercent({ value: strategy.roe }) : '--'}
                </RightContent>
              </LeaderboardItemWrapper>
            ))
          )}
        </LeaderboardList>
      </InnerContent>
    </LeaderboardWrapper>
  )
})
