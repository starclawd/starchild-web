import { useCallback } from 'react'
import { useLazyBindStrategyToGuestQuery } from 'api/createStrategy'
import { useGuestUser } from 'store/logincache/hooks'

/**
 * 绑定访客策略到登录用户 hook
 * 用于在用户登录后将访客创建的策略绑定到登录账户
 */
export function useBindStrategyToGuest() {
  const [triggerBindStrategyToGuest] = useLazyBindStrategyToGuestQuery()
  const [guestUser] = useGuestUser()

  /**
   * 绑定访客策略到登录用户
   * @param userInfoId 登录用户的 userInfoId
   * @returns 绑定结果
   */
  const bindStrategyToGuest = useCallback(
    async (userInfoId: string) => {
      if (!guestUser) {
        return null
      }

      try {
        const result = await triggerBindStrategyToGuest({
          guestUuid: guestUser.guest_uuid,
          userInfoId,
          guestApiKey: guestUser.account_api_key,
        })

        return result
      } catch (error) {
        console.error('绑定访客信息失败:', error)
        throw error
      }
    },
    [guestUser, triggerBindStrategyToGuest],
  )

  return bindStrategyToGuest
}
