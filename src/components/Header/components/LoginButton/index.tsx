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
  useConnectWalletModalToggle,
} from 'store/application/hooks'
import { useWindowSize } from 'hooks/useWindowSize'
import { MOBILE_DESIGN_WIDTH } from 'constants/index'
import { ROUTER } from 'pages/router'
import { useDisconnect } from '@reown/appkit/react'
import { ANI_DURATION } from 'constants/index'

const AvatarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: ${({ theme }) => theme.black0};
  cursor: pointer;
  .select-wrapper {
    height: 32px;
  }
  .select-value-wrapper {
    justify-content: center;
  }
  .avatar-img {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(32)};
      height: ${vm(32)};
      font-size: 0.12rem;
      line-height: 0.16rem;
    `}
`

const LoginWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  .icon-menu-login {
    font-size: 32px;
    color: ${({ theme }) => theme.brand100};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      .icon-menu-login {
        font-size: 0.32rem;
      }
    `}
`

const Customise = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 8px;
  gap: 6px;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.black100};
  i {
    transition: all ${ANI_DURATION}s;
    font-size: 18px;
    color: ${({ theme }) => theme.black100};
  }
  &:hover {
    color: ${({ theme }) => theme.black0};
    i {
      color: ${({ theme }) => theme.black0};
    }
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
  i {
    color: ${({ theme }) => theme.red100};
  }
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
  const { disconnect } = useDisconnect()
  const toggleConnectWalletModal = useConnectWalletModalToggle()
  const logout = useCallback(async () => {
    setAuthToken('')
    await disconnect()
    window.location.reload()
  }, [setAuthToken, disconnect])

  const selectList = useMemo(() => {
    return [
      {
        key: 'Account',
        text: (
          <Preference>
            <IconBase className='icon-account' />
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

  const handleLogin = useCallback(() => {
    toggleConnectWalletModal()
  }, [toggleConnectWalletModal])
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
          popItemStyle={{
            padding: '0',
          }}
          popItemTextStyle={{
            width: '100%',
          }}
          dataList={selectList}
        >
          {userAvatar ? (
            <img className='avatar-img' src={userAvatar} alt='avatar' />
          ) : (
            <Avatar
              name={userName || ''}
              size={isMobile ? (24 / MOBILE_DESIGN_WIDTH) * (width || MOBILE_DESIGN_WIDTH) : 24}
            />
          )}
        </Select>
      ) : (
        <LoginWrapper onClick={handleLogin}>
          <IconBase className='icon-menu-login' />
        </LoginWrapper>
      )}
    </AvatarWrapper>
  )
}
