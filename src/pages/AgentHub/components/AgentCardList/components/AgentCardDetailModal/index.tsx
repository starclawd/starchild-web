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
import TaskShare, { useCopyImgAndText } from 'components/TaskShare'
import dayjs from 'dayjs'
import { useTaskDetail } from 'store/backtest/hooks'
import { TASK_STATUS, TASK_TYPE } from 'store/backtest/backtest'
import Markdown from 'components/Markdown'

const ModalWrapper = styled.div`
  background: ${({ theme }) => theme.black700};
  border-radius: 16px;
  width: 600px;
  height: 750px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
      height: 100%;
      max-height: 100vh;
      border-radius: 0;
      border-top-left-radius: ${vm(16)};
      border-top-right-radius: ${vm(16)};
    `}
`

const Header = styled.div`
  padding: 80px 20px 12px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(24)} ${vm(24)} 0;
      gap: ${vm(16)};
      padding-bottom: ${vm(16)};
    `}
`

const CreatorName = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(18)};
    `}
`

const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  max-height: 500px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(24)};
      max-height: ${vm(400)};
    `}
`

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 24px;
  border-radius: 12px;
  gap: 12px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin-bottom: ${vm(24)};
      padding: ${vm(20)};
      border-radius: ${vm(12)};
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
      gap: ${vm(8)};
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

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(18)};
    `}
`

const StatIcon = styled.span`
  font-size: 19px;
  margin-right: 4px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(19)};
    `}
`

const TitleSection = styled.div`
  margin-bottom: 24px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin-bottom: ${vm(24)};
    `}
`

const Title = styled.h2`
  font-size: 26px;
  line-height: 34px;
  color: ${({ theme }) => theme.textL1};
  margin-bottom: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(20)};
      margin-bottom: ${vm(8)};
    `}
`

const Description = styled.p`
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(14)};
    `}
`

const TagsSection = styled.div`
  margin-bottom: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin-bottom: ${vm(20)};
    `}
`

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
    `}
`

const Tag = styled.h5`
  color: ${({ theme }) => theme.blue100};
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(13)};
      line-height: 20px;
    `}
`

const RecentChatsSection = styled.div`
  margin-bottom: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin-bottom: ${vm(24)};
    `}
`

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin-bottom: 16px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(16)};
      margin-bottom: ${vm(16)};
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
      gap: ${vm(16)};
      padding-bottom: ${vm(8)};
    `}
`

const ChatItem = styled.div`
  flex: 0 0 300px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 12px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.lineDark8};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex: 0 0 ${vm(280)};
      border-radius: ${vm(12)};
      padding: ${vm(16)};
    `}
`

const ChatDate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textL2};
  margin-bottom: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(10)};
      margin-bottom: ${vm(8)};
    `}
`

const ChatContent = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textL2};
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(12)};
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
      gap: ${vm(12)};
      padding: ${vm(20)};
    `}
`

interface AgentCardDetailModalProps extends AgentCardProps {
  isOpen: boolean
  onClose: () => void
  onSubscription?: () => void
  onShare?: () => void
}

export default memo(function AgentCardDetailModal({
  threadId,
  isOpen,
  onClose,
  title,
  description,
  creator,
  subscribed,
  subscriberCount,
  avatar,
  tags,
  recentChats,
  onSubscription,
  onShare,
}: AgentCardDetailModalProps) {
  const scrollRef = useScrollbarClass<HTMLDivElement>()
  const shareDomRef = useRef<HTMLDivElement>(null)
  const [isCopyLoading, setIsCopyLoading] = useState(false)
  const copyImgAndText = useCopyImgAndText()
  const shareUrl = useMemo(() => {
    return `${window.location.origin}/taskdetail?taskId=${threadId}`
  }, [threadId])

  const handleSubscription = () => {
    onSubscription?.()
  }

  const handleShare = () => {
    onShare?.()
  }

  // Format timestamp to date string
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return ''
    return dayjs.tz(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')
  }

  const shareImg = useCallback(() => {
    copyImgAndText({
      shareUrl,
      shareDomRef: shareDomRef as RefObject<HTMLDivElement>,
      setIsCopyLoading,
    })
  }, [shareUrl, shareDomRef, copyImgAndText, setIsCopyLoading])

  return (
    <Modal isOpen={isOpen} onDismiss={onClose} hideClose={false} contentStyle={{ overflowY: 'hidden' }}>
      <ModalWrapper>
        <Header>
          <Avatar name={creator} size={100} avatar={avatar} />
          <CreatorName>{creator}</CreatorName>
        </Header>

        <Body className='scroll-style' ref={scrollRef}>
          <StatsContainer>
            <StatItem>
              <StatLabel>
                <Trans>Subscribers</Trans>
              </StatLabel>

              <StatValue>
                <StatIcon>
                  <IconBase className='icon-subscription' />
                </StatIcon>
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
          </TitleSection>

          {tags && tags.length > 0 && (
            <TagsSection>
              <TagsContainer>
                {tags.map((tag, index) => (
                  <Tag key={index}>#{tag}</Tag>
                ))}
              </TagsContainer>
            </TagsSection>
          )}

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

        <Operator>
          {!subscribed && (
            <ButtonSub onClick={handleSubscription}>
              <IconBase className='icon-subscription' />
              <Trans>Subscribe</Trans>
            </ButtonSub>
          )}
          <ButtonShare $isSubscribed={subscribed} onClick={shareImg}>
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
        <TaskShare
          taskDetail={{
            task_id: threadId,
            user_id: creator,
            task_type: TASK_TYPE.AI_TASK,
            description,
            code: '',
            trigger_time: 0,
            status: TASK_STATUS.PENDING,
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
          }}
          ref={shareDomRef}
          shareUrl={shareUrl}
        />
      </ModalWrapper>
    </Modal>
  )
})
