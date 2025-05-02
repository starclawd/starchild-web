import styled, { css } from 'styled-components';
import Modal from 'components/Modal';
import { useIsMobile, useModalOpen, useWalletAddressModalToggle } from 'store/application/hooks';
import { ApplicationModal } from 'store/application/application.d';
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper';
import etherIcon from 'assets/chains/ether-icon.png'
import arbitrumIcon from 'assets/chains/arbitrum-icon.png'
import baseIcon from 'assets/chains/base-icon.png'
import solanaIcon from 'assets/chains/solana-icon.png'
import { Trans } from '@lingui/react/macro';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IconBase } from 'components/Icons';
import TabList from 'components/TabList';
import { Chain } from 'constants/chainInfo';
import { QRCodeSVG } from 'qrcode.react';
import copy from 'copy-to-clipboard';
import { useUserInfo } from 'store/login/hooks';

const AddQuestionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 420px;
  border-radius: 36px;
  background: ${({ theme }) => theme.bgL1};
  backdrop-filter: blur(8px);
`

const AddQuestionMobileWrapper = styled(ModalSafeAreaWrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${({ theme }) => theme.bgL1};
  backdrop-filter: blur(8px);
`

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px 20px 8px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
  .icon-chat-back {
    position: absolute;
    left: 20px;
    font-size: 28px;
    color: ${({ theme }) => theme.textL1};
    cursor: pointer;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  gap: 20px;
`

const AddressItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  img {
    width: 36px;
    height: 36px;
  }
  .address-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    word-break: break-all;
    gap: 4px;
    span:first-child {
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      color: ${({ theme }) => theme.textL1};
    }
    span:last-child {
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      color: ${({ theme }) => theme.textL4};
    }
  }
  .address-action {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    gap: 8px;
  }
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.bgT30};
  cursor: pointer;
  .icon-header-qrcode,
  .icon-chat-copy {
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }
  &.icon-wrapper-copy {
    width: 44px;
    height: 44px;
    .icon-chat-copy {
      font-size: 20px;
    }
  }
`

const QrContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0;
  .tab-list-wrapper {
    padding: 20px 0;
    gap: 4px;
    .tab-item {
      font-size: 12px;
      font-weight: 500;
      line-height: 18px;
      height: 28px;
      padding: 0 12px;
      border-radius: 22px;
    }
  }
`

const QrCodeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 12px 20px 20px;
  > span:first-child {
    margin-bottom: 20px;
    font-size: 13px;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.textL3};
    span {
      color: ${({ theme }) => theme.white};
    }
  }
  svg {
    border: 6px solid #fff;
  }
`

const AddressData = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 30px;
  word-break: break-all;
  > span:first-child {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px; 
    color: ${({ theme }) => theme.textL4};
    span {
      margin-right: 8px;
      color: ${({ theme }) => theme.white};
    }
    span:last-child {
      margin-left: 8px;
      color: ${({ theme }) => theme.white};
    }
  }
  
`

export function WalletAddressModal() {
  const isMobile = useIsMobile()
  const [userInfo] = useUserInfo()
  const [currentChain, setCurrentChain] = useState('')
  const [currentChainAddress, setCurrentChainAddress] = useState('')
  const walletAddressModalOpen = useModalOpen(ApplicationModal.WALLET_ADDRESS_MODAL)
  const toggleWalletAddressModal = useWalletAddressModalToggle()
  const { evmAddress, solanaAddress } = userInfo
  const Wrapper = isMobile ? AddQuestionMobileWrapper : AddQuestionWrapper
  const chainAddressList = useMemo(() => {
    return [
      {
        chain: Chain.ETHEREUM,
        icon: etherIcon,
        title: <Trans>Ethereum address</Trans>,
        address: evmAddress,
      },
      {
        chain: Chain.ARBITRUM,
        icon: arbitrumIcon,
        title: <Trans>Arbitrum One address</Trans>,
        address: evmAddress,
      },
      {
        chain: Chain.BASE,
        icon: baseIcon,
        title: <Trans>Base address</Trans>,
        address: evmAddress,
      },
      {
        chain: Chain.SOLANA,
        icon: solanaIcon,
        title: <Trans>Solana address</Trans>,
        address: solanaAddress,
      },
    ]
  }, [evmAddress, solanaAddress])
  const currentChainAddressData = useMemo(() => {
    return chainAddressList.find((item) => item.chain === currentChainAddress)
  }, [chainAddressList, currentChainAddress])
  const tabList = useMemo(() => [
    {
      key: Chain.ETHEREUM,
      text: 'Ethereum',
      value: Chain.ETHEREUM,
      isActive: currentChainAddress === Chain.ETHEREUM,
      clickCallback: () => setCurrentChainAddress(Chain.ETHEREUM),
    },
    {
      key: Chain.SOLANA,
      text: 'Solana',
      value: Chain.SOLANA,
      isActive: currentChainAddress === Chain.SOLANA,
      clickCallback: () => setCurrentChainAddress(Chain.SOLANA),
    },
    {
      key: Chain.ARBITRUM,
      text: 'Arbitrum',
      value: Chain.ARBITRUM,
      isActive: currentChainAddress === Chain.ARBITRUM,
      clickCallback: () => setCurrentChainAddress(Chain.ARBITRUM),
    },
    {
      key: Chain.BASE,
      text: 'Base',
      value: Chain.BASE,
      isActive: currentChainAddress === Chain.BASE,
      clickCallback: () => setCurrentChainAddress(Chain.BASE),
    },
  ], [currentChainAddress])
  const copyAddress = useCallback((address: string) => {
    copy(address)
  }, [])
  useEffect(() => {
    if (currentChain) {
      setCurrentChainAddress(currentChain)
    }
  }, [currentChain])
  return (
    <Modal
      useDismiss
      isOpen={walletAddressModalOpen}
      onDismiss={toggleWalletAddressModal}
    >
      <Wrapper>
        <Header>
          {currentChain && <IconBase className="icon-chat-back" onClick={() => setCurrentChain('')} />}
          <Trans>Wallet Address</Trans>
        </Header>
        {!currentChain
          ? <Content>
            {chainAddressList.map((item) => {
              const { chain, icon, title, address } = item
              return <AddressItem key={chain}>
                <img src={icon} alt={chain} />
                <span className="address-info">
                  <span>{title}</span>
                  <span>{address}</span>
                </span>
                <span className="address-action">
                  <IconWrapper onClick={() => setCurrentChain(chain)}>
                    <IconBase className="icon-header-qrcode" />
                  </IconWrapper>
                  <IconWrapper onClick={() => copyAddress(address)}>
                    <IconBase className="icon-chat-copy" />
                  </IconWrapper>
                </span>
              </AddressItem>
            })}
          </Content>
          : currentChainAddressData && <QrContent>
            <TabList tabList={tabList} />
            <QrCodeWrapper>
              <span><Trans>Only supports <span>Ethereum (ERC20)</span> assets</Trans></span>
              <QRCodeSVG size={193} value={currentChainAddressData.address} />
              <AddressData>
                <span>
                  <span>{currentChainAddressData.address.slice(0, 8)}</span>
                  {currentChainAddressData.address.slice(8, -6)}
                  <span>{currentChainAddressData.address.slice(-6)}</span>
                </span>
                <IconWrapper className="icon-wrapper-copy" onClick={() => copyAddress(currentChainAddressData.address)}>
                  <IconBase className="icon-chat-copy" />
                </IconWrapper>
              </AddressData>
            </QrCodeWrapper>
          </QrContent>}
      </Wrapper>
    </Modal>
  );
};
