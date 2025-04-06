import { ReactNode, useCallback, useEffect } from 'react'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { LOCAL_TEXT } from 'constants/locales'
import { initialLocale, useActiveLocale } from 'hooks/useActiveLocale'
import { useUserLocaleManager } from 'store/language/hooks'
// import { PluralCategory } from 'make-plural/plurals'
// import { en, zh, ja, es, ko, ru, vi } from 'make-plural/plurals'
// type LocalePlural = {
//   [lang: string]: (n: number | string, ord?: boolean) => PluralCategory
// }
// const plurals: LocalePlural = {
//   'en-US': en,
//   'zh-CN': zh,
//   'ja-JP': ja,
//   'es-ES': es,
//   'ko-KR': ko,
//   'ru-RU': ru,
//   'vi-VI': vi,
//   pseudo: en,
// }
async function dynamicActivate(locale: LOCAL_TEXT) {
  try {
    // There are no default messages in production,
    // see https://github.com/lingui/js-lingui/issues/388#issuecomment-497779030
    const catalog = await import(`locales/${locale}.js`)
    // Bundlers will either export it as default or as a named export named default.
    i18n.load(locale, catalog.messages || catalog.default.messages)
  } catch {}
  i18n.activate(locale)
}
dynamicActivate(initialLocale)
interface ProviderProps {
  locale: LOCAL_TEXT
  onActivate?: (locale: LOCAL_TEXT) => void
  children: ReactNode
}

export function Provider({ locale, onActivate, children }: ProviderProps) {
  useEffect(() => {
    dynamicActivate(locale)
      .then(() => onActivate?.(locale))
      .catch((error) => {
        console.error('Failed to activate locale', locale, error)
      })
  }, [locale, onActivate])

  return (
    <I18nProvider i18n={i18n}>
      {children}
    </I18nProvider>
  )
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useActiveLocale()
  const [, setUserLocale] = useUserLocaleManager()

  const onActivate = useCallback(
    (locale: LOCAL_TEXT) => {
      document.documentElement.setAttribute('lang', locale)
      setUserLocale(locale) // stores the selected locale to persist across sessions
    },
    []
  )

  return (
    <Provider locale={locale} onActivate={onActivate}>
      {children}
    </Provider>
  )
}
