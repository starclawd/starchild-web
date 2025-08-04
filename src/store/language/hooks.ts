import { useChangeLanguageMutation } from 'api/user'
import { API_LANG_MAP, DEFAULT_LOCALE, LOCAL_TEXT } from 'constants/locales'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { useUserLocaleManager } from 'store/languagecache/hooks'
import { setCurrentLocale } from './reducer'
import { useIsLogin } from 'store/login/hooks'

export const useLanguageState = () => {
  return useSelector((state: RootState) => state.language)
}

export const useInitializeLanguage = () => {
  const dispatch = useDispatch()
  const [userLocaleCache] = useUserLocaleManager()
  const { currentLocale } = useLanguageState()

  useEffect(() => {
    // 如果 language store 中没有值，但缓存中有值，则同步到 store
    if (!currentLocale && userLocaleCache) {
      dispatch(setCurrentLocale(userLocaleCache))
    }
  }, [currentLocale, userLocaleCache, dispatch])
}

/**
 * 使用前端的语言格式更新语言设置
 * @example updateLanguageFromLocalText('zh-CN')
 */
export const useUpdateLanguageFromLocalText = () => {
  const dispatch = useDispatch()
  const [, setLocaleCache] = useUserLocaleManager()

  const updateLanguageFromLocalText = useCallback(
    (localLanguage: LOCAL_TEXT) => {
      dispatch(setCurrentLocale(localLanguage))
      setLocaleCache(localLanguage)
    },
    [dispatch, setLocaleCache],
  )

  return updateLanguageFromLocalText
}

/**
 * 使用后端API的语言格式更新语言设置
 * @example updateLanguageFromAPI('zh') -> 'zh-CN'
 */
export const useUpdateLanguageFromAPI = () => {
  const updateLanguageFromLocalText = useUpdateLanguageFromLocalText()

  const updateLanguageFromAPI = useCallback(
    (backendLang: string | null | undefined) => {
      let frontendLocale: LOCAL_TEXT = DEFAULT_LOCALE
      if (backendLang) {
        // 反向查找API_LANG_MAP，获取LOCAL_TEXT
        const localeEntry = Object.entries(API_LANG_MAP).find(([_, apiLang]) => apiLang === backendLang)
        if (localeEntry) {
          frontendLocale = localeEntry[0] as LOCAL_TEXT
        }
      }

      updateLanguageFromLocalText(frontendLocale)
    },
    [updateLanguageFromLocalText],
  )

  return updateLanguageFromAPI
}

export const useChangeLanguage = () => {
  const [changeLanguageApi, { isLoading, error }] = useChangeLanguageMutation()
  const updateLanguageFromLocalText = useUpdateLanguageFromLocalText()
  const isLogin = useIsLogin()

  const changeLanguage = useCallback(
    async (language: LOCAL_TEXT) => {
      try {
        // 检查是否已登录
        if (isLogin) {
          // 已登录，调用API更新语言设置
          const apiLang = API_LANG_MAP[language]
          const result = await changeLanguageApi(apiLang).unwrap()

          // API调用成功后，更新Redux状态和本地缓存
          updateLanguageFromLocalText(language)

          // 刷新页面应用语言设置
          window.location.reload()

          return { success: true, data: result }
        } else {
          // 未登录，直接更新Redux状态和本地缓存
          updateLanguageFromLocalText(language)

          // 刷新页面应用语言设置
          window.location.reload()

          return { success: true, data: null }
        }
      } catch (error) {
        return { success: false, error }
      }
    },
    [changeLanguageApi, updateLanguageFromLocalText, isLogin],
  )

  return {
    changeLanguage,
    isLoading,
    error,
  }
}
