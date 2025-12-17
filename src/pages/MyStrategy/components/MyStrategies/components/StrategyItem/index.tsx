import dayjs from 'dayjs'
import { Trans } from '@lingui/react/macro'
import { VaultInfo } from 'api/vaults'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import Divider from 'components/Divider'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { ROUTER } from 'pages/router'
import { useCallback, useMemo } from 'react'
import { useCurrentRouter } from 'store/application/hooks'
import { useTheme } from 'store/themecache/hooks'
import styled from 'styled-components'
import { toFix } from 'utils/calc'
import { formatKMBNumber, formatPercent } from 'utils/format'
import cardBg from 'assets/vaults/portfolio-card-bg.png'
import { MyStrategyDataType } from 'store/mystrategy/mystrategy'
import { useTimezone } from 'store/timezonecache/hooks'

const VaultsItemWrapper = styled.div`
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
  span:first-child {
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
  span:last-child {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 300px;
    color: ${({ theme }) => theme.textDark54};
  }
`

const TopRight = styled.div<{ $isPositive: boolean }>`
  display: flex;
  gap: 8px;
`

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 116px;
  > span:first-child {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL4};
  }
  > span:last-child {
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.textL1};
  }
  &:last-child {
    width: 80px;
    span:first-child {
      text-align: right;
    }
    span:last-child {
      text-align: right;
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

interface VaultsItemProps {
  item: VaultInfo
  walletAddress: string
}

export default function StrategyItem({ strategy }: { strategy: MyStrategyDataType }) {
  const theme = useTheme()
  const [timezone] = useTimezone()
  const [, setCurrentRouter] = useCurrentRouter()
  const { id, name, description, created_at } = strategy
  const createTime = dayjs.tz(created_at, timezone).format('YYYY-MM-DD HH:mm:ss')
  const isPositive = false
  const dataList = useMemo(() => {
    const lifetime_apy = 0
    return [
      {
        key: 'Equity',
        text: <Trans>Equity</Trans>,
        value: '--',
      },
      {
        key: ' Total PnL',
        text: <Trans>Total PnL</Trans>,
        value: (
          <span style={{ color: isPositive ? theme.green100 : theme.red100 }}>
            {isPositive ? '+' : '-'}${formatKMBNumber(Math.abs(toFix(0, 2)))}
          </span>
        ),
      },
      {
        key: 'All-time APY',
        text: <Trans>All-time APY</Trans>,
        value: (
          <span style={{ color: lifetime_apy >= 0 ? theme.green100 : theme.red100 }}>
            {formatPercent({ value: lifetime_apy })}
          </span>
        ),
      },
    ]
  }, [theme, isPositive])

  const goCreateStrategyPage = useCallback(() => {
    setCurrentRouter(`${ROUTER.CREATE_STRATEGY}?strategyId=${id}`)
  }, [id, setCurrentRouter])

  return (
    <VaultsItemWrapper onClick={goCreateStrategyPage}>
      <CardContent>
        <CardBg className='card-bg' />
        <ItemTop>
          <TopLeft>
            <span>{name}</span>
            <span>{description}</span>
          </TopLeft>
          <TopRight $isPositive={isPositive}>
            {dataList.map((data) => {
              const { key, text, value } = data
              return (
                <ItemWrapper key={key}>
                  <span>{text}</span>
                  <span>{value}</span>
                </ItemWrapper>
              )
            })}
          </TopRight>
        </ItemTop>
        <Divider color={theme.bgT10} height={1} paddingVertical={12} />
        <ItemBottom>
          <BottomLeft>
            <IconBase className='icon-vault-period' />
            <span>{createTime}</span>
            <span style={{ marginLeft: '80px' }}>{id}</span>
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
    </VaultsItemWrapper>
  )
}
