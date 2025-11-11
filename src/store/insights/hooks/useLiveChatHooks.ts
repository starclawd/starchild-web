import { useDispatch } from 'react-redux'
import { useLazyGetLiveChatQuery } from 'api/insight'
import { useCallback } from 'react'

export function useGetLiveChat() {
  const dispatch = useDispatch()
  const [triggerGetLiveChat] = useLazyGetLiveChatQuery()

  return useCallback(async () => {
    try {
      const response = await triggerGetLiveChat()

      if (response.isSuccess) {
        console.log('response', response)
      }

      return response
    } catch (error) {
      console.error('Failed to get live chat:', error)
      return error
    }
  }, [triggerGetLiveChat])
}
