import { memo, useCallback, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { useCurrentRouter, useDepositAndWithdrawModalToggle } from 'store/application/hooks'
import { useCurrentDepositAndWithdrawVault } from 'store/vaults/hooks'
import { useVaultInfo } from 'store/vaultsdetail/hooks'
import { useVaultLpInfo } from 'store/myvault/hooks/useVaultLpInfo'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { mul, toFix } from 'utils/calc'
import { formatNumber } from 'utils/format'
import { formatAddress } from 'utils'
import { ANI_DURATION } from 'constants/index'
import useCopyContent from 'hooks/useCopyContent'
import { useDepositAndWithdrawTabIndex } from 'store/vaultsdetail/hooks/useDepositAndWithdraw'
import Markdown from 'components/Markdown'
import { ROUTER } from 'pages/router'
import { CHAIN_ID_TO_CHAIN, CHAIN_INFO } from 'constants/chainInfo'

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

const VaultSubtitle = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  span:first-child {
    width: 4px;
    height: 4px;
    background-color: ${({ $status, theme }) => ($status === 'live' ? theme.green100 : theme.textL4)};
  }
  span:last-child {
    font-size: 10px;
    font-style: normal;
    font-weight: 300;
    line-height: 120%;
    color: ${({ $status, theme }) => ($status === 'live' ? theme.green100 : theme.textL4)};
  }
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

export default memo(function VaultInfo({ vaultId }: { vaultId: string }) {
  const { address } = useAppKitAccount()
  const { chainId, switchNetwork } = useAppKitNetwork()
  const [, setCurrentRouter] = useCurrentRouter()
  const toggleDepositAndWithdrawModal = useDepositAndWithdrawModalToggle()
  const [, setCurrentDepositAndWithdrawVault] = useCurrentDepositAndWithdrawVault()
  const { copyRawContent } = useCopyContent()
  const [, setDepositAndWithdrawTabIndex] = useDepositAndWithdrawTabIndex()
  const { vaultLpInfo } = useVaultLpInfo({ walletAddress: address as string, vaultId: vaultId || '' })
  const [vaultInfo] = useVaultInfo()
  const [description, status, vaultName] = useMemo(() => {
    return [vaultInfo?.description || '--', vaultInfo?.status || '', vaultInfo?.vault_name || '--']
  }, [vaultInfo])
  const statusMap = useMemo(() => {
    return {
      live: <Trans>Active</Trans>,
      closing: <Trans>Closing</Trans>,
      closed: <Trans>Closed</Trans>,
      pre_launch: <Trans>Pre-launch</Trans>,
    }
  }, [])
  const handleCopyVaultAddress = useCallback(() => {
    if (vaultInfo) {
      copyRawContent(vaultInfo.vault_address)
    }
  }, [vaultInfo, copyRawContent])
  const attributesList = useMemo(() => {
    const vaultAddress = vaultInfo?.vault_address || '--'
    const depositors = vaultInfo?.lp_counts ?? '--'
    const strategyProvider = vaultInfo?.sp_name || '--'
    const age = vaultInfo?.vault_age || '--'
    return [
      {
        label: <Trans>Vault address</Trans>,
        value: (
          <VaultAddress onClick={handleCopyVaultAddress}>
            {formatAddress(vaultAddress)} <IconBase className='icon-chat-copy' />
          </VaultAddress>
        ),
      },
      {
        label: <Trans>Depositors</Trans>,
        value: depositors,
      },
      {
        label: <Trans>Strategy Provider</Trans>,
        value: strategyProvider,
      },
      {
        label: <Trans>Age</Trans>,
        value: age,
      },
    ]
  }, [vaultInfo, handleCopyVaultAddress])

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
        if (vaultInfo) {
          setDepositAndWithdrawTabIndex(index)
          setCurrentDepositAndWithdrawVault(vaultInfo)
          toggleDepositAndWithdrawModal()
        }
      }
    },
    [vaultInfo, setCurrentDepositAndWithdrawVault, setDepositAndWithdrawTabIndex, toggleDepositAndWithdrawModal],
  )

  const goToMyVault = useCallback(() => {
    setCurrentRouter(ROUTER.MY_VAULT)
  }, [setCurrentRouter])

  return (
    <VaultInfoContainer>
      <LeftWrapper>
        <VaultHeader>
          <VaultTitle>{vaultName}</VaultTitle>
          <VaultSubtitle $status={status}>
            <span></span>
            <span>{statusMap[status as keyof typeof statusMap]}</span>
          </VaultSubtitle>
        </VaultHeader>

        <VaultAttributes>
          {attributesList.map((attr, index) => (
            <AttributeItem key={index}>
              <span>{attr.label}</span>
              <span>{attr.value}</span>
            </AttributeItem>
          ))}
        </VaultAttributes>

        <VaultDescription>
          <Markdown>{description}</Markdown>
        </VaultDescription>
      </LeftWrapper>
      {isZeroAsset
        ? address &&
          (isChainSupported ? (
            <ButtonSingleDeposit onClick={showDepositAndWithdrawModal(0)}>
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
                    <ButtonDeposit onClick={showDepositAndWithdrawModal(0)}>
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
