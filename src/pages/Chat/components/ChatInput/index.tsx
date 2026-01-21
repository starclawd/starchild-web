import styled, { css } from 'styled-components'
import { memo, useCallback, useMemo } from 'react'
import { useIsAiContentEmpty } from 'store/chat/hooks'
import { useConnectWalletModalToggle, useEditNicknameModalToggle } from 'store/application/hooks'
import { Trans } from '@lingui/react/macro'
import CreateStrategy from './components/CreateStrategy'
import { useIsLogin, useUserInfo } from 'store/login/hooks'
import { ANI_DURATION } from 'constants/index'
import StrategyInfo from './components/StrategyInfo'
import { ButtonBorder } from 'components/Button'
import { IconBase } from 'components/Icons'

const ChatInputWrapper = styled.div<{ $isEmpty: boolean }>`
  position: relative;
  display: flex;
  justify-content: center;
  gap: 20px;
`

const ChatInputEmptyContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 340px;
  gap: 32px;
`

const InputContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 720px;
  gap: 12px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.black600};
  background: ${({ theme }) => theme.black1000};
`

const Title = styled.div<{ $isUserName: boolean }>`
  display: flex;
  align-items: center;
  .title-text {
    font-size: 71.02px;
    font-style: normal;
    font-weight: 400;
    line-height: 114%;
    color: ${({ theme }) => theme.black0};
  }
  .title-user-name {
    font-size: 71.02px;
    font-style: normal;
    font-weight: 250;
    line-height: 114%;
    color: ${({ theme }) => theme.black200};
  }
  &:hover {
    .edit-button {
      opacity: 1;
    }
  }
  ${({ $isUserName }) =>
    $isUserName &&
    css`
      cursor: pointer;
    `}
`

const UserName = styled.span<{ $fontSize: number }>`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: ${({ $fontSize }) => $fontSize}px;
  font-style: normal;
  line-height: 114%;
  font-weight: 400;
  color: ${({ theme }) => theme.black0};
`

const EditButton = styled(ButtonBorder)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-left: 12px;
  opacity: 0;
  border: 1px solid ${({ theme }) => theme.black700};
`

const Description = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
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

export default memo(function ChatInput() {
  const isLogin = useIsLogin()
  const [{ userName }] = useUserInfo()
  const isEmpty = useIsAiContentEmpty()
  const toggleEditNicknameModal = useEditNicknameModalToggle()
  const toggleConnectWalletModal = useConnectWalletModalToggle()
  const userNameFontSize = useMemo(() => {
    if (!userName) return 71.02
    // 计算字符宽度：中文2个字符，英文1个字符
    const charWidth = [...userName].reduce((width, char) => {
      // 中文字符范围（CJK统一汉字及扩展）
      const code = char.charCodeAt(0)
      const isChinese = code >= 0x4e00 && code <= 0x9fff
      return width + (isChinese ? 2 : 1)
    }, 0)
    if (charWidth > 12) return 34
    if (charWidth > 8) return 50
    return 71.02
  }, [userName])

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
          <Title $isUserName={!!userName} onClick={userName ? toggleEditNicknameModal : undefined}>
            {!userName ? (
              <span className='title-text'>
                Vibe it.
                <br />
                Trade it.
              </span>
            ) : (
              <span className='title-user-name'>
                <Trans>
                  Welcome,
                  <br />
                  <UserName $fontSize={userNameFontSize}>
                    <span>{userName}</span>
                    {userName && (
                      <EditButton className='edit-button'>
                        <IconBase className='icon-edit' />
                      </EditButton>
                    )}
                  </UserName>
                </Trans>
              </span>
            )}
          </Title>
          <Description>
            <span>
              <Trans>What's the move today?</Trans>
            </span>
            {!isLogin && (
              <span onClick={handleLogin} className='login-btn'>
                <Trans>Log in</Trans>
              </span>
            )}
          </Description>
        </ChatInputEmptyContent>
      )}
      <InputContent>
        <CreateStrategy />
        {isEmpty && <StrategyInfo />}
      </InputContent>
    </ChatInputWrapper>
  )
})
