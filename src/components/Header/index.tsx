import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { QRCodeSVG } from 'qrcode.react';
import Modal from 'components/Modal';
import { Trans } from '@lingui/react/macro';
import { ROUTER } from 'pages/router';
import { isMatchCurrentRouter } from 'utils';
import { useCurrentRouter } from 'store/application/hooks';

const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  background-color: ${({ theme }) => theme.bg2 || '#fff'};
  border-bottom: 1px solid ${({ theme }) => theme.line1 || 'rgba(0, 0, 0, 0.05)'};
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #FF6F00;
  margin-right: 40px;
`

const NavTabs = styled.div`
  display: flex;
  gap: 32px;
`

const NavTab = styled.div<{ $active?: boolean }>`
  padding: 8px 0;
  cursor: pointer;
  font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
  color: ${({ $active, theme }) => ($active ? '#FF6F00' : theme.text1 || '#333')};
  position: relative;
  
  &:hover {
    color: #FF6F00;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -16px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${({ $active }) => ($active ? '#FF6F00' : 'transparent')};
  }
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const DownloadButton = styled.div`
  position: relative;
  padding: 8px 12px;
  cursor: pointer;
  color: ${({ theme }) => theme.text1 || '#333'};
  display: flex;
  align-items: center;
  
  &:hover .qr-code-popup {
    display: flex;
  }
`

const QrCodePopup = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  padding: 16px;
  background-color: ${({ theme }) => theme.bg2 || '#fff'};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  flex-direction: column;
  align-items: center;
  z-index: 10;
  margin-top: 8px;
`

const QrText = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.text2 || '#666'};
`

const ConnectWalletButton = styled.button`
  padding: 8px 16px;
  background-color: #FF6F00;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background-color: #E56500;
  }
`

const QrCodeModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background-color: ${({ theme }) => theme.bg2 || '#fff'};
`

const QrCodeTitle = styled.h2`
  margin-bottom: 24px;
  font-size: 18px;
  color: ${({ theme }) => theme.text1 || '#333'};
`

export const Header = () => {
  const [currentRouter, setCurrentRouter] = useCurrentRouter()
  const [activeTab, setActiveTab] = useState('insights');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const goOtherPage = useCallback((value: string) => {
    if (isMatchCurrentRouter(currentRouter, value)) return
    setCurrentRouter(value)
  }, [currentRouter, setCurrentRouter])


  const menuList = [
    {
      key: 'insights',
      text: <Trans>Insights</Trans>,
      value: ROUTER.INSIGHTS,
      clickCallback: goOtherPage,
    },
    {
      key: 'agent',
      text: <Trans>AI Agent</Trans>,
      value: ROUTER.TRADE_AI,
      clickCallback: goOtherPage,
    },
    {
      key: 'Portfolio',
      text: <Trans>Portfolio</Trans>,
      value: ROUTER.PORTFOLIO,
      clickCallback: goOtherPage,
    },
  ];

  return (
    <HeaderWrapper>
      <LeftSection>
        <Logo>HOLOMINDS</Logo>
        <NavTabs>
          {menuList.map(tab => {
            const { key, text, value, clickCallback } = tab
            return <NavTab 
              key={key} 
              $active={isMatchCurrentRouter(currentRouter, value)}
              onClick={() => clickCallback(value)}
            >
              {text}
            </NavTab>
          })}
        </NavTabs>
      </LeftSection>
      
      <RightSection>
        <DownloadButton>
          <span>下载</span>
          <QrCodePopup className="qr-code-popup">
            <QRCodeSVG size={120} value="https://holominds.app/download" />
            <QrText>扫码下载APP</QrText>
          </QrCodePopup>
        </DownloadButton>
        
        <ConnectWalletButton onClick={() => setIsWalletModalOpen(true)}>
          Connect Wallet
        </ConnectWalletButton>
      </RightSection>
      
      <Modal 
        useDismiss
        isOpen={isWalletModalOpen}
        onDismiss={() => setIsWalletModalOpen(false)}
      >
        <QrCodeModalContent>
          <QrCodeTitle>扫码登录</QrCodeTitle>
          <QRCodeSVG size={200} value="https://holominds.app/login" />
        </QrCodeModalContent>
      </Modal>
    </HeaderWrapper>
  );
};
