import { ButtonBorder, ButtonCommon } from 'components/Button'
import Divider from 'components/Divider'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { ROUTER } from 'pages/router'
import { useCallback } from 'react'
import { useCurrentRouter } from 'store/application/hooks'
import { useTheme } from 'store/themecache/hooks'
import styled from 'styled-components'
import cardBg from 'assets/vaults/portfolio-card-bg.png'
import { StrategiesOverviewStrategy } from 'api/strategy'
import { useUserInfo } from 'store/login/hooks'
import Avatar from 'boring-avatars'
import StrategyData from 'pages/Vaults/components/StrategyList/components/Strategies/components/StrategyData'

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

const BottomRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const ButtonWithdraw = styled(ButtonBorder)`
  width: fit-content;
  padding: 0 12px;
  height: 24px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.textL3};
`

const ButtonDeposit = styled(ButtonCommon)`
  width: fit-content;
  padding: 0 12px;
  height: 24px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
`

export default function StrategyItem({ strategy }: { strategy: StrategiesOverviewStrategy }) {
  const theme = useTheme()
  const [{ userAvatar, userName }] = useUserInfo()
  const [, setCurrentRouter] = useCurrentRouter()
  const { strategy_id, strategy_name } = strategy
  const createTime = '--'
  const goCreateStrategyPage = useCallback(() => {
    setCurrentRouter(`${ROUTER.CREATE_STRATEGY}?strategyId=${strategy_id}`)
  }, [strategy_id, setCurrentRouter])

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
            <span>{createTime}</span>
          </BottomLeft>
          {/* <BottomRight>
            <ButtonWithdraw>
              <Trans>Withdraw</Trans>
            </ButtonWithdraw>
            <ButtonDeposit>
              <Trans>Deposit</Trans>
            </ButtonDeposit>
          </BottomRight> */}
        </ItemBottom>
      </CardContent>
    </StrategyItemWrapper>
  )
}
