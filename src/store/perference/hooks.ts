import { useCallback } from 'react'
import { useUserInfo, useIsLogin } from 'store/login/hooks'
import { PreferenceDataType } from './perference'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updatePreferenceData } from './reducer'
import { useLazyGetPreferenceQuery, useLazyUpdatePreferenceQuery } from 'api/perference'

export function useGetPreference() {
  const [{ userInfoId }] = useUserInfo()
  const [, setPreferenceData] = usePreferenceData()
  const [triggerGetPreference] = useLazyGetPreferenceQuery()
  return useCallback(async () => {
    if (!userInfoId) return
    try {
      const data = await triggerGetPreference({})
      const preferenceData = (data as any).data.data
      setPreferenceData({
        timezone: preferenceData.timezone || '',
        tradingExperience: preferenceData.trading_level || '',
        aiExperience: preferenceData.agent_level || '',
        watchlist: preferenceData.token_list || '',
        personalProfile: preferenceData.long_term_memory || '',
        addresses: preferenceData.addresses || [],
      })
      return data
    } catch (error) {
      return error
    }
  }, [userInfoId, setPreferenceData, triggerGetPreference])
}

export function useUpdatePreference() {
  const [{ userInfoId }] = useUserInfo()
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
      if (!userInfoId) return
      try {
        const data = await triggerUpdatePreference({
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
    [userInfoId, triggerUpdatePreference],
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
