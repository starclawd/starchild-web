import { Trans } from '@lingui/react/macro'
import { VaultInfo } from 'api/vaults'
import Divider from 'components/Divider'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useTheme } from 'store/themecache/hooks'
import { useCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import { formatKMBNumber, formatPercent } from 'utils/format'
import { toFix } from 'utils/calc'

const VaultDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  margin-top: 20px;
  border-radius: 8px;
  background: ${({ theme }) => theme.black900};
`

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  span:first-child {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL2};
  }
  span:last-child {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL3};
    cursor: pointer;
    transition: all ${ANI_DURATION}s;
    .icon-chat-back {
      font-size: 18px;
      transition: all ${ANI_DURATION}s;
      color: ${({ theme }) => theme.textL3};
      transform: rotate(180deg);
    }
    &:hover {
      color: ${({ theme }) => theme.textL1};
      .icon-chat-back {
        color: ${({ theme }) => theme.textL1};
      }
    }
  }
`

const InfoList = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  span:first-child {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL3};
  }
  span:last-child {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textDark98};
  }
  &:last-child {
    span {
      text-align: right;
    }
  }
`

export default memo(function VaultDetail({ vaultInfo }: { vaultInfo: VaultInfo }) {
  const [, setCurrentRouter] = useCurrentRouter()
  const theme = useTheme()
  const infoList = useMemo(() => {
    const tvl = vaultInfo.tvl
    const depositors = vaultInfo.lp_counts
    const pnl = vaultInfo.vault_lifetime_net_pnl
    const lifetimeApr = vaultInfo.lifetime_apy
    const isPositive = Number(pnl) > 0
    const isNegative = Number(pnl) < 0
    const isLifetimeAprPositive = Number(lifetimeApr) > 0
    const isLifetimeAprNegative = Number(lifetimeApr) < 0
    return [
      {
        key: 'Total TVL',
        text: <Trans>Total TVL</Trans>,
        value: tvl === null || tvl === undefined ? '--' : formatKMBNumber(tvl, 2, { showDollar: true }),
      },
      {
        key: 'Depositors',
        text: <Trans>Depositors</Trans>,
        value: depositors,
      },
      {
        key: 'PnL',
        text: <Trans>PnL</Trans>,
        value:
          pnl === null || pnl === undefined ? (
            '--'
          ) : (
            <span style={{ color: isPositive ? theme.green100 : isNegative ? theme.red100 : theme.textDark98 }}>
              {isPositive ? '+' : isNegative ? '-' : ''}${formatKMBNumber(toFix(Math.abs(pnl), 2))}
            </span>
          ),
      },
      {
        key: 'All-time APY',
        text: <Trans>All-time APY</Trans>,
        value:
          lifetimeApr === null || lifetimeApr === undefined ? (
            '--'
          ) : (
            <span
              style={{
                color: isLifetimeAprPositive ? theme.green100 : isLifetimeAprNegative ? theme.red100 : theme.textDark98,
              }}
            >
              {isLifetimeAprPositive ? '+' : isLifetimeAprNegative ? '-' : ''}$
              {formatPercent({ value: lifetimeApr, precision: 2 })}
            </span>
          ),
      },
      {
        key: 'Commission',
        text: <Trans>Commission</Trans>,
        value: '--',
      },
    ]
  }, [vaultInfo, theme])
  const goViewDetail = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      setCurrentRouter(`${ROUTER.VAULT_DETAIL}?vaultId=${vaultInfo.vault_id}`)
    },
    [setCurrentRouter, vaultInfo.vault_id],
  )
  return (
    <VaultDetailWrapper>
      <Title>
        <span>
          <Trans>Vault detail</Trans>
        </span>
        <span onClick={goViewDetail}>
          <Trans>View detail</Trans>
          <IconBase className='icon-chat-back' />
        </span>
      </Title>
      <Divider height={1} color={theme.bgT10} paddingVertical={0} />
      <InfoList>
        {infoList.map((item) => (
          <InfoItem key={item.key}>
            <span>{item.text}</span>
            <span>{item.value}</span>
          </InfoItem>
        ))}
      </InfoList>
    </VaultDetailWrapper>
  )
})
