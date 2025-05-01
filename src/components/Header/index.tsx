import { useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { QRCodeSVG } from 'qrcode.react';
import { Trans } from '@lingui/react/macro';
import { ROUTER } from 'pages/router';
import { isMatchCurrentRouter } from 'utils';
import { useCurrentRouter, useQrCodeModalToggle, useWalletAddressModalToggle } from 'store/application/hooks';
import { QrCodeModal } from './components/QrCodeModal';
import { IconBase } from 'components/Icons';
import { useIsLogin } from 'store/login/hooks';
import { ButtonCommon } from 'components/Button';
import { WalletAddressModal } from './components/WalletAdressModal';
import { ANI_DURATION } from 'constants/index';

const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 72px;
  flex-shrink: 0;
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
  gap: 40px;
`

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.textL1};
`

const NavTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const NavTab = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 12px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px; 
  transition: all ${ANI_DURATION}s;
  color: ${({ theme, $active }) => $active ? theme.textL1 : theme.textL4};
  cursor: pointer;
`

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const marquee = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const InsightsItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const UpdateWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 20px;
  border-radius: 44px;
  color: ${({ theme }) => theme.jade10};
  position: relative;
  z-index: 0;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.bgT20};

  /* 容器伪元素背景效果 */
  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 80px;
    background-image: conic-gradient(${({ theme }) => theme.jade10}, ${({ theme }) => theme.jade10}, ${({ theme }) => theme.jade10} 50%, transparent 50%, transparent 100%);
    top: -30px;
    left: -50%;
    z-index: -2;
    transform-origin: center;
    animation: ${rotate} 4s linear infinite;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 1px;
    border-radius: 44px;
    background-color: ${({ theme }) => theme.bgL0};
    z-index: -1;
  }

  /* 走马灯文本样式 */
  span {
    position: absolute;
    display: flex;
    align-items: center;
    white-space: nowrap;
    width: max-content;
    height: 100%;
    font-size: 11px;
    font-weight: 500;
    line-height: 16px; 
    border-radius: 44px;
    padding: 0 6px;
    animation: ${marquee} 10s linear infinite;
    
    /* 第二个元素的动画延迟，确保无缝衔接 */
    &:nth-child(2) {
      animation-delay: -5s;
    }
  }
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const RightItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  height: 44px;
  border-radius: 44px;
  background-color: ${({ theme }) => theme.bgT20};
  cursor: pointer;
  .icon-header-qrcode,
  .icon-header-noti,
  .icon-header-setting {
    font-size: 24px;
    color: ${({ theme }) => theme.textL2};
  }
`

const DownLoadWrapper = styled.div`
  display: flex;
  align-items: center;
  .icon-header-pc {
    font-size: 24px;
    color: ${({ theme }) => theme.textDark98};
    margin-right: 4px;
  }
  .icon-chat-more {
    font-size: 8px;
    color: ${({ theme }) => theme.jade10};
    margin-right: 4px;
  }
  .icon-chat-complete {
    font-size: 12px;
    color: ${({ theme }) => theme.jade10};
  }
  .icon-header-mobile {
    font-size: 24px;
    color: ${({ theme }) => theme.textDark98};
    margin-left: 4px;
  }
`

const ConnectWallet = styled(ButtonCommon)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  height: 44px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  padding: 0 18px;
  border-radius: 44px;
  color: ${({ theme }) => theme.black};
  background-color: ${({ theme }) => theme.jade10};
`

export const Header = () => {
  const isLogin = useIsLogin()
  const [currentRouter, setCurrentRouter] = useCurrentRouter()
  const toggleQrCodeModal = useQrCodeModalToggle()
  const toggleWalletAddressModal = useWalletAddressModalToggle()
  const goOtherPage = useCallback((value: string) => {
    if (isMatchCurrentRouter(currentRouter, value)) return
    setCurrentRouter(value)
  }, [currentRouter, setCurrentRouter])

  const menuList = useMemo(() => {
    return [
      {
        key: 'insights',
        text: <InsightsItem>
          <Trans>Insights</Trans>
          <UpdateWrapper>
            <span><Trans>{7} updates</Trans></span>
            <span><Trans>{7} updates</Trans></span>
          </UpdateWrapper>
        </InsightsItem>,
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
    ]
  }, [goOtherPage])

  const rightList = useMemo(() => {
    return [
      {
        key: 'qrcode',
        content: <IconBase className="icon-header-qrcode" />,
        clickCallback: toggleWalletAddressModal,
      },
      {
        key: 'notification',
        content: <IconBase className="icon-header-noti" />,
        clickCallback: (_: any) => _,
      },
      {
        key: 'settings',
        content: <IconBase className="icon-header-setting" />,
        clickCallback: (_: any) => _,
      },
      { 
        key: 'download',
        content: <DownLoadWrapper>
          <IconBase className="icon-header-pc" />
          <IconBase className="icon-chat-more" />
          <IconBase className="icon-chat-complete" />
          <IconBase className="icon-chat-more" />
          <IconBase className="icon-header-mobile" />
        </DownLoadWrapper>,
        clickCallback: (_: any) => _,
      },
    ]
  }, [toggleWalletAddressModal])

  const goConnectPage = useCallback(() => {
    setCurrentRouter(ROUTER.CONNECT)
  }, [setCurrentRouter])

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
      
      {isLogin
        ? <RightSection>
          {rightList.map((item) => {
            const { key, content, clickCallback } = item
            return <RightItem key={key} onClick={clickCallback}>
              {content}
            </RightItem>
          })}
        </RightSection>
        : <ConnectWallet onClick={goConnectPage}>
          <Trans>Connect Wallet</Trans>
        </ConnectWallet>}
      <QrCodeModal />
      <WalletAddressModal />
    </HeaderWrapper>
  );
};
