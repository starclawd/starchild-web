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
    id: responseTaskInfo.task_id,
    agentId: responseTaskInfo.id,
    title: responseTaskInfo.title,
    description: responseTaskInfo.description,
    creator: responseTaskInfo.user_name,
    subscriberCount: responseTaskInfo.subscription_user_count,
    avatar: responseTaskInfo.user_avatar,
    types: responseTaskInfo.categories,
    agentImageUrl: responseTaskInfo.image_url === '' ? undefined : responseTaskInfo.image_url,
    stats: undefined, // TODO: 后端提供真实数据后实现
    tags: responseTaskInfo.tags,
    recentChats,
    createdTime: responseTaskInfo.created_at,
    updatedTime: responseTaskInfo.updated_at,
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
    id: responseTokenInfo.token_name,
    agentId: responseTokenInfo.token_name,
    title: responseTokenInfo.market_data.name,
    description: responseTokenInfo.description || '',
    creator: '',
    subscriberCount: responseTokenInfo.subscription_user_count,
    types: [AGENT_HUB_TYPE.TOKEN_DEEP_DIVE],
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
    id: responseKolInfo.id,
    agentId: responseKolInfo.id,
    title: responseKolInfo.kol_name,
    description: responseKolInfo.description || '',
    creator: '',
    subscriberCount: responseKolInfo.subscription_user_count,
    types: [AGENT_HUB_TYPE.KOL_RADAR],
    avatar: responseKolInfo.kol_avatar,
    kolInfo: {
      id: responseKolInfo.id,
      name: responseKolInfo.kol_name,
      avatar: responseKolInfo.kol_avatar,
      description: responseKolInfo.description,
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
  Object.keys(dataList).forEach((type: any) => {
    const categoryData = dataList[type]
    if (categoryData.tasks && Array.isArray(categoryData.tasks)) {
      responseTaskInfoList.push(
        ...categoryData.tasks.map((data: any) => ({
          ...data,
          categories: [type],
        })),
      )
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

/**
 * 筛选 agents：为每个 agent 应用其所属类别的筛选规则（Card View 使用）
 * @param agents 需要筛选的 agent 列表
 * @returns 筛选后的 agent 列表
 */
export function filterAgentsByForCardView(agents: AgentInfo[]): AgentInfo[] {
  return agents.filter((agent) => {
    // 检查 agent 的每个类型，只要有一个类型满足条件就保留
    return agent.types.some((type) => {
      if (type === AGENT_HUB_TYPE.KOL_RADAR) {
        return agent.kolInfo !== undefined
      }
      if (type === AGENT_HUB_TYPE.TOKEN_DEEP_DIVE) {
        return agent.tokenInfo !== undefined
      }
      // 其他类型都保留
      return true
    })
  })
}

/**
 * 筛选 agents：用于 List View 模式的基础筛选逻辑（不包含 tag 筛选）
 * @param agents 需要筛选的 agent 列表
 * @returns 筛选、去重并排序后的 agent 列表
 */
export function filterAgentsForListView(agents: AgentInfo[]): AgentInfo[] {
  return agents
    .filter((agent) => agent.kolInfo === undefined && agent.tokenInfo === undefined)
    .filter((agent, index, array) => array.findIndex((a) => a.agentId === agent.agentId) === index)
    .sort((a, b) => {
      return b.subscriberCount - a.subscriberCount
    })
}

/**
 * 按 tag 筛选 agents（用于 List View 的额外筛选）
 * @param agents 需要筛选的 agent 列表
 * @param currentTag 当前选择的标签筛选
 * @returns 按 tag 筛选后的 agent 列表
 */
export function filterAgentsByTag(agents: AgentInfo[], currentTag: string): AgentInfo[] {
  if (currentTag === '') {
    return agents
  }
  return agents.filter((agent) => agent.types.some((type) => type === currentTag))
}
