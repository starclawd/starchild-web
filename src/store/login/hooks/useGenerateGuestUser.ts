import { useCallback } from 'react'
import { useLazyGenerateGuestUserQuery } from 'api/createStrategy'
import { useGuestUser } from 'store/logincache/hooks'
import { GuestUserData } from 'store/logincache/logincache.d'

/**
 * 生成游客用户 hook
 * 用于创建一个临时的游客账户
 */
export function useGenerateGuestUser() {
  const [triggerGenerateGuestUser] = useLazyGenerateGuestUserQuery()
  const [, setGuestUser] = useGuestUser()

  /**
   * 生成游客用户
   * 使用 crypto.randomUUID() 自动生成唯一标识符
   * @returns 生成结果
   */
  const generateGuestUser = useCallback(async () => {
    try {
      const guestUuid = crypto.randomUUID()

      const data = await triggerGenerateGuestUser({ guestUuid })
      console.log('🔑 generateGuestUser data', data)
      if (data.data?.status === 'success') {
        const result = data.data.data as GuestUserData

        // 存储访客信息到 logincache
        setGuestUser(result)
      }

      return data
    } catch (error) {
      console.error('生成游客用户失败:', error)
      throw error
    }
  }, [triggerGenerateGuestUser, setGuestUser])

  return generateGuestUser
}
