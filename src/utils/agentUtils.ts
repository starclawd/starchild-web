import { AgentThreadInfo, RecentChat } from 'store/agenthub/agenthub'

/**
 * 将API响应的任务数据转换为AgentThreadInfo格式
 * @param responseTaskInfo API响应中的单个任务数据
 * @returns 转换后的AgentThreadInfo对象
 */
export function convertApiTaskToAgentThreadInfo(responseTaskInfo: any): AgentThreadInfo {
  // 解析tags字符串
  let tags: string[] = []
  if (responseTaskInfo.tags) {
    try {
      tags = JSON.parse(responseTaskInfo.tags)
    } catch (error) {
      console.warn('Failed to parse tags:', responseTaskInfo.tags, error)
      tags = []
    }
  }

  // 转换trigger_history为recentChats
  const recentChats: RecentChat[] =
    responseTaskInfo.trigger_history?.map((trigger: any) => ({
      error: trigger.error,
      message: trigger.message,
      triggerTime: trigger.trigger_time,
    })) || []

  return {
    threadId: responseTaskInfo.task_id,
    title: responseTaskInfo.title,
    description: responseTaskInfo.description,
    creator: responseTaskInfo.user_name,
    subscriberCount: responseTaskInfo.subscriber_count || 6666, // TODO: 后端提供真实数据后移除默认值
    avatar: responseTaskInfo.user_avatar,
    type: responseTaskInfo.category,
    threadImageUrl: responseTaskInfo.thread_image_url, // TODO: 后端提供真实数据后移除undefined
    stats: undefined, // TODO: 后端提供真实数据后实现
    tags,
    recentChats,
    tokenInfo: undefined, // TODO: 后端提供真实数据后实现
    kolInfo: undefined, // TODO: 后端提供真实数据后实现
  }
}

/**
 * 批量转换API响应的任务数据列表
 * @param responseTaskInfoList API响应中的任务数据列表
 * @returns 转换后的AgentThreadInfo数组
 */
export function convertApiTaskListToAgentThreadInfoList(responseTaskInfoList: any[]): AgentThreadInfo[] {
  return responseTaskInfoList.map(convertApiTaskToAgentThreadInfo)
}
