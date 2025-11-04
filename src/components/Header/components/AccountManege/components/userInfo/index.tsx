import { Trans } from '@lingui/react/macro'
import Avatar from 'boring-avatars'
import { vm } from 'pages/helper'
import { useEditNicknameModalToggle } from 'store/application/hooks'
import { useUserInfo } from 'store/login/hooks'
import styled, { css } from 'styled-components'
import Icon from '../Icon'
import useCopyContent from 'hooks/useCopyContent'
import { useCallback } from 'react'

const UserInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
    `}
`

const RightContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
    `}
`

const UserName = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
      font-size: 0.18rem;
      line-height: 0.26rem;
    `}
`

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Uid = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  > span {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL3};
    span {
      color: ${({ theme }) => theme.textL1};
    }
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      > span {
        font-size: 0.14rem;
        line-height: 0.2rem;
      }
    `}
`

const Primay = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  height: 20px;
  padding: 0 6px;
  gap: 4px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  border-radius: 20px;
  background: ${({ theme }) => theme.text20};
  span:first-child {
    color: ${({ theme }) => theme.textL3};
  }
  span:last-child {
    color: ${({ theme }) => theme.textL1};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(20)};
      padding: 0 ${vm(6)};
      font-size: 0.12rem;
      line-height: 0.18rem;
      border-radius: ${vm(20)};
    `}
`

export default function UserInfo() {
  const { copyRawContent } = useCopyContent()
  const [{ telegramUserName, userInfoId }] = useUserInfo()
  const toggleEditNicknameModal = useEditNicknameModalToggle()
  const handleCopyUserId = useCallback(() => {
    copyRawContent(userInfoId)
  }, [copyRawContent, userInfoId])
  return (
    <UserInfoWrapper>
      <Avatar size={40} name={telegramUserName} />
      <RightContent>
        <UserName>
          <span>{telegramUserName}</span>
          <Icon iconName='icon-edit' onClick={toggleEditNicknameModal} />
        </UserName>
        <Bottom>
          <Uid>
            <span>
              <Trans>User ID</Trans>: <span>{userInfoId?.toString().padStart(8, '0')}</span>
            </span>
            <Icon iconName='icon-chat-copy' onClick={handleCopyUserId} />
          </Uid>
          <Primay>
            <span>
              <Trans>Primary</Trans>:
            </span>
            <span>Google</span>
          </Primay>
        </Bottom>
      </RightContent>
    </UserInfoWrapper>
  )
}
