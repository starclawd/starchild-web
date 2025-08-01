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
import { AGENT_HUB_TYPE } from 'constants/agentHub'

const AgentCardDetailWrapper = styled.div`
  position: relative;
  border-radius: 32px;
  width: 580px;
  max-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  background: ${({ theme }) => theme.black800};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
      height: 100%;
      max-height: 100%;
      border-radius: 32px 32px 0 0;
    `}
`

const PlaceHolder = styled.div`
  height: 56px;
  flex-shrink: 0;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(56)};
    `}
`

const AgentImg = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 220px;
  z-index: 1;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.6) 100%);
    z-index: 1;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(160)};
    `}
`

const ScrollArea = styled.div<{ $showBackgroundImage?: boolean }>`
  position: relative;
  padding-top: ${({ $showBackgroundImage }) => ($showBackgroundImage ? '0' : '20px')};
  ${({ theme, $showBackgroundImage }) =>
    theme.isMobile &&
    css`
      padding-top: ${$showBackgroundImage ? 0 : vm(12)};
    `}
`

const ScrollInner = styled.div`
  position: relative;
  z-index: 2;
  background-color: ${({ theme }) => theme.black800};
`

const Header = styled.div<{ $showBackgroundImage?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
  ${({ $showBackgroundImage }) =>
    $showBackgroundImage &&
    css`
      padding-top: 62px;
      .avatar-img {
        position: absolute;
        top: -50px;
      }
    `}
  ${({ theme, $showBackgroundImage }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
      padding-bottom: ${vm(20)};
      ${$showBackgroundImage &&
      css`
        padding-top: ${vm(42)};
        .avatar-img {
          top: -${vm(30)};
        }
      `}
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
      font-size: 0.12rem;
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
      font-size: 0.12rem;
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
      font-size: 0.12rem;
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
      font-size: 0.16rem;
      line-height: 0.24rem;
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
      font-size: 0.18rem;
      line-height: 0.26rem;
    `}
`

const Description = styled.p`
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.12rem;
      line-height: 0.18rem;
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
      font-size: 0.12rem;
      line-height: 0.18rem;
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
      font-size: 0.13rem;
      line-height: 0.2rem;
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

const ChatItem = styled.div<{ $isSingle?: boolean }>`
  flex: ${({ $isSingle }) => ($isSingle ? '0 0 100%' : '0 0 480px')};
  background: ${({ theme }) => theme.bgT20};
  border-radius: 12px;
  padding: 16px;

  .markdown-wrapper {
    display: -webkit-box;
    -webkit-line-clamp: 10;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  ${({ theme, $isSingle }) =>
    theme.isMobile &&
    css`
      flex: ${$isSingle ? '0 0 100%' : `0 0 ${vm(335)}`};
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
      font-size: 0.12rem;
      line-height: 0.18rem;
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

  &:hover {
    opacity: 0.7;
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
  }

  &:hover {
    opacity: 0.7;
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
  types,
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

  const showBackgroundImage = useMemo(() => {
    return !!(
      threadImageUrl &&
      !types.some((type) => type === AGENT_HUB_TYPE.KOL_RADAR || type === AGENT_HUB_TYPE.TOKEN_DEEP_DIVE)
    )
  }, [threadImageUrl, types])

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
      {!showBackgroundImage && <PlaceHolder />}
      <ScrollArea $showBackgroundImage={showBackgroundImage} className='scroll-style'>
        {showBackgroundImage && <AgentImg style={{ backgroundImage: `url(${threadImageUrl})` }} />}
        <ScrollInner>
          <Header $showBackgroundImage={showBackgroundImage}>
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
                    <ChatItem key={index} $isSingle={recentChats.length === 1}>
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
        </ScrollInner>
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
          check_log: [],
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
          categories: [AGENT_HUB_TYPE.INDICATOR],
          display_user_name: '',
          display_user_avatar: '',
          code_description: '',
          generation_msg: '',
          generation_status: GENERATION_STATUS.PENDING,
          workflow: '',
          image_url: '',
        }}
        ref={shareDomRef}
        shareUrl={shareUrl}
      />
    </AgentCardDetailWrapper>
  )
})
