/**
 * 获取当前语言
 */
import { DEFAULT_LOCALE, LOCAL_TEXT } from 'constants/locales'
import { useMemo } from 'react'
import { useUserLocaleManager } from 'store/languagecache/hooks'
// import store from 'state'
// import { useUserLocale } from 'state/user/hooks'

// import useParsedQueryString from './useParsedQueryString'
// import { parsedQueryString } from './useParsedQueryString'

/**
 * Given a locale string (e.g. from user agent), return the best match for corresponding
 * @param maybeSupportedLocale the fuzzy locale identifier
 */
// function parseLocale(maybeSupportedLocale: unknown): LOCAL_TEXT | undefined {
//   if (typeof maybeSupportedLocale !== 'string') return undefined
//   const lowerMaybeSupportedLocale = maybeSupportedLocale.toLowerCase()
//   return SUPPORTED_LOCALES.find(
//     (locale) => locale.toLowerCase() === lowerMaybeSupportedLocale || locale.split('-')[0] === lowerMaybeSupportedLocale
//   )
// }

/**
 * Returns the supported locale read from the user agent (navigator)
 */
// export function navigatorLocale(): LOCAL_TEXT | undefined {
//   if (!navigator.language) return undefined

//   const [language, region] = navigator.language.split('-')

//   if (region) {
//     return parseLocale(`${language}-${region.toUpperCase()}`) ?? parseLocale(language)
//   }

//   return parseLocale(language)
// }

// function storeLocale(): LOCAL_TEXT | undefined {
//   return store.getState().user.userLocale ?? undefined
// }

export const initialLocale = DEFAULT_LOCALE
// parseLocale(parsedQueryString().lng) ?? storeLocale() ?? navigatorLocale() ?? DEFAULT_LOCALE

// function useUrlLocale() {
//   const parsed = useParsedQueryString()
//   return parseLocale(parsed.lng)
// }

/**
 * 获取当前语言，优先url，其次store，再就是ua，最后是default
 */
export function useActiveLocale(): LOCAL_TEXT {
  // const urlLocale = useUrlLocale()
  const [userLocale] = useUserLocaleManager()
  return useMemo(() => {
    return (userLocale ?? DEFAULT_LOCALE) as LOCAL_TEXT
  }, [userLocale])
}
