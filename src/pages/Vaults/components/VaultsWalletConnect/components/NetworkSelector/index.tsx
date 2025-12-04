import { memo, useMemo, useCallback, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import Select, { TriggerMethod, DataType } from 'components/Select'
import { CHAIN_INFO, Chain, CHAIN_ID_TO_CHAIN } from 'constants/chainInfo'
import NetworkIcon from 'components/NetworkIcon'
import { useAppKitNetwork, useAppKitAccount } from '@reown/appkit/react'
import { ButtonCommon } from 'components/Button'
import { useClaimInfo } from 'store/vaultsdetail/hooks/useClaimInfo'
import { useSwitchChainModalToggle } from 'store/application/hooks'
import { Trans } from '@lingui/react/macro'

export enum ColorMode {
  BRAND = 'brand',
  DARK = 'dark',
}

interface NetworkSelectorContainerProps {
  $colorMode: ColorMode
  $compactMode: boolean
}

const NetworkSelectorContainer = styled.div<NetworkSelectorContainerProps>`
  display: flex;
  align-items: center;
  gap: 4px;

  .select-wrapper {
    height: ${({ $compactMode }) => ($compactMode ? '20px' : '28px')};
  }

  .select-border-wrapper {
    background: transparent;
    border: ${({ $compactMode, theme, $colorMode }) =>
      $compactMode ? 'none' : `1px solid ${$colorMode === ColorMode.BRAND ? theme.black1000 : theme.text20}`};
    border-radius: 60px;
    padding: ${({ $compactMode }) => ($compactMode ? '0' : '5px 12px')};
    height: 28px;

    .icon-chat-expand {
      margin-left: 4px;
      color: ${({ theme, $colorMode }) => ($colorMode === ColorMode.BRAND ? theme.black1000 : theme.textL3)};
    }
  }

  ${({ theme, $compactMode }) =>
    theme.isMobile &&
    css`
      min-width: ${vm(140)};

      .select-border-wrapper {
        border-radius: ${vm(8)};
        padding: ${$compactMode ? '0' : `${vm(8)} ${vm(12)}`};
        height: ${vm(40)};
      }
    `}
`

const SelectValue = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.textL1};
  gap: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(14)};
      line-height: ${vm(20)};
      gap: ${vm(8)};
    `}
`

const NetworkItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const LeftContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  span {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL2};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      span {
        font-size: 0.12rem;
        line-height: 0.18rem;
      }
    `}
`

const AvailableClaimAmount = styled.span`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.textL2};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.12rem;
      line-height: 0.18rem;
    `}
`

const WrongNetworkButton = styled(ButtonCommon)`
  height: 28px;
  padding: 5px 12px;
  border-radius: 60px;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  background: ${({ theme }) => theme.orange300};
  color: ${({ theme }) => theme.textL1};
  width: fit-content;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(40)};
      padding: ${vm(8)} ${vm(12)};
      border-radius: ${vm(8)};
      font-size: ${vm(14)};
      line-height: ${vm(20)};
    `}
`

export interface NetworkSelectorProps {
  disabled?: boolean
  colorMode?: ColorMode
  showAvailableClaimAmount?: boolean
  compactMode?: boolean
}

const NetworkSelector = memo(
  ({
    disabled = false,
    colorMode = ColorMode.BRAND,
    showAvailableClaimAmount = false,
    compactMode = false,
  }: NetworkSelectorProps) => {
    const { chainId, switchNetwork } = useAppKitNetwork()
    const { isConnected } = useAppKitAccount()
    const [claimData] = useClaimInfo()
    const toggleSwitchChainModal = useSwitchChainModalToggle()

    // 判断当前链是否被支持
    const isChainSupported = useMemo(() => {
      if (!chainId) return false
      return Number(chainId) in CHAIN_ID_TO_CHAIN
    }, [chainId])

    // 根据当前链 ID 获取当前链
    const currentChain = useMemo(() => {
      if (!chainId || !isChainSupported) return Chain.BASE
      const chainKey = CHAIN_ID_TO_CHAIN[Number(chainId)]
      return chainKey || Chain.BASE
    }, [chainId, isChainSupported])

    // 网络切换处理
    const handleNetworkSwitch = useCallback(
      (chainKey: Chain) => {
        switchNetwork(CHAIN_INFO[chainKey].appKitNetwork)
      },
      [switchNetwork],
    )

    // 如果chainId是不支持的，且当前没有钱包连接，则自动把chain切换成Chain.BASE
    useEffect(() => {
      if (!isChainSupported && !isConnected && chainId) {
        handleNetworkSwitch(Chain.BASE)
      }
    }, [isChainSupported, isConnected, chainId, handleNetworkSwitch])

    // 构建网络选项列表
    const networkOptions: DataType[] = useMemo(() => {
      return Object.entries(CHAIN_INFO).map(([chainKey, chainInfo]) => ({
        key: chainInfo.chainId.toString(),
        value: chainKey,
        text: (
          <NetworkItem>
            <LeftContent>
              <NetworkIcon networkId={chainInfo.chainId.toString()} size={18} />
              <span>{chainInfo.name}</span>
            </LeftContent>
            {showAvailableClaimAmount && (
              <AvailableClaimAmount>
                {claimData[chainInfo.chainId as keyof typeof claimData]?.claimableAmount ?? '0'}
              </AvailableClaimAmount>
            )}
          </NetworkItem>
        ),
        clickCallback: () => handleNetworkSwitch(chainKey as Chain),
      }))
    }, [showAvailableClaimAmount, claimData, handleNetworkSwitch])

    return (
      <>
        <NetworkSelectorContainer $colorMode={colorMode} $compactMode={compactMode}>
          {!isChainSupported ? (
            <WrongNetworkButton onClick={toggleSwitchChainModal}>
              <Trans>Wrong network</Trans>
            </WrongNetworkButton>
          ) : (
            <Select
              usePortal
              value={currentChain}
              dataList={networkOptions}
              triggerMethod={TriggerMethod.CLICK}
              placement='bottom-end'
              hideExpand={false}
              disabled={disabled}
              popItemTextStyle={{ width: '100%' }}
              popStyle={{ width: showAvailableClaimAmount ? '260px' : '160px' }}
            >
              <SelectValue>
                <NetworkIcon networkId={CHAIN_INFO[currentChain].chainId.toString()} size={18} />
              </SelectValue>
            </Select>
          )}
        </NetworkSelectorContainer>
      </>
    )
  },
)

NetworkSelector.displayName = 'NetworkSelector'

export default NetworkSelector
