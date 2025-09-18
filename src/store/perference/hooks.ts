import { useLazyGetPreferenceQuery, useLazyUpdatePreferenceQuery } from 'api/perference'
import { useCallback } from 'react'
import { useUserInfo } from 'store/login/hooks'
import { PreferenceDataType } from './perference'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updatePreferenceData } from './reducer'

export function useGetPreference() {
  const [{ telegramUserId }] = useUserInfo()
  const [, setPreferenceData] = usePreferenceData()
  const [triggerGetPreference] = useLazyGetPreferenceQuery()
  return useCallback(async () => {
    if (!telegramUserId) return
    try {
      const data = await triggerGetPreference({ account: telegramUserId })
      const preferenceData = (data as any).data.data
      setPreferenceData({
        timezone: preferenceData.timezone || '',
        tradingExperience: preferenceData.trading_level || '',
        aiExperience: preferenceData.agent_level || '',
        watchlist: preferenceData.token_list || '',
        personalProfile: preferenceData.long_term_memory || '',
      })
      return data
    } catch (error) {
      return error
    }
  }, [telegramUserId, setPreferenceData, triggerGetPreference])
}

export function useUpdatePreference() {
  const [{ telegramUserId }] = useUserInfo()
  const [triggerUpdatePreference] = useLazyUpdatePreferenceQuery()
  return useCallback(
    async ({
      timezone,
      tradingExperience,
      aiExperience,
      watchlist,
      personalProfile,
    }: {
      timezone: string
      tradingExperience: string
      aiExperience: string
      watchlist: string
      personalProfile: string
    }) => {
      if (!telegramUserId) return
      try {
        const data = await triggerUpdatePreference({
          account: telegramUserId,
          timezone,
          tradingExperience,
          aiExperience,
          watchlist,
          personalProfile,
        })
        return data
      } catch (error) {
        return error
      }
    },
    [telegramUserId, triggerUpdatePreference],
  )
}

export function usePreferenceData(): [PreferenceDataType, (preferenceData: PreferenceDataType) => void] {
  const dispatch = useDispatch()
  const preferenceData = useSelector((state: RootState) => state.perference.perferenceData)
  const setPreferenceData = useCallback(
    (preferenceData: PreferenceDataType) => {
      dispatch(updatePreferenceData(preferenceData))
    },
    [dispatch],
  )
  return [preferenceData, setPreferenceData]
}
