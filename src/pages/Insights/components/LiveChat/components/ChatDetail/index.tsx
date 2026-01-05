import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { useIsMobile } from 'store/application/hooks'
import { useCurrentLiveChatData, useIsExpandedLiveChat } from 'store/insights/hooks/useLiveChatHooks'
import styled, { css } from 'styled-components'
import ChatItem from '../ChatItem'
import Divider from 'components/Divider'
import { useTheme } from 'store/themecache/hooks'
import { vm } from 'pages/helper'

const ChatDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 12px 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)};
    `}
`

const TabWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  height: 40px;
  span {
    width: 100%;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 26px;
    color: ${({ theme }) => theme.black100};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(48)};
      margin-bottom: ${vm(12)};
      span {
        text-align: center;
        font-size: 0.18rem;
        line-height: 0.26rem;
      }
    `}
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  .icon-chat-delete {
    font-size: 24px;
    transition: all ${ANI_DURATION}s;
    color: ${({ theme }) => theme.black200};
  }
  &:hover {
    .icon-chat-delete {
      color: ${({ theme }) => theme.black0};
    }
  }
`

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

export default function ChatDetail() {
  const theme = useTheme()
  const isMobile = useIsMobile()
  const [, setIsExpandedLiveChat] = useIsExpandedLiveChat()
  const [currentLiveChatData] = useCurrentLiveChatData()
  return (
    <ChatDetailWrapper>
      <TabWrapper>
        <span>
          <Trans>AI chat</Trans>
        </span>
        {!isMobile && (
          <IconWrapper onClick={() => setIsExpandedLiveChat(false)}>
            <IconBase className='icon-chat-delete' />
          </IconWrapper>
        )}
      </TabWrapper>
      {!isMobile && <Divider color={theme.black800} paddingVertical={20} />}
      <ContentWrapper className='scroll-style'>
        {currentLiveChatData &&
          [currentLiveChatData].map((item) => <ChatItem isChatDetail key={item.msg_id} data={item} />)}
      </ContentWrapper>
    </ChatDetailWrapper>
  )
}
