import { Trans } from '@lingui/react/macro'
import Avatar from 'boring-avatars'
import { vm } from 'pages/helper'
import { useEditNicknameModalToggle, useOpenAvatarEditModal } from 'store/application/hooks'
import { useUserInfo } from 'store/login/hooks'
import styled, { css } from 'styled-components'
import useCopyContent from 'hooks/useCopyContent'
import { useCallback, useMemo, useRef } from 'react'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'

const UserInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  gap: 12px;
`

const AvatarWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
  .icon-upload {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 20px;
    color: ${({ theme }) => theme.black0};
    transition: all ${ANI_DURATION}s;
    opacity: 0;
    z-index: 2;
  }
  &:hover {
    .icon-upload {
      opacity: 1;
    }
  }
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

const HiddenInput = styled.input`
  display: none;
`

export default function UserInfo() {
  const { copyRawContent } = useCopyContent()
  const [{ userName, userAvatar, userInfoId, primaryLoginType }] = useUserInfo()
  const toggleEditNicknameModal = useEditNicknameModalToggle()
  const openAvatarEditModal = useOpenAvatarEditModal()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formatUserId = useMemo(() => {
    return userInfoId?.toString().padStart(8, '0')
  }, [userInfoId])
  const handleCopyUserId = useCallback(() => {
    copyRawContent(formatUserId)
  }, [copyRawContent, formatUserId])

  const handleAvatarClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        // 验证文件类型
        if (!file.type.startsWith('image/')) {
          return
        }
        // 验证文件大小（最大 5MB）
        if (file.size > 1 * 1024 * 1024) {
          return
        }
        const reader = new FileReader()
        reader.addEventListener('load', () => {
          const imageSrc = reader.result as string
          openAvatarEditModal(imageSrc)
        })
        reader.readAsDataURL(file)
      }
      // 重置 input 以便可以选择相同的文件
      e.target.value = ''
    },
    [openAvatarEditModal],
  )

  return (
    <UserInfoWrapper>
      <AvatarWrapper onClick={handleAvatarClick}>
        {userAvatar ? (
          <img className='user-avatar' src={userAvatar} alt='userAvatar' />
        ) : (
          <Avatar size={40} name={userName} />
        )}
        <IconBase className='icon-upload' />
      </AvatarWrapper>
      <HiddenInput ref={fileInputRef} type='file' accept='image/*' onChange={handleFileSelect} />
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
