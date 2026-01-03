import { memo, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { vm } from 'pages/helper'
import Select, { TriggerMethod, DataType } from 'components/Select'
import { useAppKitAccount } from '@reown/appkit/react'
import { ButtonCommon } from 'components/Button'
import { useConnectWalletModalToggle } from 'store/application/hooks'
import { useAppKitWallet } from '@reown/appkit-wallet-button/react'

export enum ColorMode {
  BRAND = 'brand',
  DARK = 'dark',
}

interface OperationSelectorProps {
  isCreateStrategy?: boolean
  onCopy?: () => void
  onDisconnect?: () => void
  className?: string
  colorMode?: ColorMode
}

// 主容器
const OperationContainer = styled.div`
  position: relative;
  display: inline-flex;

  .select-wrapper {
    height: 20px;
  }

  .select-border-wrapper {
    border: none;
    padding: 0;
    background-color: transparent;
  }

  .icon-chat-expand {
    margin-left: 4px;
    font-size: 18px;
    color: ${({ theme }) => theme.textL3};
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      .select-border-wrapper {
        padding: ${vm(4)};
        .icon-chat-expand {
          font-size: ${vm(16)};
        }
      }
    `}
`

// 图标容器
const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.textL3};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(20)};
      height: ${vm(20)};
    `}
`

// 文本容器
const MenuText = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(14)};
      line-height: ${vm(20)};
    `}
`

// 菜单项容器
const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;

  &.disconnect-menu-item {
    ${IconWrapper} {
      color: ${({ theme }) => theme.red100};
    }

    ${MenuText} {
      color: ${({ theme }) => theme.red100};
    }
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
    `}
`

const SelectValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.black1000};
  font-size: 24px;
`
interface ConnectButtonProps {
  $colorMode: ColorMode
}

const ConnectButton = styled(ButtonCommon)<ConnectButtonProps & { $isCreateStrategy: boolean }>`
  background: ${({ theme, $colorMode }) => ($colorMode === ColorMode.BRAND ? theme.black1000 : theme.brand100)};
  color: ${({ theme, $colorMode }) => ($colorMode === ColorMode.BRAND ? theme.brand100 : theme.textL1)};
  padding: 8px 12px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  border-radius: 30px;
  width: fit-content;
  height: 28px;
  ${({ $isCreateStrategy }) =>
    $isCreateStrategy &&
    css`
      height: 24px;
    `}
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)} ${vm(24)};
      font-size: ${vm(14)};
      border-radius: ${vm(24)};
      min-width: ${vm(140)};
    `}
`

const OperationSelector = memo(
  ({
    onCopy,
    onDisconnect,
    className,
    colorMode = ColorMode.BRAND,
    isCreateStrategy = false,
  }: OperationSelectorProps) => {
    const { isConnected } = useAppKitAccount()
    const toggleConnectWalletModal = useConnectWalletModalToggle()
    const { isPending } = useAppKitWallet()

    // 构建下拉选项列表
    const operationOptions: DataType[] = useMemo(
      () => [
        {
          key: 'copy',
          value: 'copy',
          text: (
            <MenuItem>
              <IconWrapper>
                <IconBase className='icon-copy' />
              </IconWrapper>
              <MenuText>
                <Trans>Copy</Trans>
              </MenuText>
            </MenuItem>
          ),
          clickCallback: () => {
            onCopy?.()
          },
        },
        {
          key: 'disconnect',
          value: 'disconnect',
          text: (
            <MenuItem className='disconnect-menu-item'>
              <IconWrapper>
                <IconBase className='icon-logout' />
              </IconWrapper>
              <MenuText>
                <Trans>Disconnect</Trans>
              </MenuText>
            </MenuItem>
          ),
          clickCallback: () => {
            onDisconnect?.()
          },
        },
      ],
      [onCopy, onDisconnect],
    )

    return (
      <OperationContainer className={className}>
        {isConnected ? (
          <Select
            usePortal
            value=''
            hideExpand
            dataList={operationOptions}
            triggerMethod={TriggerMethod.CLICK}
            placement='bottom-end'
            popStyle={{ width: '140px' }}
            popItemTextStyle={{ width: '100%' }}
          >
            <SelectValue>
              <IconBase className='icon-more' />
            </SelectValue>
          </Select>
        ) : (
          <ConnectButton
            $isCreateStrategy={isCreateStrategy}
            as='button'
            onClick={toggleConnectWalletModal}
            $pending={isPending}
            $disabled={isPending}
            $colorMode={colorMode}
          >
            {isPending ? <Trans>Connecting...</Trans> : <Trans>Connect wallet</Trans>}
          </ConnectButton>
        )}
      </OperationContainer>
    )
  },
)

OperationSelector.displayName = 'OperationSelector'

export default OperationSelector
