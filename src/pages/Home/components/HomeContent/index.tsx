import { useCallback, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import AccessButton from './components/AccessButton'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useIsLogin } from 'store/login/hooks'
import NftMintAndBind from './components/NftMintAndBind'
import { IconBase } from 'components/Icons'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { useSocialLoginModalToggle } from 'store/application/hooks'

const HomeContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const TelegramAccountText = styled.div`
  margin-top: 20px;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black200};
  cursor: pointer;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    color: ${({ theme }) => theme.black100};
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.13rem;
      line-height: 0.2rem;
      gap: ${vm(4)};
      margin-top: ${vm(16)};
    `}
`

const ArrowIcon = styled(IconBase)`
  font-size: 18px;
  transform: rotate(180deg);
  color: inherit;
`

export default function HomeContent() {
  const isLogin = useIsLogin()
  const toggleSocialAccountModal = useSocialLoginModalToggle()

  const handleSocialAccountModalClick = useCallback(() => {
    toggleSocialAccountModal()
  }, [toggleSocialAccountModal])

  if (!isLogin) {
    return (
      <HomeContentWrapper>
        <AccessButton />
        <TelegramAccountText onClick={handleSocialAccountModalClick}>
          <Trans>Don't have a Telegram account?</Trans>
          <ArrowIcon className='icon-chat-back' />
        </TelegramAccountText>
      </HomeContentWrapper>
    )
  }
  return (
    <HomeContentWrapper>
      <NftMintAndBind />
    </HomeContentWrapper>
  )
}
