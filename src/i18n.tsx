import { ReactNode, useCallback, useEffect } from 'react'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { LOCAL_TEXT } from 'constants/locales'
import { initialLocale, useActiveLocale } from 'hooks/useActiveLocale'
import { useUserLocaleManager } from 'store/languagecache/hooks'
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

// 同步激活一个初始空的语言环境，确保I18nProvider不会渲染null
i18n.load(initialLocale, {})
i18n.activate(initialLocale)

async function dynamicActivate(locale: LOCAL_TEXT) {
  try {
    // Direct import from the .mjs files
    const { messages } = await import(`./locales/${locale}.json`)
    i18n.load(locale, messages)
    i18n.activate(locale)
  } catch (error) {
    console.error('Failed to activate locale', error)
  }
}

// 提前开始加载初始语言，但不等待它完成
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
    [setUserLocale]
  )

  return (
    <Provider locale={locale} onActivate={onActivate}>
      {children}
    </Provider>
  )
}
