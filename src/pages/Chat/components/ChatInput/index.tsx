import styled, { css } from 'styled-components'
import { memo, useCallback, useMemo } from 'react'
import { useChatTabIndex, useIsAiContentEmpty } from 'store/chat/hooks'
import { vm } from 'pages/helper'
import { useConnectWalletModalToggle } from 'store/application/hooks'
import { Trans } from '@lingui/react/macro'
import CreateStrategy from './components/CreateStrategy'
import Research from './components/Research'
import { useIsLogin, useUserInfo } from 'store/login/hooks'
import { ANI_DURATION } from 'constants/index'
import StrategyInfo from './components/StrategyInfo'
import { ButtonBorder } from 'components/Button'

const ChatInputWrapper = styled.div<{ $isEmpty: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${({ $isEmpty, theme }) =>
    $isEmpty &&
    theme.isMobile &&
    css`
      height: calc(100% - ${vm(44)});
      justify-content: space-between;
    `}
`

const Title = styled.div`
  font-size: 64px;
  font-style: normal;
  font-weight: 250;
  line-height: 68px;
  margin-bottom: 48px;
  white-space: nowrap;
  color: ${({ theme }) => theme.black200};
  span {
    color: ${({ theme }) => theme.white};
    font-weight: 400;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(42)};
    `}
`

const Description = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.black0};
  .login-btn {
    transition: all ${ANI_DURATION}s;
    color: ${({ theme }) => theme.brand100};
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
  }
`

const ChatInputEmptyContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: 0 ${vm(12)};
    `}
`

const WatchDemo = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 32px;
  margin-top: 90px;
`

const ButtonWatchDemo = styled(ButtonBorder)`
  flex-shrink: 0;
  gap: 4px;
  width: 116px;
  height: 32px;
  border-radius: 0;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black200};
  .icon-expand {
    font-size: 18px;
    color: ${({ theme }) => theme.black200};
  }
`

export default memo(function ChatInput() {
  const isLogin = useIsLogin()
  const [{ userName }] = useUserInfo()
  const [chatTabIndex] = useChatTabIndex()
  const isEmpty = useIsAiContentEmpty()
  const toggleConnectWalletModal = useConnectWalletModalToggle()
  const showCreateStrategy = useMemo(() => {
    return chatTabIndex === 0 && isEmpty
  }, [chatTabIndex, isEmpty])

  const handleLogin = useCallback(() => {
    toggleConnectWalletModal()
  }, [toggleConnectWalletModal])

  return (
    <ChatInputWrapper
      $isEmpty={isEmpty}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      {isEmpty && (
        <ChatInputEmptyContent>
          <Title>
            {!userName ? (
              <Trans>
                Welcome to <span>starchild</span>
              </Trans>
            ) : (
              <Trans>
                Welcome, <span>{userName}</span>
              </Trans>
            )}
          </Title>
          <Description>
            <span>
              <Trans>What's the move today?</Trans>
            </span>
            {!isLogin && (
              <span onClick={handleLogin} className='login-btn'>
                <Trans>Login</Trans>
              </span>
            )}
          </Description>
        </ChatInputEmptyContent>
      )}
      {showCreateStrategy ? <CreateStrategy /> : <Research />}
      {isEmpty && <StrategyInfo />}
    </ChatInputWrapper>
  )
})
