import { memo, useCallback, useMemo } from 'react'
import styled, { css, useTheme } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { useCurrentRouter, useDepositAndWithdrawModalToggle } from 'store/application/hooks'
import { useCurrentDepositAndWithdrawVault } from 'store/vaults/hooks'
import {
  useVaultInfo,
  useCurrentVaultId,
  useCurrentStrategyId,
  useActiveTab,
  useStrategyInfo,
} from 'store/vaultsdetail/hooks'
import { usePaperTradingPublic } from 'store/vaultsdetail/hooks/usePaperTradingPublic'
import { useStrategyPerformance } from 'store/vaultsdetail/hooks/useStrategyPerformance'
import { useVaultLpInfo } from 'store/myvault/hooks/useVaultLpInfo'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { mul, toFix } from 'utils/calc'
import { formatNumber } from 'utils/format'
import { formatAddress } from 'utils'
import { ANI_DURATION } from 'constants/index'
import useCopyContent from 'hooks/useCopyContent'
import { useDepositAndWithdrawTabIndex } from 'store/vaultsdetail/hooks/useDepositAndWithdraw'
import Markdown from 'components/Markdown'
import MoveTabList from 'components/MoveTabList'
import { ROUTER } from 'pages/router'
import { CHAIN_ID_TO_CHAIN, CHAIN_INFO } from 'constants/chainInfo'
import { STRATEGY_STATUS } from 'store/createstrategy/createstrategy'
import StrategyStatus from './components/StrategyStatus'
import TabList from 'components/TabList'

const VaultInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 40px;
  ${({ theme }) => theme.mediaMinWidth.minWidth1280`
    flex-direction: row;
  `}
`

const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const VaultHeader = styled.div`
  display: flex;
  align-items: center;
  height: fit-content;
  gap: 12px;
`

const VaultTitle = styled.div`
  font-size: 40px;
  font-style: normal;
  font-weight: 300;
  line-height: 48px;
  color: ${({ theme }) => theme.textL1};
`

const VaultAttributes = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`

const AttributeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  span:first-child {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textDark54};
  }
  span:last-child {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textDark98};
  }
`

const VaultDescription = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  color: ${({ theme }) => theme.textDark54};
`

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  gap: 16px;
  flex-shrink: 0;
  width: 300px;
  padding: 12px 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.black700};
`

const TopContent = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  .icon-chat-arrow-long {
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }
`

const MyFund = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  span:first-child {
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.textL3};
  }
  span:last-child {
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 26px;
    color: ${({ theme }) => theme.textDark98};
  }
`

const BottomContent = styled.div`
  display: flex;
  height: 32px;
  gap: 12px;
`

const ButtonWithdraw = styled(ButtonBorder)`
  width: 50%;
  height: 100%;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
`

const ButtonDeposit = styled(ButtonCommon)`
  width: 50%;
  height: 100%;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
`

const ButtonSingleDeposit = styled(ButtonCommon)`
  width: 140px;
  height: 32px;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  flex-shrink: 0;
`

const VaultAddress = styled.div`
  display: flex;
  align-items: center;
  .icon-chat-copy {
    font-size: 14px;
    transition: all ${ANI_DURATION}s;
    color: ${({ theme }) => theme.textL4};
  }
  ${({ theme }) =>
    theme.isMobile
      ? css`
          .icon-chat-copy {
            font-size: 0.14rem;
          }
        `
      : css`
          cursor: pointer;
          &:hover {
            .icon-chat-copy {
              color: ${({ theme }) => theme.textL1};
            }
          }
        `}
`

const TabsWrapper = styled.div`
  margin-top: 20px;

  .vault-info-tab-list {
    height: 48px;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;

    .tab-item {
      padding: 12px 20px;
    }

    i {
      font-size: 24px;
    }
  }
`

export default memo(function VaultInfo() {
  const theme = useTheme()
  const { address } = useAppKitAccount()
  const { chainId, switchNetwork } = useAppKitNetwork()
  const [, setCurrentRouter] = useCurrentRouter()
  const toggleDepositAndWithdrawModal = useDepositAndWithdrawModalToggle()
  const [, setCurrentDepositAndWithdrawVault] = useCurrentDepositAndWithdrawVault()
  const { copyRawContent } = useCopyContent()
  const [, setDepositAndWithdrawTabIndex] = useDepositAndWithdrawTabIndex()
  const [activeTab, setActiveTab] = useActiveTab()
  const vaultId = useCurrentVaultId()
  const { vaultLpInfo } = useVaultLpInfo({ walletAddress: address as string, vaultId: vaultId || '' })
  const [vaultInfo] = useVaultInfo()
  const [strategyInfo] = useStrategyInfo()
  const [strategyId] = useCurrentStrategyId()
  const { paperTradingPublicData } = usePaperTradingPublic({ strategyId: strategyId || '' })
  const [description, strategyName] = useMemo(() => {
    return [strategyInfo?.description || '--', strategyInfo?.strategy_name || '--']
  }, [strategyInfo])
  const depositDisabled = useMemo(() => {
    return (
      strategyInfo?.status === STRATEGY_STATUS.ARCHIVED ||
      strategyInfo?.status === STRATEGY_STATUS.DELISTED ||
      strategyInfo?.status === STRATEGY_STATUS.PAUSED
    )
  }, [strategyInfo?.status])
  const handleCopyVaultAddress = useCallback(() => {
    if (vaultInfo) {
      copyRawContent(vaultInfo.vault_address)
    }
  }, [vaultInfo, copyRawContent])
  const attributesList = useMemo(() => {
    return [
      {
        label: <Trans>Strategy Provider</Trans>,
        value: strategyInfo?.user_info?.user_name || '--',
      },
    ]
    // if (vaultId === null) {
    //   // 当vaultId是null时，使用Strategy数据
    //   const ageDays = strategyInfo?.age_days ? `${strategyInfo.age_days} days` : '--'
    //   return [
    //     {
    //       label: <Trans>Strategy Provider</Trans>,
    //       value: strategyInfo?.user_info?.user_name || '--',
    //     },
    //     // {
    //     //   label: <Trans>Age</Trans>,
    //     //   value: ageDays,
    //     // },
    //   ]
    // } else {
    //   // Vault数据
    //   const vaultAddress = vaultInfo?.vault_address || '--'
    //   const depositors = vaultInfo?.lp_counts ?? '--'
    //   const strategyProvider = vaultInfo?.sp_name || '--'
    //   const age = vaultInfo?.vault_age || '--'
    //   return [
    //     {
    //       label: <Trans>Vault address</Trans>,
    //       value: (
    //         <VaultAddress onClick={handleCopyVaultAddress}>
    //           {formatAddress(vaultAddress)} <IconBase className='icon-chat-copy' />
    //         </VaultAddress>
    //       ),
    //     },
    //     {
    //       label: <Trans>Depositors</Trans>,
    //       value: depositors,
    //     },
    //     {
    //       label: <Trans>Strategy Provider</Trans>,
    //       value: strategyProvider,
    //     },
    //     {
    //       label: <Trans>Age</Trans>,
    //       value: age,
    //     },
    //   ]
    // }
  }, [strategyInfo])

  const myFund = useMemo(() => {
    return formatNumber(toFix(vaultLpInfo?.lp_tvl || 0, 2))
  }, [vaultLpInfo])

  const isZeroAsset = useMemo(() => {
    return !vaultLpInfo?.lp_tvl
  }, [vaultLpInfo])

  // 检查当前 chainId 是否在 supportedChains 中
  const isChainSupported = useMemo(() => {
    const supportedChains = vaultInfo?.supported_chains
    if (!chainId || !supportedChains || supportedChains.length === 0) return true
    return supportedChains.some((chain) => String(chain.chain_id) === String(chainId))
  }, [chainId, vaultInfo?.supported_chains])

  // 切换到 supportedChains 中的第一个 chainId
  const handleSwitchNetwork = useCallback(() => {
    const supportedChains = vaultInfo?.supported_chains
    if (!supportedChains || supportedChains.length === 0) return
    const targetChainId = Number(supportedChains[0].chain_id)
    const chainKey = CHAIN_ID_TO_CHAIN[targetChainId]
    if (chainKey && CHAIN_INFO[chainKey]) {
      switchNetwork(CHAIN_INFO[chainKey].appKitNetwork)
    }
  }, [vaultInfo?.supported_chains, switchNetwork])

  const showDepositAndWithdrawModal = useCallback(
    (index: number) => {
      return () => {
        if (depositDisabled && index === 0) return
        if (vaultInfo) {
          setDepositAndWithdrawTabIndex(index)
          setCurrentDepositAndWithdrawVault(vaultInfo)
          toggleDepositAndWithdrawModal()
        }
      }
    },
    [
      vaultInfo,
      depositDisabled,
      setCurrentDepositAndWithdrawVault,
      setDepositAndWithdrawTabIndex,
      toggleDepositAndWithdrawModal,
    ],
  )

  const goToMyVault = useCallback(() => {
    setCurrentRouter(ROUTER.MY_VAULT)
  }, [setCurrentRouter])

  const tabList = useMemo(
    () => [
      {
        key: 0,
        text: <Trans>Strategy</Trans>,
        icon: <IconBase className='icon-my-strategy' />,
        clickCallback: () => setActiveTab('strategy'),
      },
      {
        key: 1,
        text: <Trans>Vaults</Trans>,
        icon: <IconBase className='icon-my-vault' />,
        clickCallback: () => setActiveTab('vaults'),
      },
    ],
    [setActiveTab],
  )

  const tabIndex = useMemo(() => (activeTab === 'strategy' ? 0 : 1), [activeTab])

  return (
    <VaultInfoContainer>
      <LeftWrapper>
        <VaultHeader>
          <VaultTitle>{strategyName}</VaultTitle>
          <StrategyStatus status={paperTradingPublicData?.status} />
        </VaultHeader>

        <VaultDescription>
          <Markdown>{description}</Markdown>
        </VaultDescription>

        <VaultAttributes>
          {attributesList.map((attr, index) => (
            <AttributeItem key={index}>
              <span>{attr.label}</span>
              <span>{attr.value}</span>
            </AttributeItem>
          ))}
        </VaultAttributes>

        {/* 只有当vaultId存在时才显示Tabs */}
        {vaultId && (
          <TabsWrapper>
            <TabList className='vault-info-tab-list' tabKey={tabIndex} tabList={tabList} />
          </TabsWrapper>
        )}
      </LeftWrapper>
      {vaultId === null
        ? null
        : isZeroAsset
          ? address &&
            (isChainSupported ? (
              <ButtonSingleDeposit $disabled={depositDisabled} onClick={showDepositAndWithdrawModal(0)}>
                <Trans>Deposit</Trans>
              </ButtonSingleDeposit>
            ) : (
              <ButtonSingleDeposit onClick={handleSwitchNetwork}>
                <Trans>Switch Network</Trans>
              </ButtonSingleDeposit>
            ))
          : address && (
              <RightWrapper>
                <TopContent onClick={goToMyVault}>
                  <MyFund>
                    <span>
                      <Trans>My Fund</Trans>
                    </span>
                    <span>${myFund}</span>
                  </MyFund>
                  <IconBase className='icon-chat-arrow-long' />
                </TopContent>
                <BottomContent>
                  {isChainSupported ? (
                    <>
                      <ButtonWithdraw onClick={showDepositAndWithdrawModal(1)}>
                        <Trans>Withdraw</Trans>
                      </ButtonWithdraw>
                      <ButtonDeposit $disabled={depositDisabled} onClick={showDepositAndWithdrawModal(0)}>
                        <Trans>Deposit</Trans>
                      </ButtonDeposit>
                    </>
                  ) : (
                    <ButtonDeposit onClick={handleSwitchNetwork} style={{ width: '100%' }}>
                      <Trans>Switch Network</Trans>
                    </ButtonDeposit>
                  )}
                </BottomContent>
              </RightWrapper>
            )}
    </VaultInfoContainer>
  )
})
