import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { AgentCardProps, RecentChat } from 'store/agenthub/agenthub'

/**
 * 将 AgentDetailDataType 转换为 AgentCardProps 格式
 * @param agentDetail AgentDetailDataType 对象
 * @returns 转换后的 AgentCardProps 对象
 */
export function convertAgentDetailToCardProps(agentDetail: AgentDetailDataType): AgentCardProps {
  // Convert trigger_history to recentChats
  const recentChats: RecentChat[] =
    agentDetail.trigger_history?.map((trigger) => ({
      error: trigger.error,
      message: trigger.message,
      triggerTime: trigger.trigger_time,
    })) || []

  // Parse tags if it's a string
  const parsedTags =
    typeof agentDetail.tags === 'string'
      ? agentDetail.tags
        ? agentDetail.tags.split(',').map((tag) => tag.trim())
        : []
      : agentDetail.tags || []

  return {
    id: agentDetail.id.toString(),
    agentId: agentDetail.task_id,
    title: agentDetail.title,
    description: agentDetail.description,
    creator: agentDetail.display_user_name || agentDetail.user_name,
    subscriberCount: agentDetail.subscription_user_count,
    avatar: agentDetail.display_user_avatar || agentDetail.user_avatar,
    types: agentDetail.categories,
    agentImageUrl: agentDetail.image_url === '' ? undefined : agentDetail.image_url,
    stats: undefined, // AgentDetailDataType doesn't have stats field
    tags: parsedTags,
    recentChats,
    tokenInfo: undefined, // AgentDetailDataType doesn't have tokenInfo
    kolInfo: undefined, // AgentDetailDataType doesn't have kolInfo
  }
}

/**
 * 批量转换 AgentDetailDataType 数组为 AgentCardProps 数组
 * @param agentDetailList AgentDetailDataType 数组
 * @returns 转换后的 AgentCardProps 数组
 */
export function convertAgentDetailListToCardPropsList(agentDetailList: AgentDetailDataType[]): AgentCardProps[] {
  return agentDetailList.map(convertAgentDetailToCardProps)
}
