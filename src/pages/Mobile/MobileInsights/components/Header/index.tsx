import styled, { css } from 'styled-components'
import { IconBase } from 'components/Icons'
import { Trans } from '@lingui/react/macro'
import { useCallback, useState } from 'react'
import { useTheme } from 'store/themecache/hooks'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import { BorderAllSide1PxBox } from 'theme/borderStyled'

const HeaderWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 0 ${vm(12)};
`

const TopOperator = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  ${({ theme}) =>
    theme.isMobile &&
    css`
      align-items: center;
      justify-content: space-between;
      padding: ${vm(8)};
      height: ${vm(60)};
      border-radius: ${vm(36)};
      background-color: ${({ theme }) => theme.bgL1};
      span {
        font-size: 0.16rem;
        font-weight: 500;
        line-height: 0.24rem;
        color: ${({ theme }) => theme.textL1};
      }
    `
  }
`

const ShowHistoryIcon = styled.div`
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(88)};
    height: ${vm(44)};
  `}
`
const NotificationWrapper = styled(BorderAllSide1PxBox)`
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(88)};
    height: ${vm(44)};
    padding: ${vm(3)};
    gap: ${vm(8)};
  `}
`

const IconWrapper = styled.div<{ $isNotiEnable: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  ${({ theme, $isNotiEnable }) => theme.isMobile && css`
    width: ${vm(36)};
    height: ${vm(36)};
    border-radius: 50%;
    .icon-chat-noti-disable,
    .icon-chat-noti-enable {
      font-size: .24rem;
      transition: color ${ANI_DURATION}s;
    }
    ${!$isNotiEnable
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
  `}
`

const MockBg = styled.div<{ $isNotiEnable: boolean }>`
  position: absolute;
  background-color: ${({ theme }) => theme.sfC2};
  ${({ theme, $isNotiEnable }) => theme.isMobile && css`
    left: ${vm(3)};
    top: ${vm(3)};
    width: ${vm(36)};
    height: ${vm(36)};
    border-radius: 50%;
    transition: left ${ANI_DURATION}s;
    ${$isNotiEnable && css`
      left: ${vm(47)};
    `}
  `}
`
export default function Header() {
  const theme = useTheme()
  const [isNotiEnable, setIsNotiEnable] = useState(false)
  const changeNotiEnable = useCallback((status: boolean) => {
    return () => {
      setIsNotiEnable(status)
    }
  }, [])
  return <HeaderWrapper>
    <TopOperator>
      <ShowHistoryIcon>
      </ShowHistoryIcon>
      <span><Trans>Insights</Trans></span>
      <NotificationWrapper
        $borderColor={theme.bgT30}
        $borderRadius={44}
      >
        <IconWrapper onClick={changeNotiEnable(false)} $isNotiEnable={isNotiEnable}>
          <IconBase className="icon-chat-noti-disable" />
        </IconWrapper>
        <IconWrapper onClick={changeNotiEnable(true)} $isNotiEnable={isNotiEnable}>
          <IconBase className="icon-chat-noti-enable" />
        </IconWrapper>
        <MockBg $isNotiEnable={isNotiEnable}></MockBg>
      </NotificationWrapper>
    </TopOperator>
  </HeaderWrapper>
}
