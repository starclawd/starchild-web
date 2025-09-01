import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateAgentSubscriptionStatus, updateSubscribedAgentIds } from '../reducer'
import { useLazySubscribeAgentQuery, useLazyUnsubscribeAgentQuery, useLazyGetSubscribedAgentsQuery } from 'api/agentHub'
import { useUserInfo } from '../../login/hooks'
import { useSubscribedAgents } from '../../myagent/hooks'

// 自定义事件类型
type SubscriptionEvent = {
  type: 'SUBSCRIBE_AGENT' | 'UNSUBSCRIBE_AGENT'
  agentId: number
}

// 创建事件目标
const subscriptionEventTarget = new EventTarget()

// 触发订阅事件
const emitSubscriptionEvent = (event: SubscriptionEvent) => {
  const customEvent = new CustomEvent('agentSubscriptionChange', { detail: event })
  subscriptionEventTarget.dispatchEvent(customEvent)
}

/**
 * 订阅Agent
 */
export function useSubscribeAgent() {
  const dispatch = useDispatch()
  const [subscribeAgent, { isLoading: isSubscribeLoading }] = useLazySubscribeAgentQuery()
  const [{ telegramUserId }] = useUserInfo()

  return useCallback(
    async (agentId: number) => {
      try {
        const result = await subscribeAgent({
          agentId,
          userId: telegramUserId,
        })
        if (result.data?.status === 'success') {
          // Update local state
          dispatch(
            updateAgentSubscriptionStatus({
              agentId,
              subscribed: true,
            }),
          )
          // 触发订阅事件
          emitSubscriptionEvent({
            type: 'SUBSCRIBE_AGENT',
            agentId,
          })
          return result.data
        }
        return null
      } catch (error) {
        console.error('Failed to subscribe agent:', error)
        return null
      }
    },
    [dispatch, subscribeAgent, telegramUserId],
  )
}

/**
 * 取消订阅Agent
 */
export function useUnsubscribeAgent() {
  const dispatch = useDispatch()
  const [unsubscribeAgent, { isLoading: isUnsubscribeLoading }] = useLazyUnsubscribeAgentQuery()
  const [{ telegramUserId }] = useUserInfo()

  return useCallback(
    async (agentId: number) => {
      try {
        const result = await unsubscribeAgent({
          agentId,
          userId: telegramUserId,
        })
        if (result.data?.status === 'success') {
          // Update local state
          dispatch(
            updateAgentSubscriptionStatus({
              agentId,
              subscribed: false,
            }),
          )
          // 触发取消订阅事件
          emitSubscriptionEvent({
            type: 'UNSUBSCRIBE_AGENT',
            agentId,
          })
          return result.data
        }
        return null
      } catch (error) {
        console.error('Failed to unsubscribe agent:', error)
        return null
      }
    },
    [dispatch, unsubscribeAgent, telegramUserId],
  )
}

/**
 * 检查Agent是否被订阅
 */
export function useIsAgentSubscribed(agentId: number): boolean {
  const subscribedAgentIds = useSelector((state: RootState) => state.agentHub.subscribedAgentIds)
  return subscribedAgentIds.includes(agentId)
}

/**
 * 检查是否为自己的Agent
 */
export function useIsSelfAgent(agentId: number): boolean {
  const [{ telegramUserId }] = useUserInfo()
  const [subscribedAgents] = useSubscribedAgents()
  const agent = subscribedAgents.find((agent) => agent.id === agentId)
  return agent?.user_id === telegramUserId
}

/**
 * 获取订阅的Agent列表
 */
export function useGetSubscribedAgents() {
  const dispatch = useDispatch()
  const [, setSubscribedAgents] = useSubscribedAgents()
  const [triggerGetSubscribedAgents] = useLazyGetSubscribedAgentsQuery()
  const [{ telegramUserId }] = useUserInfo()

  return useCallback(async () => {
    try {
      const response = await triggerGetSubscribedAgents({
        userId: telegramUserId,
      })

      if (response.isSuccess) {
        // Extract agent IDs from response
        const agents = response.data.data.tasks
        const agentIds = agents.map((agent: any) => agent.id)
        setSubscribedAgents(agents)
        dispatch(updateSubscribedAgentIds(agentIds))
      }

      return response
    } catch (error) {
      console.error('Failed to get subscribed agents:', error)
      return error
    }
  }, [dispatch, setSubscribedAgents, triggerGetSubscribedAgents, telegramUserId])
}

// 导出事件目标，供其他组件监听
export { subscriptionEventTarget }
