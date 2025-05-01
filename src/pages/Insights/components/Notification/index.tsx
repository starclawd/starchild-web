import styled, { css } from 'styled-components'
import { IconBase } from 'components/Icons'
import { useTheme } from 'store/themecache/hooks'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { useCallback, useState } from 'react'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { Trans } from '@lingui/react/macro'

const NotificationWrapper = styled(BorderAllSide1PxBox)`
  width: 88px;
  height: 44px;
  padding: 3px;
  gap: 8px;
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(88)};
    height: ${vm(44)};
    padding: ${vm(3)};
    gap: ${vm(8)};
  `}
`

const IconWrapper = styled.div<{ $isNotiEnable: boolean, $isActive: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: background-color ${ANI_DURATION}s;
  .icon-chat-noti-disable,
  .icon-chat-noti-enable {
    font-size: 24px;
    transition: color ${ANI_DURATION}s;
  }
  ${({ theme, $isNotiEnable }) => !$isNotiEnable
    ? css`
      .icon-chat-noti-disable {
        color: ${theme.ruby50};
      }
      .icon-chat-noti-enable {
        color: ${theme.textL6};
      }
    `
    : css`
      .icon-chat-noti-disable {
        color: ${theme.textL6};
      }
      .icon-chat-noti-enable {
        color: ${theme.jade10};
      }
    `}
  ${({ theme, $isActive }) => theme.isMobile
    ? css`
      width: ${vm(36)};
      height: ${vm(36)};
      .icon-chat-noti-disable,
      .icon-chat-noti-enable {
        font-size: .24rem;
      }
    
    `: css`
      cursor: pointer;
      ${!$isActive && css`
        &:hover {
          color: ${theme.textL3};
          background-color: ${theme.bgT30};
        }
      `}
    `}
`

const MockBg = styled.div<{ $isNotiEnable: boolean }>`
  position: absolute;
  left: 3px;
  top: 3px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: left ${ANI_DURATION}s;
  background-color: ${({ theme }) => theme.sfC2};
  ${({ $isNotiEnable }) => $isNotiEnable && css`
    left: 47px;
  `}
  ${({ theme, $isNotiEnable }) => theme.isMobile && css`
    left: ${vm(3)};
    top: ${vm(3)};
    width: ${vm(36)};
    height: ${vm(36)};
    ${$isNotiEnable && css`
      left: ${vm(47)};
    `}
  `}
`

export default function Notification() {
  const theme = useTheme()
  const toast = useToast()
  const [isNotiEnable, setIsNotiEnable] = useState(false)
  const changeNotiEnable = useCallback((status: boolean) => {
    return () => {
      setIsNotiEnable(status)
      if (status) {
        toast({
          title: <Trans>Notifications Enabled</Trans>,
          description: <Trans>You'll get updates and assistance promptly.</Trans>,
          status: TOAST_STATUS.SUCCESS,
          typeIcon: 'icon-chat-noti-enable',
          iconTheme: theme.jade10,
        })
      } else {
        toast({
          title: <Trans>Notifications Disabled</Trans>,
          description: <Trans>You won't receive updates or alerts.</Trans>,
          status: TOAST_STATUS.SUCCESS,
          typeIcon: 'icon-chat-noti-disable',
          iconTheme: theme.ruby50,
        })
      }
    }
  }, [toast, theme])
  return <NotificationWrapper
    $borderColor={theme.bgT30}
    $borderRadius={44}
  >
    <IconWrapper $isActive={!isNotiEnable} onClick={changeNotiEnable(false)} $isNotiEnable={isNotiEnable}>
      <IconBase className="icon-chat-noti-disable" />
    </IconWrapper>
    <IconWrapper $isActive={isNotiEnable} onClick={changeNotiEnable(true)} $isNotiEnable={isNotiEnable}>
      <IconBase className="icon-chat-noti-enable" />
    </IconWrapper>
    <MockBg $isNotiEnable={isNotiEnable}></MockBg>
  </NotificationWrapper>
}
