import { AGENT_HUB_TYPE } from 'constants/agentHub'
import { AgentInfo, RecentChat } from 'store/agenthub/agenthub'

/**
 * 将API响应的任务数据转换为AgentInfo格式
 * @param responseTaskInfo API响应中的单个任务数据
 * @returns 转换后的AgentInfo对象
 */
export function convertApiTaskToAgentInfo(responseTaskInfo: any): AgentInfo {
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
    agentImageUrl: responseTaskInfo.image_url,
    stats: undefined, // TODO: 后端提供真实数据后实现
    tags: responseTaskInfo.tags,
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

/**
 * 将API响应的token数据转换为AgentInfo格式
 * @param responseTokenInfo API响应中的单个token数据
 * @returns 转换后的AgentInfo对象
 */
export function convertApiTokenToAgentInfo(responseTokenInfo: any): AgentInfo {
  return {
    agentId: responseTokenInfo.token_id,
    title: responseTokenInfo.market_data.name,
    description: responseTokenInfo.description || '',
    creator: '',
    subscriberCount: responseTokenInfo.subscription_user_count,
    type: AGENT_HUB_TYPE.TOKEN_DEEP_DIVE,
    tokenInfo: {
      symbol: responseTokenInfo.market_data.symbol,
      fullName: responseTokenInfo.market_data.name,
      description: responseTokenInfo.description,
      price: responseTokenInfo.market_data.current_price,
      pricePerChange: responseTokenInfo.market_data.price_change_percentage_24h,
      logoUrl: responseTokenInfo.market_data.image,
    },
  }
}

/**
 * 批量转换API响应的token数据列表
 * @param responseTokenInfoList API响应中的token数据列表
 * @returns 转换后的AgentInfo数组
 */
export function convertApiTokenListToAgentInfoList(responseTokenInfoList: any[]): AgentInfo[] {
  return responseTokenInfoList.map(convertApiTokenToAgentInfo)
}

/**
 * 将API响应的KOL数据转换为AgentInfo格式
 * @param responseKolInfo API响应中的单个KOL数据
 * @returns 转换后的AgentInfo对象
 */
export function convertApiKolToAgentInfo(responseKolInfo: any): AgentInfo {
  return {
    agentId: responseKolInfo.id,
    title: responseKolInfo.kol_name,
    description: responseKolInfo.kol_description || '',
    creator: '',
    subscriberCount: responseKolInfo.subscription_user_count,
    type: AGENT_HUB_TYPE.KOL_RADAR,
    avatar: responseKolInfo.kol_avatar,
    kolInfo: {
      id: responseKolInfo.id,
      name: responseKolInfo.kol_name,
      avatar: responseKolInfo.kol_avatar,
      description: responseKolInfo.kol_description,
    },
  }
}

/**
 * 批量转换API响应的KOL数据列表
 * @param responseKolInfoList API响应中的KOL数据列表
 * @returns 转换后的AgentInfo数组
 */
export function convertApiKolListToAgentInfoList(responseKolInfoList: any[]): AgentInfo[] {
  return responseKolInfoList.map(convertApiKolToAgentInfo)
}

/**
 * 将API响应数据转换为AgentInfo列表（包含tasks、tokens、kols的合并处理）
 * @param dataList API响应中的完整数据列表
 * @returns 转换并合并后的AgentInfo数组
 */
export function convertApiDataListToAgentMarketplaceInfoList(dataList: any): AgentInfo[] {
  // Extract tasks from each category
  const responseTaskInfoList: any[] = []
  Object.values(dataList).forEach((categoryData: any) => {
    if (categoryData.tasks && Array.isArray(categoryData.tasks)) {
      responseTaskInfoList.push(...categoryData.tasks)
    }
  })

  // 转换各种类型的数据为 AgentInfo 格式
  const responseTokens = dataList[AGENT_HUB_TYPE.TOKEN_DEEP_DIVE]?.tokens || []
  const tokenAgents = convertApiTokenListToAgentInfoList(responseTokens)

  const responseKols = dataList[AGENT_HUB_TYPE.KOL_RADAR]?.kols || []
  const kolAgents = convertApiKolListToAgentInfoList(responseKols)

  const agentInfoList = convertApiTaskListToAgentInfoList(responseTaskInfoList)

  // 合并所有 agents
  return [...agentInfoList, ...tokenAgents, ...kolAgents]
}
