import { Trans } from '@lingui/react/macro'
import Avatar from 'boring-avatars'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { useUserInfo } from 'store/login/hooks'
import styled from 'styled-components'

const UserInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const RightContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
`

const UserName = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
  color: ${({ theme }) => theme.textL1};
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 14px;
  color: ${({ theme }) => theme.textL4};
  cursor: pointer;
  transition: all ${ANI_DURATION}s;
  &:hover {
    color: ${({ theme }) => theme.textL1};
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
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL3};
    span {
      color: ${({ theme }) => theme.textL1};
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
  border-radius: 20px;
  background: ${({ theme }) => theme.text20};
  span:first-child {
    color: ${({ theme }) => theme.textL3};
  }
  span:last-child {
    color: ${({ theme }) => theme.textL1};
  }
`

export default function UserInfo() {
  const [{ telegramUserName, telegramUserId }] = useUserInfo()
  return (
    <UserInfoWrapper>
      <Avatar size={40} name={telegramUserName} />
      <RightContent>
        <UserName>
          <span>{telegramUserName}</span>
          <IconWrapper>
            <IconBase className='icon-edit' />
          </IconWrapper>
        </UserName>
        <Bottom>
          <Uid>
            <span>
              <Trans>User ID</Trans>: <span>{telegramUserId}</span>
            </span>
            <IconWrapper>
              <IconBase className='icon-chat-copy' />
            </IconWrapper>
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
