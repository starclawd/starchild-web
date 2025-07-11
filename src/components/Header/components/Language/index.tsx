import { IconBase } from 'components/Icons'
import Select, { TriggerMethod } from 'components/Select'
import { LOCAL_TEXT, LOCALE_LABEL, SUPPORTED_LOCALES } from 'constants/locales'
import { useActiveLocale } from 'hooks/useActiveLocale'
import { useCallback, useMemo } from 'react'
import { useUserLocaleManager } from 'store/languagecache/hooks'
import { useTheme } from 'store/themecache/hooks'
import styled from 'styled-components'

const LanguageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  .icon-language {
    font-size: 24px;
    color: ${({ theme }) => theme.textL3};
  }
  .select-wrapper {
    width: auto;
    height: auto;
  }
  .select-border-wrapper {
    width: auto;
    height: auto;
    padding: 0;
    border: none;
  }
`

const LanguageItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
  .icon-chat-complete {
    font-size: 18px;
    color: ${({ theme }) => theme.blue100};
  }
`

export default function Language() {
  const theme = useTheme()
  const activeLocale = useActiveLocale()
  const [, setLocale] = useUserLocaleManager()
  const changeLocale = useCallback(
    (local: LOCAL_TEXT) => {
      return () => {
        setLocale(local)
      }
    },
    [setLocale],
  )

  const languageList = useMemo(() => {
    return SUPPORTED_LOCALES.map((locale) => {
      const isActive = locale === activeLocale
      return {
        key: locale,
        text: (
          <LanguageItem>
            <span>{LOCALE_LABEL[locale]}</span>
            {isActive && <IconBase className='icon-chat-complete' />}
          </LanguageItem>
        ),
        value: locale,
        clickCallback: changeLocale(locale as LOCAL_TEXT),
      }
    })
  }, [activeLocale, changeLocale])
  return (
    <LanguageWrapper>
      <Select
        usePortal
        hideExpand
        placement='top-end'
        value={activeLocale}
        dataList={languageList}
        popItemHoverBg={theme.bgT20}
        triggerMethod={TriggerMethod.CLICK}
        popStyle={{
          width: '160px',
          borderRadius: '12px',
          background: theme.black700,
          padding: '4px',
          border: 'none',
        }}
        popItemStyle={{
          padding: '8px',
          borderRadius: '8px',
          border: 'none',
          height: '36px',
        }}
        popItemTextStyle={{
          width: '100%',
        }}
      >
        <IconBase className='icon-language' />
      </Select>
    </LanguageWrapper>
  )
}
