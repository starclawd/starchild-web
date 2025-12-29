import { Trans } from '@lingui/react/macro'
import { VaultInfo } from 'api/vaults'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import Divider from 'components/Divider'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { CHAIN_ID_TO_CHAIN, CHAIN_INFO } from 'constants/chainInfo'
import { ROUTER } from 'pages/router'
import { useCallback, useMemo } from 'react'
import { useAppKitNetwork } from '@reown/appkit/react'
import { useCurrentRouter, useDepositAndWithdrawModalToggle } from 'store/application/hooks'
import { useTheme } from 'store/themecache/hooks'
import { useAllStrategiesOverview, useCurrentDepositAndWithdrawVault } from 'store/vaults/hooks'
import { useDepositAndWithdrawTabIndex } from 'store/vaultsdetail/hooks/useDepositAndWithdraw'
import styled from 'styled-components'
import { toFix } from 'utils/calc'
import { formatDuration, formatKMBNumber, formatNumber, formatPercent } from 'utils/format'
import cardBg from 'assets/vaults/portfolio-card-bg.png'
import { STRATEGY_STATUS } from 'store/createstrategy/createstrategy'

const VaultsItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  height: 135px;
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
    color: ${({ theme }) => theme.textDark54};
  }
`

const TopRight = styled.div`
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

export default function VaultsItem({ item, walletAddress }: VaultsItemProps) {
  const theme = useTheme()
  const { chainId, switchNetwork } = useAppKitNetwork()
  const [allStrategies] = useAllStrategiesOverview()
  const strategyDetail = useMemo(() => {
    return allStrategies.find((strategy) => strategy.vaultId === item.vault_id)?.raw
  }, [allStrategies, item.vault_id])
  const [, setCurrentRouter] = useCurrentRouter()
  // const { vaultLpInfoList } = useVaultLpInfoList({ walletAddress })
  const [, setDepositAndWithdrawTabIndex] = useDepositAndWithdrawTabIndex()
  const [, setCurrentDepositAndWithdrawVault] = useCurrentDepositAndWithdrawVault()
  const toggleDepositAndWithdrawModal = useDepositAndWithdrawModalToggle()

  const {
    vault_id,
    vault_name,
    sp_name,
    vault_start_time,
    tvl,
    vault_lifetime_net_pnl,
    lifetime_apy,
    supported_chains,
  } = item
  const depositDisabled = useMemo(() => {
    return (
      strategyDetail?.status === STRATEGY_STATUS.ARCHIVED ||
      strategyDetail?.status === STRATEGY_STATUS.DELISTED ||
      strategyDetail?.status === STRATEGY_STATUS.PAUSED
    )
  }, [strategyDetail])

  const handleViewVault = useCallback(() => {
    setCurrentRouter(`${ROUTER.VAULT_DETAIL}?vaultId=${vault_id}`)
  }, [setCurrentRouter, vault_id])

  const handleDeposit = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      if (depositDisabled) return
      setDepositAndWithdrawTabIndex(0)
      setCurrentDepositAndWithdrawVault(item)
      toggleDepositAndWithdrawModal()
    },
    [
      setCurrentDepositAndWithdrawVault,
      setDepositAndWithdrawTabIndex,
      toggleDepositAndWithdrawModal,
      item,
      depositDisabled,
    ],
  )

  const handleWithdraw = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      setDepositAndWithdrawTabIndex(1)
      setCurrentDepositAndWithdrawVault(item)
      toggleDepositAndWithdrawModal()
    },
    [setCurrentDepositAndWithdrawVault, setDepositAndWithdrawTabIndex, toggleDepositAndWithdrawModal, item],
  )

  // 检查当前 chainId 是否在 supportedChains 中
  const isChainSupported = useMemo(() => {
    if (!chainId || !supported_chains || supported_chains.length === 0) return true
    return supported_chains.some((chain) => String(chain.chain_id) === String(chainId))
  }, [chainId, supported_chains])

  // 切换到 supportedChains 中的第一个 chainId
  const handleSwitchNetwork = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      if (!supported_chains || supported_chains.length === 0) return
      const targetChainId = Number(supported_chains[0].chain_id)
      const chainKey = CHAIN_ID_TO_CHAIN[targetChainId]
      if (chainKey && CHAIN_INFO[chainKey]) {
        switchNetwork(CHAIN_INFO[chainKey].appKitNetwork)
      }
    },
    [supported_chains, switchNetwork],
  )

  const gapTime = Date.now() - vault_start_time

  const dataList = useMemo(() => {
    const isPositive = Number(vault_lifetime_net_pnl) > 0
    const isNegative = Number(vault_lifetime_net_pnl) < 0
    const isAllTimeAprPositive = Number(lifetime_apy) > 0
    const isAllTimeAprNegative = Number(lifetime_apy) < 0
    return [
      {
        key: 'TVL',
        text: <Trans>TVL</Trans>,
        value: formatKMBNumber(toFix(tvl, 2), 2, { showDollar: true }),
      },
      {
        key: ' Total PnL',
        text: <Trans>Total PnL</Trans>,
        value: (
          <span style={{ color: isPositive ? theme.green100 : isNegative ? theme.red100 : theme.textL1 }}>
            {isPositive ? '+' : isNegative ? '-' : ''}${formatKMBNumber(toFix(Math.abs(vault_lifetime_net_pnl), 2))}
          </span>
        ),
      },
      {
        key: 'All-time APY',
        text: <Trans>All-time APY</Trans>,
        value: (
          <span
            style={{
              color: isAllTimeAprPositive ? theme.green100 : isAllTimeAprNegative ? theme.red100 : theme.textL1,
            }}
          >
            {formatPercent({ value: lifetime_apy })}
          </span>
        ),
      },
    ]
  }, [vault_lifetime_net_pnl, lifetime_apy, tvl, theme])

  return (
    <VaultsItemWrapper onClick={handleViewVault}>
      <CardContent>
        <CardBg className='card-bg' />
        <ItemTop>
          <TopLeft>
            <span>{vault_name}</span>
            <span>{sp_name}</span>
          </TopLeft>
          <TopRight>
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
            <span>{formatDuration(gapTime)}</span>
          </BottomLeft>
          <BottomRight>
            {isChainSupported ? (
              <>
                <ButtonWithdraw onClick={handleWithdraw}>
                  <Trans>Withdraw</Trans>
                </ButtonWithdraw>
                <ButtonDeposit $disabled={depositDisabled} onClick={handleDeposit}>
                  <Trans>Deposit</Trans>
                </ButtonDeposit>
              </>
            ) : (
              <ButtonDeposit onClick={handleSwitchNetwork}>
                <Trans>Switch Network</Trans>
              </ButtonDeposit>
            )}
          </BottomRight>
        </ItemBottom>
      </CardContent>
    </VaultsItemWrapper>
  )
}
