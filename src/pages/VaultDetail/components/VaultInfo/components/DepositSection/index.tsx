import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { useDepositAndWithdrawModalToggle, useSetCurrentRouter } from 'store/application/hooks'
import { useCurrentDepositAndWithdrawVault } from 'store/vaults/hooks'
import { useVaultInfo, useCurrentVaultId, useVibeTradingStrategyInfo } from 'store/vaultsdetail/hooks'
import { useVaultLpInfo } from 'store/myvault/hooks/useVaultLpInfo'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { toFix } from 'utils/calc'
import { formatNumber } from 'utils/format'
import { useDepositAndWithdrawTabIndex } from 'store/vaultsdetail/hooks/useDepositAndWithdraw'
import { ROUTER } from 'pages/router'
import { CHAIN_ID_TO_CHAIN, CHAIN_INFO } from 'constants/chainInfo'
import { STRATEGY_STATUS } from 'store/createstrategy/createstrategy'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { ANI_DURATION } from 'constants/index'

const DepositWrapper = styled.div`
  display: flex;
`

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  gap: 16px;
  flex-shrink: 0;
  width: 300px;
  padding: 12px 16px;
  border-radius: 4px;
  background: ${({ theme }) => theme.black700};
  transition: all ${ANI_DURATION}s;
  ${({ theme }) => theme.mediaMaxWidth.width1440`
    width: 240px;
  `}
  ${({ theme }) => theme.mediaMaxWidth.width1280`
    width: 200px;
  `}
`

const TopContent = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  .icon-chat-arrow-long {
    font-size: 18px;
    color: ${({ theme }) => theme.black100};
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
    color: ${({ theme }) => theme.black200};
  }
  span:last-child {
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 26px;
    color: ${({ theme }) => theme.black0};
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
  border: 1px solid ${({ theme }) => theme.black600};
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

export default memo(function DepositSection() {
  const { address } = useAppKitAccount()
  const { strategyId } = useParsedQueryString()
  const { chainId, switchNetwork } = useAppKitNetwork()
  const setCurrentRouter = useSetCurrentRouter()
  const toggleDepositAndWithdrawModal = useDepositAndWithdrawModalToggle()
  const [, setCurrentDepositAndWithdrawVault] = useCurrentDepositAndWithdrawVault()
  const [, setDepositAndWithdrawTabIndex] = useDepositAndWithdrawTabIndex()
  const vaultId = useCurrentVaultId()
  const { vaultLpInfo } = useVaultLpInfo({ walletAddress: address as string, vaultId: vaultId || '' })
  const { vaultInfo } = useVaultInfo({ vaultId })
  const { strategyInfo } = useVibeTradingStrategyInfo({ strategyId })
  const depositDisabled = useMemo(() => {
    return (
      strategyInfo?.status === STRATEGY_STATUS.ARCHIVED ||
      strategyInfo?.status === STRATEGY_STATUS.DELISTED ||
      strategyInfo?.status === STRATEGY_STATUS.PAUSED
    )
  }, [strategyInfo?.status])

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

  return (
    <DepositWrapper>
      {isZeroAsset ? (
        isChainSupported ? (
          <ButtonSingleDeposit $disabled={depositDisabled} onClick={showDepositAndWithdrawModal(0)}>
            <Trans>Deposit</Trans>
          </ButtonSingleDeposit>
        ) : (
          <ButtonSingleDeposit onClick={handleSwitchNetwork}>
            <Trans>Switch Network</Trans>
          </ButtonSingleDeposit>
        )
      ) : (
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
    </DepositWrapper>
  )
})
