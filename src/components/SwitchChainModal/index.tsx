/**
 * Vaults钱包连接模态框组件
 */
import { memo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import Modal from 'components/Modal'
import BottomSheet from 'components/BottomSheet'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { vm } from 'pages/helper'
import { useSwitchChainModalToggle, useIsMobile, useModalOpen } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application'
import { useAppKitNetwork } from '@reown/appkit/react'
import { Chain, CHAIN_INFO } from 'constants/chainInfo'
import NetworkIcon from 'components/NetworkIcon'
import { ANI_DURATION } from 'constants/index'

// 桌面端模态框内容容器
const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 320px;
  background: ${({ theme }) => theme.bgL1};
  border-radius: 20px;
  position: relative;
`

// 移动端模态框内容容器
const MobileModalContent = styled(ModalSafeAreaWrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${({ theme }) => theme.bgL1};
`

// 标题
const Title = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px 0 8px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(20)} 0 ${vm(8)};
      font-size: 0.2rem;
      line-height: 0.28rem;
    `}
`

// 切换链按钮容器
const SwitchChainButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(4)};
    `}
`

const NetworkItem = styled.div`
  display: flex;
  align-items: center;
  height: 32px;
  padding: 8px;
  gap: 8px;
  width: 100%;
  transition: all ${ANI_DURATION}s;
  border-radius: 8px;
  span {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textDark80};
  }

  ${({ theme }) =>
    theme.isMobile
      ? css`
          gap: ${vm(8)};
          height: ${vm(32)};
          padding: ${vm(8)};
          border-radius: ${vm(8)};
          span {
            font-size: 0.14rem;
            line-height: 0.2rem;
          }
        `
      : css`
          cursor: pointer;
          &:hover {
            background-color: ${({ theme }) => theme.bgT20};
          }
        `}
`

// 内部组件，处理实际的UI渲染
export default memo(function SwitchChainModal() {
  const { switchNetwork } = useAppKitNetwork()
  const switchChainModalOpen = useModalOpen(ApplicationModal.SWITCH_CHAIN_MODAL)
  const toggleSwitchChainModal = useSwitchChainModalToggle()
  const isMobile = useIsMobile()

  const handleNetworkSwitch = useCallback(
    (chainKey: Chain) => {
      return () => {
        switchNetwork(CHAIN_INFO[chainKey].appKitNetwork)
      }
    },
    [switchNetwork],
  )

  const renderContent = () => {
    return (
      <>
        <Title>
          <Trans>Switch Chain</Trans>
        </Title>

        <SwitchChainButtonsContainer>
          {Object.entries(CHAIN_INFO).map(([chainKey, chainInfo]) => {
            return (
              <NetworkItem key={chainKey} onClick={handleNetworkSwitch(chainKey as Chain)}>
                <NetworkIcon networkId={chainInfo.chainId.toString()} size={18} />
                <span>{chainInfo.name}</span>
              </NetworkItem>
            )
          })}
        </SwitchChainButtonsContainer>
      </>
    )
  }

  return isMobile ? (
    <BottomSheet
      placement='mobile'
      hideClose={false}
      hideDragHandle
      isOpen={switchChainModalOpen}
      rootStyle={{ overflowY: 'hidden', maxHeight: `${vm(480)}` }}
      onClose={toggleSwitchChainModal}
    >
      <MobileModalContent>{renderContent()}</MobileModalContent>
    </BottomSheet>
  ) : (
    <Modal isOpen={switchChainModalOpen} onDismiss={toggleSwitchChainModal} hideClose={false} zIndex={300}>
      <ModalContent>{renderContent()}</ModalContent>
    </Modal>
  )
})
