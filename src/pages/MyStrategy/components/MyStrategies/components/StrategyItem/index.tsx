import dayjs from 'dayjs'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import Divider from 'components/Divider'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { ROUTER } from 'pages/router'
import { memo, useCallback, useMemo } from 'react'
import { useCurrentRouter } from 'store/application/hooks'
import { useTheme } from 'store/themecache/hooks'
import styled from 'styled-components'
import cardBg from 'assets/vaults/portfolio-card-bg.png'
import { StrategiesOverviewStrategy } from 'api/strategy'
import { useUserInfo } from 'store/login/hooks'
import Avatar from 'boring-avatars'
import StrategyData from 'pages/Vaults/components/StrategyTable/components/Strategies/components/StrategyData'
import { useTimezone } from 'store/timezonecache/hooks'
import VaultDetail from '../VaultDetail'
import { useVaultsData } from 'store/vaults/hooks'
import { Trans } from '@lingui/react/macro'
import BottomRight from '../BottomRight'
import { STRATEGY_STATUS } from 'store/createstrategy/createstrategy'

const StrategyItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.bgT20};
  background: ${({ theme }) => theme.black800};
  cursor: pointer;
  &:hover {
    .card-bg {
      opacity: 1;
    }
  }
`

const CardContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 2px;
  padding: 12px;
`

const CardBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${cardBg});
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0;
  transition: opacity ${ANI_DURATION}s;
  pointer-events: none;
  border-radius: 8px;
`

const ItemTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const TopLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  > span:first-child {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textDark98};
  }
  > span:last-child {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 300px;
    color: ${({ theme }) => theme.textDark54};
    img {
      width: 18px;
      height: 18px;
      border-radius: 50%;
    }
  }
`

const TopRight = styled.div`
  display: flex;
  gap: 8px;
  .strategy-data-item {
    width: 116px;
    &:last-child {
      width: 80px;
      span:first-child {
        text-align: right;
      }
      span:last-child {
        text-align: right;
      }
    }
  }
`

const ItemBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const BottomLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  .icon-vault-period {
    font-size: 14px;
    color: ${({ theme }) => theme.textL4};
  }
  span {
    font-size: 11px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
    color: ${({ theme }) => theme.textL2};
  }
`

const StatusWrapper = styled.div<{ $status: STRATEGY_STATUS }>`
  display: flex;
  align-items: center;
  margin-left: 20px;
  gap: 4px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme, $status }) => ($status === STRATEGY_STATUS.DEPLOYED ? theme.brand100 : theme.textL4)};
`

function Status({ status }: { status: STRATEGY_STATUS }) {
  const theme = useTheme()
  if (status === STRATEGY_STATUS.DEPLOYED) {
    return (
      <StatusWrapper $status={status}>
        <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14' fill='none'>
          <circle cx='7' cy='7' r='3' fill={theme.brand100} />
          <circle cx='7' cy='7' r='5' stroke='rgba(248, 70, 0, 0.08)' strokeWidth='4' />
        </svg>
        <Trans>Live</Trans>
      </StatusWrapper>
    )
  } else if (status === STRATEGY_STATUS.PAUSED) {
    return (
      <StatusWrapper $status={status}>
        <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14' fill='none'>
          <circle cx='7' cy='7' r='3' fill={theme.textL4} />
          <circle cx='7' cy='7' r='5' stroke={theme.bgT20} strokeWidth='4' />
        </svg>
        <Trans>Suspended</Trans>
      </StatusWrapper>
    )
  } else if (status === STRATEGY_STATUS.DELISTED || status === STRATEGY_STATUS.ARCHIVED) {
    return (
      <StatusWrapper $status={status}>
        <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14' fill='none'>
          <circle cx='7' cy='7' r='3' fill={theme.textL4} />
          <circle cx='7' cy='7' r='5' stroke={theme.bgT20} strokeWidth='4' />
        </svg>
        <Trans>Terminated</Trans>
      </StatusWrapper>
    )
  }
  return null
}

export default memo(function StrategyItem({ strategy }: { strategy: StrategiesOverviewStrategy }) {
  const theme = useTheme()
  const [timezone] = useTimezone()
  const { allVaults } = useVaultsData()
  const [{ userAvatar, userName }] = useUserInfo()
  const [, setCurrentRouter] = useCurrentRouter()
  const { strategy_id, strategy_name, created_time, status } = strategy
  const goCreateStrategyPage = useCallback(() => {
    setCurrentRouter(`${ROUTER.CREATE_STRATEGY}?strategyId=${strategy_id}`)
  }, [strategy_id, setCurrentRouter])
  const vaultInfo = useMemo(() => {
    return allVaults.find((vault) => vault.vault_id === strategy.vault_id)
    // return allVaults[3]
  }, [allVaults, strategy.vault_id])

  return (
    <StrategyItemWrapper onClick={goCreateStrategyPage}>
      <CardContent>
        <CardBg className='card-bg' />
        <ItemTop>
          <TopLeft>
            <span>{strategy_name}</span>
            <span>
              {userAvatar ? (
                <img className='avatar-img' src={userAvatar} alt='' />
              ) : (
                <Avatar name={userName || ''} size={18} />
              )}
              <span>{userName}</span>
            </span>
          </TopLeft>
          <TopRight>
            <StrategyData strategy={strategy} />
          </TopRight>
        </ItemTop>
        <Divider color={theme.bgT10} height={1} paddingVertical={12} />
        <ItemBottom>
          <BottomLeft>
            <IconBase className='icon-vault-period' />
            <span>{dayjs.tz(created_time, timezone).format('YYYY-MM-DD HH:mm:ss')}</span>
            <Status status={status} />
          </BottomLeft>
          <BottomRight strategy={strategy} />
        </ItemBottom>
        {vaultInfo && <VaultDetail vaultInfo={vaultInfo} />}
      </CardContent>
    </StrategyItemWrapper>
  )
})
