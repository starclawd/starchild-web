import { memo, useMemo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import Select, { TriggerMethod, DataType } from 'components/Select'
import { CHAIN_INFO, Chain, type SupportedChain, CHAIN_ID_TO_CHAIN, CHAIN_ID, ChainInfo } from 'constants/chainInfo'
import NetworkIcon from 'components/NetworkIcon'
import { CaipNetworkId, useAppKit, useAppKitNetwork } from '@reown/appkit/react'
import { AppKitNetwork } from '@reown/appkit/networks'
import { ButtonCommon } from 'components/Button'

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

  .select-border-wrapper {
    background: transparent;
    border: 1px solid ${({ theme, $colorMode }) => ($colorMode === ColorMode.BRAND ? theme.black1000 : theme.text20)};
    border-radius: 60px;
    padding: 5px 12px;
    height: 28px;

    .icon-chat-expand {
      margin-left: 4px;
      color: ${({ theme, $colorMode }) => ($colorMode === ColorMode.BRAND ? theme.black1000 : theme.textL3)};
    }
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      min-width: ${vm(140)};

      .select-border-wrapper {
        border-radius: ${vm(8)};
        padding: ${vm(8)} ${vm(12)};
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
  gap: 8px;
  width: 100%;
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
    `}
`

const WrongNetworkButton = styled(ButtonCommon)`
  height: 28px;
  padding: 5px 12px;
  border-radius: 60px;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  background: ${({ theme }) => theme.brand300};
  color: #ffffff;
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
}

const NetworkSelector = memo(({ disabled = false, colorMode = ColorMode.BRAND }: NetworkSelectorProps) => {
  const { chainId, switchNetwork } = useAppKitNetwork()
  const { open } = useAppKit()

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

  // 构建网络选项列表
  const networkOptions: DataType[] = useMemo(() => {
    return Object.entries(CHAIN_INFO).map(([chainKey, chainInfo]) => ({
      key: chainInfo.chainId.toString(),
      value: chainKey,
      text: (
        <NetworkItem>
          <NetworkIcon networkId={chainInfo.chainId.toString()} size={18} />
          <span>{chainInfo.name}</span>
        </NetworkItem>
      ),
      clickCallback: () => handleNetworkSwitch(chainKey as Chain),
    }))
  }, [handleNetworkSwitch])

  return (
    <NetworkSelectorContainer $colorMode={colorMode}>
      <Select
        usePortal
        value={currentChain}
        dataList={networkOptions}
        triggerMethod={TriggerMethod.CLICK}
        placement='bottom-end'
        hideExpand={!isChainSupported}
        disabled={disabled}
        popStyle={{
          width: '160px',
        }}
      >
        {!isChainSupported ? (
          <WrongNetworkButton $disabled={disabled}>Wrong network</WrongNetworkButton>
        ) : (
          <SelectValue>
            <NetworkIcon networkId={CHAIN_INFO[currentChain].chainId.toString()} size={18} />
          </SelectValue>
        )}
      </Select>
    </NetworkSelectorContainer>
  )
})

NetworkSelector.displayName = 'NetworkSelector'

export default NetworkSelector
