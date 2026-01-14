import { Trans } from '@lingui/react/macro'
import Avatar from 'boring-avatars'
import { vm } from 'pages/helper'
import { useEditNicknameModalToggle } from 'store/application/hooks'
import { useUserInfo } from 'store/login/hooks'
import styled, { css } from 'styled-components'
import useCopyContent from 'hooks/useCopyContent'
import { useCallback, useMemo } from 'react'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'

const UserInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  gap: 12px;
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
      .user-avatar {
        width: ${vm(40)};
        height: ${vm(40)};
      }
    `}
`

const RightContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  font-style: normal;
  font-weight: 400;
  line-height: 26px;
  color: ${({ theme }) => theme.black0};
  .icon-edit {
    cursor: pointer;
    font-size: 14px;
    transition: all ${ANI_DURATION}s;
    color: ${({ theme }) => theme.black200};
    &:hover {
      color: ${({ theme }) => theme.black0};
    }
  }
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
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.black200};
    span {
      color: ${({ theme }) => theme.black0};
    }
  }
  .icon-copy {
    cursor: pointer;
    font-size: 14px;
    transition: all ${ANI_DURATION}s;
    color: ${({ theme }) => theme.black200};
    &:hover {
      color: ${({ theme }) => theme.black0};
    }
  }
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
  border-radius: 4px;
  background: ${({ theme }) => theme.black400};
  span:first-child {
    color: ${({ theme }) => theme.black100};
  }
  span:last-child {
    color: ${({ theme }) => theme.black0};
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
  const [{ userName, userAvatar, userInfoId, primaryLoginType }] = useUserInfo()
  const toggleEditNicknameModal = useEditNicknameModalToggle()
  const formatUserId = useMemo(() => {
    return userInfoId?.toString().padStart(8, '0')
  }, [userInfoId])
  const handleCopyUserId = useCallback(() => {
    copyRawContent(formatUserId)
  }, [copyRawContent, formatUserId])
  return (
    <UserInfoWrapper>
      {userAvatar ? (
        <img className='user-avatar' src={userAvatar} alt='userAvatar' />
      ) : (
        <Avatar size={40} name={userName} />
      )}
      <RightContent>
        <UserName>
          <span>{userName}</span>
          <IconBase className='icon-edit' onClick={toggleEditNicknameModal} />
        </UserName>
        <Bottom>
          <Uid>
            <span>
              <Trans>User ID</Trans>: <span>{formatUserId}</span>
            </span>
            <IconBase className='icon-copy' onClick={handleCopyUserId} />
          </Uid>
          {/* <Primay>
            <span>
              <Trans>Primary</Trans>:
            </span>
            <span>{primaryLoginType}</span>
          </Primay> */}
        </Bottom>
      </RightContent>
    </UserInfoWrapper>
  )
}
