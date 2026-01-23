import { Trans } from '@lingui/react/macro'
import Avatar from 'boring-avatars'
import { IconBase } from 'components/Icons'
import Select, { TriggerMethod } from 'components/Select'
import { useCallback, useMemo } from 'react'
import { useIsLogin, useLogout, useUserInfo } from 'store/login/hooks'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import {
  useAccountManegeModalToggle,
  useIsMobile,
  useIsShowMobileMenu,
  usePreferenceModalToggle,
  useConnectWalletModalToggle,
} from 'store/application/hooks'
import { useWindowSize } from 'hooks/useWindowSize'
import { MOBILE_DESIGN_WIDTH } from 'constants/index'
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
  border-radius: 4px;
  transition: all ${ANI_DURATION}s;
  background-color: transparent;
  .select-wrapper {
    height: 32px;
  }
  .select-value-wrapper {
    justify-content: center;
  }
  .avatar-img {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    object-fit: cover;
  }
  &:hover {
    background-color: ${({ theme }) => theme.black700};
  }
`

const LoginWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  .icon-menu-login {
    font-size: 20px;
    color: ${({ theme }) => theme.brand100};
  }
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
  const isLogin = useIsLogin()
  const isMobile = useIsMobile()
  const { width } = useWindowSize()
  const [, setIsShowMobileMenu] = useIsShowMobileMenu()
  const togglePreferenceModal = usePreferenceModalToggle()
  const toggleAccountManegeModal = useAccountManegeModalToggle()
  const [{ userName, userAvatar }] = useUserInfo()
  const toggleConnectWalletModal = useConnectWalletModalToggle()
  const logout = useLogout()

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
    <AvatarWrapper onClick={isLogin ? toggleAccountManegeModal : handleLogin}>
      {isLogin ? (
        userAvatar ? (
            <img className='avatar-img' src={userAvatar} alt='avatar' />
          ) : (
            <Avatar
              name={userName || ''}
              size={isMobile ? (24 / MOBILE_DESIGN_WIDTH) * (width || MOBILE_DESIGN_WIDTH) : 24}
            />
          )
      ) : (
        <LoginWrapper>
          <IconBase className='icon-menu-login' />
        </LoginWrapper>
      )}
    </AvatarWrapper>
  )
}
