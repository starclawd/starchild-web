import { memo } from 'react'
import Modal from 'components/Modal'
import { AgentCardProps } from 'store/agenthub/agenthub'
import AgentCardDetail from '../AgentCardDetail'
import { useIsMobile } from 'store/application/hooks'
import BottomSheet from 'components/BottomSheet'
import { vm } from 'pages/helper'

interface AgentCardDetailModalProps extends AgentCardProps {
  isOpen: boolean
  onClose: () => void
  onSubscription?: () => void
}

export default memo(function AgentCardDetailModal({
  id,
  agentId,
  types,
  agentImageUrl: threadImageUrl,
  isOpen,
  onClose,
  title,
  description,
  creator,
  subscriberCount,
  avatar,
  tags,
  recentChats,
  onSubscription,
}: AgentCardDetailModalProps) {
  const isMobile = useIsMobile()
  return isMobile ? (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      hideDragHandle={true}
      hideClose={false}
      rootStyle={{ overflowY: 'hidden', height: `calc(100vh - ${vm(44)})` }}
    >
      <AgentCardDetail
        id={id}
        agentId={agentId}
        types={types}
        agentImageUrl={threadImageUrl}
        title={title}
        description={description}
        creator={creator}
        subscriberCount={subscriberCount}
        avatar={avatar}
        tags={tags}
        recentChats={recentChats}
        onSubscription={onSubscription}
      />
    </BottomSheet>
  ) : (
    <Modal isOpen={isOpen} onDismiss={onClose} hideClose={false} contentStyle={{ overflowY: 'hidden' }}>
      <AgentCardDetail
        id={id}
        agentId={agentId}
        types={types}
        agentImageUrl={threadImageUrl}
        title={title}
        description={description}
        creator={creator}
        subscriberCount={subscriberCount}
        avatar={avatar}
        tags={tags}
        recentChats={recentChats}
        onSubscription={onSubscription}
      />
    </Modal>
  )
})
