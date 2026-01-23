import { memo, useMemo, useCallback, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import Select, { TriggerMethod, DataType } from 'components/Select'
import { CHAIN_INFO, Chain, CHAIN_ID_TO_CHAIN } from 'constants/chainInfo'
import NetworkIcon from 'pages/components/NetworkIcon'
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
}

const NetworkSelectorContainer = styled.div<NetworkSelectorContainerProps>`
  display: flex;
  align-items: center;
  gap: 4px;

  .select-wrapper {
    &:hover {
      .icon-expand {
        color: ${({ theme, $colorMode }) => ($colorMode === ColorMode.BRAND ? theme.black1000 : theme.black0)};
      }
    }
  }

  .select-value-wrapper {
    gap: 2px;
    border: none;
    border-radius: 4px;

    .icon-expand {
      color: ${({ theme, $colorMode }) => ($colorMode === ColorMode.BRAND ? theme.black1000 : theme.black200)};
    }
    &.show {
      .icon-expand {
        color: ${({ theme, $colorMode }) => ($colorMode === ColorMode.BRAND ? theme.black1000 : theme.black0)};
      }
    }
  }
`

const SelectValue = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.black0};
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
    color: ${({ theme }) => theme.black100};
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
  color: ${({ theme }) => theme.black100};
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
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  background: ${({ theme }) => theme.orange300};
  color: ${({ theme }) => theme.black0};
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
}

const NetworkSelector = memo(
  ({ disabled = false, colorMode = ColorMode.BRAND, showAvailableClaimAmount = false }: NetworkSelectorProps) => {
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
      return Object.values(CHAIN_ID_TO_CHAIN).map((chainKey) => {
        const chainInfo = CHAIN_INFO[chainKey]
        return {
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
        }
      })
    }, [showAvailableClaimAmount, claimData, handleNetworkSwitch])

    return (
      <>
        <NetworkSelectorContainer $colorMode={colorMode}>
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
