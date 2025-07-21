import styled, { css } from 'styled-components'
import { memo, RefObject, useCallback, useMemo, useRef, useState } from 'react'
import { vm } from 'pages/helper'
import { Trans } from '@lingui/react/macro'
import Modal from 'components/Modal'
import Avatar from 'components/Avatar'
import NoData from 'components/NoData'
import { AgentCardProps } from 'store/agenthub/agenthub'
import { IconBase } from 'components/Icons'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { formatNumber } from 'utils/format'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import Pending from 'components/Pending'
import AgentShare, { useCopyImgAndText } from 'components/AgentShare'
import dayjs from 'dayjs'
import { GENERATION_STATUS, AGENT_STATUS, AGENT_TYPE } from 'store/agentdetail/agentdetail'
import Markdown from 'components/Markdown'
import { useIsAgentSubscribed } from 'store/agenthub/hooks'
import { useIsMobile } from 'store/application/hooks'

const AgentCardDetailWrapper = styled.div`
  background: ${({ theme }) => theme.black700};
  border-radius: 16px;
  width: 580px;
  max-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  overflow-y: hidden;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
      height: 100%;
      max-height: 100%;
      border-radius: 0;
      border-top-left-radius: ${vm(16)};
      border-top-right-radius: ${vm(16)};
    `}
`

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
`

const Header = styled.div<{ $backgroundImage?: string }>`
  padding-top: ${({ $backgroundImage }) => ($backgroundImage ? '180px' : '80px')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
  overflow: hidden;

  ${({ $backgroundImage }) =>
    $backgroundImage &&
    css`
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 25%;
        background-image: url(${$backgroundImage});
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        z-index: 1;
      }

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 25%;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.6) 100%);
        z-index: 1;
      }

      > * {
        position: relative;
        z-index: 2;
      }
    `}

  ${({ theme, $backgroundImage }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
      padding-bottom: ${vm(20)};
      padding-top: ${$backgroundImage ? vm(180) : vm(40)};
    `}
`

const CreatorName = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.textL1};
  display: flex;
  gap: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(12)};
      gap: ${vm(8)};
    `}
`

const CreatorPrefix = styled.span`
  font-size: 12px;
  line-height: 20px;
  color: ${({ theme }) => theme.textL4};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(12)};
    `}
`

const Body = styled.div`
  padding: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(0)} ${vm(12)} ${vm(12)} ${vm(12)};
    `}
`

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  border-radius: 12px;
  gap: 12px;
  margin-bottom: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      border-radius: ${vm(8)};
      gap: ${vm(8)};
      margin-bottom: ${vm(20)};
    `}
`

const StatItem = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: ${({ theme }) => theme.black600};
  border-radius: 12px;
  padding: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
      padding: ${vm(8)};
    `}
`

const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textL3};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(12)};
    `}
`

const StatValue = styled.div`
  font-size: 18px;
  line-height: 26px;
  font-weight: 500;
  color: ${({ theme }) => theme.textL1};
  display: flex;
  align-items: center;

  > i {
    margin-right: 4px;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(16)};
      line-height: ${vm(24)};
    `}
`

const TitleSection = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin-bottom: ${vm(20)};
      gap: ${vm(8)};
    `}
`

const Title = styled.h2`
  font-size: 26px;
  line-height: 34px;
  font-weight: 400;
  margin: 0;
  color: ${({ theme }) => theme.textL1};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(18)};
      line-height: ${vm(26)};
    `}
`

const Description = styled.p`
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(12)};
      line-height: ${vm(18)};
    `}
`

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      column-gap: ${vm(8)};
    `}
`

const Tag = styled.h5`
  color: ${({ theme }) => theme.blue100};
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(12)};
      line-height: ${vm(18)};
    `}
`

const RecentChatsSection = styled.div``

const SectionTitle = styled.p`
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: ${({ theme }) => theme.textL1};
  margin-bottom: 12px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(13)};
      line-height: ${vm(20)};
      margin-bottom: ${vm(12)};
    `}
`

const ChatsContainer = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      padding-bottom: ${vm(8)};
    `}
`

const ChatItem = styled.div`
  flex: 0 0 480px;
  background: ${({ theme }) => theme.bgT20};
  border-radius: 12px;
  padding: 16px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex: 0 0 ${vm(335)};
      border-radius: ${vm(12)};
      padding: ${vm(12)};
    `}
`

const ChatDate = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: ${({ theme }) => theme.textL2};
  margin-bottom: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(12)};
      line-height: ${vm(18)};
      margin-bottom: ${vm(8)};
    `}
`

const ButtonSub = styled(ButtonCommon)`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 50%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  border-radius: 60px;
  background-color: ${({ theme }) => theme.blue200};
  color: ${({ theme }) => theme.textL1};
  .icon-subscription {
    font-size: 18px;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.16rem;
      line-height: 0.24rem;
      height: ${vm(44)};
      gap: ${vm(6)};
      .icon-subscription {
        font-size: 0.18rem;
        color: ${({ theme }) => theme.textL1};
      }
    `}
`

const ButtonShare = styled(ButtonBorder)<{ $isSubscribed: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 50%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  border-radius: 60px;
  color: ${({ theme }) => theme.textL1};
  .icon-chat-share {
    font-size: 18px;
    color: ${({ theme }) => theme.textL1};
  }
  ${({ $isSubscribed }) =>
    $isSubscribed &&
    css`
      width: 100%;
    `}
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.16rem;
      line-height: 0.24rem;
      height: ${vm(44)};
      gap: ${vm(6)};
      .icon-chat-share {
        font-size: 0.18rem;
      }
      .pending-wrapper {
        .icon-loading {
          font-size: 0.18rem !important;
        }
      }
    `}
`

const NoDataWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(40)} 0;
    `}
`

const Operator = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 8px 20px 20px 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      padding: ${vm(8)} ${vm(20)};
    `}
`

interface AgentCardDetailProps extends AgentCardProps {
  onSubscription?: () => void
}

export default memo(function AgentCardDetail({
  agentId: threadId,
  type,
  agentImageUrl: threadImageUrl,
  title,
  description,
  creator,
  subscriberCount,
  avatar,
  tags,
  recentChats,
  onSubscription,
}: AgentCardDetailProps) {
  const isMobile = useIsMobile()
  const scrollRef = useScrollbarClass<HTMLDivElement>()
  const shareDomRef = useRef<HTMLDivElement>(null)
  const [isCopyLoading, setIsCopyLoading] = useState(false)
  const copyImgAndText = useCopyImgAndText()
  const isSubscribed = useIsAgentSubscribed(threadId)
  const shareUrl = useMemo(() => {
    return `${window.location.origin}/agentdetail?agentId=${threadId}`
  }, [threadId])

  const handleSubscription = () => {
    onSubscription?.()
  }

  // Format timestamp to date string
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return ''
    return dayjs.tz(timestamp).format('YYYY-MM-DD HH:mm:ss')
  }

  const shareImg = useCallback(() => {
    copyImgAndText({
      shareUrl,
      shareDomRef: shareDomRef as RefObject<HTMLDivElement>,
      setIsCopyLoading,
    })
  }, [shareUrl, shareDomRef, copyImgAndText, setIsCopyLoading])

  return (
    <AgentCardDetailWrapper>
      <ScrollArea className='scroll-style' ref={scrollRef}>
        <Header $backgroundImage={threadImageUrl}>
          <Avatar name={creator} size={isMobile ? 60 : 100} avatar={avatar} />
          <CreatorName>
            <CreatorPrefix>
              <Trans>Created by</Trans>
            </CreatorPrefix>
            {creator}
          </CreatorName>
        </Header>
        <Body>
          <StatsContainer>
            <StatItem>
              <StatLabel>
                <Trans>Subscribers</Trans>
              </StatLabel>

              <StatValue>
                <IconBase className='icon-subscription' />
                {formatNumber(subscriberCount)}
              </StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>
                <Trans>Triggered</Trans>
              </StatLabel>
              <StatValue> {formatNumber(recentChats?.length || 0)}</StatValue>
            </StatItem>
          </StatsContainer>

          <TitleSection>
            <Title>{title}</Title>
            <Description>{description}</Description>
            {tags && tags.length > 0 && (
              <TagsContainer>
                {tags.map((tag, index) => (
                  <Tag key={index}>#{tag}</Tag>
                ))}
              </TagsContainer>
            )}
          </TitleSection>

          <RecentChatsSection>
            <SectionTitle>
              <Trans>Recent chats:</Trans>
            </SectionTitle>
            {recentChats && recentChats.length > 0 ? (
              <ChatsContainer className='scroll-style' ref={scrollRef}>
                {recentChats.slice(0, 10).map((chat, index) => (
                  <ChatItem key={index}>
                    <ChatDate>{formatDate(chat.triggerTime)}</ChatDate>
                    {chat.message && <Markdown>{chat.message}</Markdown>}
                  </ChatItem>
                ))}
              </ChatsContainer>
            ) : (
              <NoDataWrapper>
                <NoData />
              </NoDataWrapper>
            )}
          </RecentChatsSection>
        </Body>
      </ScrollArea>
      <Operator>
        {!isSubscribed && (
          <ButtonSub onClick={handleSubscription}>
            <IconBase className='icon-subscription' />
            <Trans>Subscribe</Trans>
          </ButtonSub>
        )}
        <ButtonShare $isSubscribed={isSubscribed} onClick={shareImg}>
          {isCopyLoading ? (
            <Pending />
          ) : (
            <>
              <IconBase className='icon-chat-share' />
              <Trans>Share</Trans>
            </>
          )}
        </ButtonShare>
      </Operator>
      <AgentShare
        agentDetailData={{
          task_id: threadId,
          user_id: creator,
          task_type: AGENT_TYPE.AI_TASK,
          description,
          code: '',
          trigger_time: 0,
          status: AGENT_STATUS.PENDING,
          created_at: 0,
          updated_at: 0,
          interval: 0,
          last_checked_at: 0,
          trigger_type: '',
          subscription_user_count: subscriberCount,
          user_name: creator,
          condition_mode: '',
          trigger_history:
            recentChats?.map((chat) => ({
              error: chat.error || '',
              message: chat.message || '',
              trigger_time: chat.triggerTime || 0,
            })) || [],
          tokens: '',
          title,
          user_avatar: avatar ?? '',
          id: 0,
          tags: '',
          category: '',
          display_user_name: '',
          display_user_avatar: '',
          code_description: '',
          generation_msg: '',
          generation_status: GENERATION_STATUS.PENDING,
          workflow: '',
        }}
        ref={shareDomRef}
        shareUrl={shareUrl}
      />
    </AgentCardDetailWrapper>
  )
})
