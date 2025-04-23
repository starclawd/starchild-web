import { useCallback } from 'react';
import styled from 'styled-components';
import { QRCodeSVG } from 'qrcode.react';
import { Trans } from '@lingui/react/macro';
import { ROUTER } from 'pages/router';
import { isMatchCurrentRouter } from 'utils';
import { useCurrentRouter, useQrCodeModalToggle } from 'store/application/hooks';
import { QrCodeModal } from './components/QrCodeModal';

const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 68px;
  ${({ theme }) => theme.mediaMinWidth.minWidth1024`
    padding: 12px 40px;
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1280`
    padding: 12px 60px;
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1920`
    padding: 12px 80px;
  `}
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
`

const ConnectWalletButton = styled.button`
  padding: 8px 16px;
  background-color: #FF6F00;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background-color: #E56500;
  }
`

export const Header = () => {
  const [currentRouter, setCurrentRouter] = useCurrentRouter()
  const toggleQrCodeModal = useQrCodeModalToggle()
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
        
        <ConnectWalletButton onClick={toggleQrCodeModal}>
          Connect Wallet
        </ConnectWalletButton>
      </RightSection>
      <QrCodeModal />
    </HeaderWrapper>
  );
};
