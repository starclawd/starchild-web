import { AgentInfo, RecentChat } from 'store/agenthub/agenthub'

/**
 * 将API响应的任务数据转换为AgentInfo格式
 * @param responseTaskInfo API响应中的单个任务数据
 * @returns 转换后的AgentInfo对象
 */
export function convertApiTaskToAgentInfo(responseTaskInfo: any): AgentInfo {
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

  // FIXME: 等后端类型一致后修复这块代码
  // 转换trigger_history为recentChats
  const triggerHistory =
    responseTaskInfo.trigger_history instanceof Array
      ? responseTaskInfo.trigger_history
      : JSON.parse(responseTaskInfo.trigger_history)
  const recentChats: RecentChat[] =
    triggerHistory?.map((trigger: any) => ({
      error: trigger.error,
      message: trigger.message,
      triggerTime: trigger.trigger_time,
    })) || []

  return {
    agentId: responseTaskInfo.task_id,
    title: responseTaskInfo.title,
    description: responseTaskInfo.description,
    creator: responseTaskInfo.user_name,
    subscriberCount: responseTaskInfo.subscription_user_count,
    avatar: responseTaskInfo.user_avatar,
    type: responseTaskInfo.category,
    agentImageUrl: responseTaskInfo.thread_image_url, // TODO: 后端提供真实数据后移除undefined
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
export function convertApiTaskListToAgentInfoList(responseTaskInfoList: any[]): AgentInfo[] {
  return responseTaskInfoList.map(convertApiTaskToAgentInfo)
}
