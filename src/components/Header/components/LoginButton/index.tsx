import { Trans } from '@lingui/react/macro'
import Avatar from 'boring-avatars'
import { IconBase } from 'components/Icons'
import Select, { TriggerMethod } from 'components/Select'
import { useCallback, useMemo } from 'react'
import { useIsLogin, useUserInfo } from 'store/login/hooks'
import { useAuthToken } from 'store/logincache/hooks'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import {
  useAccountManegeModalToggle,
  useCurrentRouter,
  useIsMobile,
  useIsShowMobileMenu,
  usePreferenceModalToggle,
} from 'store/application/hooks'
import { useWindowSize } from 'hooks/useWindowSize'
import { MOBILE_DESIGN_WIDTH } from 'constants/index'
import { ROUTER } from 'pages/router'

const AvatarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: ${({ theme }) => theme.textL1};
  cursor: pointer;
  .select-border-wrapper {
    padding: 0;
    border: none;
  }
  .avatar-img {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(40)};
      height: ${vm(40)};
      font-size: 0.12rem;
      line-height: 0.16rem;
    `}
`

const LoginWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px dashed ${({ theme }) => theme.brand200};
  .icon-user-login {
    font-size: 32px;
    color: ${({ theme }) => theme.brand200};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      .icon-user-login {
        font-size: 0.32rem;
      }
    `}
`

const Customise = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
  i {
    font-size: 18px;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.14rem;
      line-height: 0.2rem;
      i {
        font-size: 0.18rem;
      }
    `}
`

const Preference = styled(Customise)``

const Logout = styled(Customise)`
  color: ${({ theme }) => theme.red100};
`

export default function LoginButton() {
  const theme = useTheme()
  const isLogin = useIsLogin()
  const isMobile = useIsMobile()
  const { width } = useWindowSize()
  const [, setAuthToken] = useAuthToken()
  const [, setCurrentRouter] = useCurrentRouter()
  const [, setIsShowMobileMenu] = useIsShowMobileMenu()
  const togglePreferenceModal = usePreferenceModalToggle()
  const toggleAccountManegeModal = useAccountManegeModalToggle()
  const [{ userName, userAvatar }] = useUserInfo()
  const logout = useCallback(() => {
    setAuthToken('')
    window.location.href = '/'
  }, [setAuthToken])
  const selectList = useMemo(() => {
    return [
      {
        key: 'Account',
        text: (
          <Preference>
            <IconBase className='icon-customize-avatar' />
            <Trans>Account</Trans>
          </Preference>
        ),
        value: 'Account',
        clickCallback: () => {
          toggleAccountManegeModal()
          setIsShowMobileMenu(false)
        },
      },
      {
        key: 'Preferences',
        text: (
          <Preference>
            <IconBase className='icon-preference' />
            <Trans>Preferences</Trans>
          </Preference>
        ),
        value: 'Preferences',
        clickCallback: () => {
          togglePreferenceModal()
          setIsShowMobileMenu(false)
        },
      },
      {
        key: 'Logout',
        text: (
          <Logout>
            <IconBase className='icon-logout' />
            <Trans>Logout</Trans>
          </Logout>
        ),
        value: 'Logout',
        clickCallback: logout,
      },
    ]
  }, [logout, setIsShowMobileMenu, toggleAccountManegeModal, togglePreferenceModal])

  const goHomePage = useCallback(() => {
    setCurrentRouter(`${ROUTER.HOME}?login=1`)
  }, [setCurrentRouter])
  return (
    <AvatarWrapper>
      {isLogin ? (
        <Select
          usePortal
          hideExpand
          offsetLeft={8}
          offsetTop={8}
          triggerMethod={TriggerMethod.CLICK}
          placement='top-end'
          value=''
          dataList={selectList}
          popItemHoverBg={theme.bgT20}
          borderWrapperBg='transparent'
          popStyle={{
            width: isMobile ? vm(160) : '160px',
            boxShadow: 'none',
          }}
        >
          {userAvatar ? (
            <img className='avatar-img' src={userAvatar} alt='avatar' />
          ) : (
            <Avatar
              name={userName || ''}
              size={isMobile ? (40 / MOBILE_DESIGN_WIDTH) * (width || MOBILE_DESIGN_WIDTH) : 40}
            />
          )}
        </Select>
      ) : (
        <LoginWrapper onClick={goHomePage}>
          <IconBase className='icon-user-login' />
        </LoginWrapper>
      )}
    </AvatarWrapper>
  )
}
