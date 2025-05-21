import styled, { css } from 'styled-components';
import Modal from 'components/Modal';
import { useCurrentRouter, useIsMobile, useModalOpen, useSettingModalToggle } from 'store/application/hooks';
import { ApplicationModal } from 'store/application/application.d';
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper';
import etherIcon from 'assets/chains/ether-icon.png'
import arbitrumIcon from 'assets/chains/arbitrum-icon.png'
import baseIcon from 'assets/chains/base-icon.png'
import bscIcon from 'assets/chains/bnb-icon.png'
import solanaIcon from 'assets/chains/solana-icon.png'
import { Trans } from '@lingui/react/macro';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IconBase } from 'components/Icons';
import TabList from 'components/TabList';
import { Chain } from 'constants/chainInfo';
import { QRCodeSVG } from 'qrcode.react';
import copy from 'copy-to-clipboard';
import { useUserInfo } from 'store/login/hooks';
import { ANI_DURATION } from 'constants/index';
import useToast, { TOAST_STATUS } from 'components/Toast';
import { useTheme } from 'store/themecache/hooks';
import Watchlist from './components/Watchlist';
import Preference from './components/Preference';
import { ROUTER } from 'pages/router';

const SettingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 430px;
  border-radius: 36px;
  background: ${({ theme }) => theme.bgL1};
  backdrop-filter: blur(8px);
`

const SettingMobileWrapper = styled(ModalSafeAreaWrapper)`
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
  gap: 20px;
  width: 100%;
  padding: 20px;
`

const SecondTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px; 
  color: ${({ theme }) => theme.textL3};
`

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
`

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  span:first-child {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: ${({ theme }) => theme.sfC1};
    .icon-watch-list,
    .icon-task-list,
    .icon-style-type {
      font-size: 24px;
      color: ${({ theme }) => theme.textL2};
    }
  }
  span:last-child {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.textL1};
  }
`

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  span:first-child {
    display: flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 20px;
    background: ${({ theme }) => theme.text20};
    font-size: 11px;
    font-weight: 500;
    line-height: 16px; 
    color: ${({ theme }) => theme.textL2};
  }
  .icon-chat-expand {
    font-size: 18px;
    color: ${({ theme }) => theme.textL3};
  }
`

export function Setting() {
  const isMobile = useIsMobile()
  const [, setCurrentRouter] = useCurrentRouter()
  const [isShowWatchList, setIsShowWatchList] = useState(false)
  const [isShowPreference, setIsShowPreference] = useState(false)
  const settingModalOpen = useModalOpen(ApplicationModal.SETTING_MODAL)
  const toggleSettingModal = useSettingModalToggle()
  const goTasks = useCallback(() => {
    if (settingModalOpen) {
      toggleSettingModal()
    }
    setCurrentRouter(ROUTER.TASKS)
  }, [setCurrentRouter, settingModalOpen, toggleSettingModal])
  const setingList = useMemo(() => [
    {
      key: 'watchlist',
      icon: 'icon-watch-list',
      title: <Trans>Watchlist</Trans>,
      clickCallback: () => setIsShowWatchList(true),
    },
    {
      key: 'task-list',
      icon: 'icon-task-list',
      title: <Trans>Task List</Trans>,
      clickCallback: goTasks,
    },
    {
      key: 'Preference',
      icon: 'icon-style-type',
      title: <Trans>Preference</Trans>,
      clickCallback: () => setIsShowPreference(true),
    },

  ], [goTasks])
  const goBack = useCallback(() => {
    setIsShowWatchList(false)
    setIsShowPreference(false)
  }, [])
  const Wrapper = isMobile ? SettingMobileWrapper : SettingWrapper
 
  return (
    <Modal
      useDismiss
      isOpen={settingModalOpen}
      onDismiss={toggleSettingModal}
    >
      <Wrapper>
        <Header>
          {(isShowWatchList || isShowPreference) ? <IconBase className="icon-chat-back" onClick={goBack} /> : <Trans>Settings</Trans>}
          {isShowWatchList
            ? <Trans>Watchlist</Trans>
            : isShowPreference
              ? <Trans>Preference</Trans>
              : <Trans>Settings</Trans>
          }
        </Header>
        {!isShowWatchList && !isShowPreference && <Content>
          <SecondTitle><Trans>AI settings</Trans></SecondTitle>
          {
            setingList.map(item => {
              const { key, icon, title, clickCallback } = item
              return <SettingItem key={key} onClick={clickCallback}>
                <Left>
                  <span><IconBase className={icon} /></span>
                  <span>{title}</span>
                </Left>
                <Right>
                  <span>6</span>
                  <IconBase className="icon-chat-expand" />
                </Right>
              </SettingItem>
            })
          }
        </Content>}
        {isShowWatchList && <Watchlist />}
        {isShowPreference && <Preference />}
      </Wrapper>
    </Modal>
  );
};
