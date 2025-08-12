import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import Select, { TriggerMethod } from 'components/Select'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { LOCAL_TEXT, LOCALE_LABEL, SUPPORTED_LOCALES } from 'constants/locales'
import { useActiveLocale } from 'hooks/useActiveLocale'
import { vm } from 'pages/helper'
import { useCallback, useMemo } from 'react'
import { useIsMobile } from 'store/application/hooks'
import { useChangeLanguage } from 'store/language/hooks'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'

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
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(24)};
      height: ${vm(24)};
      .icon-language {
        font-size: 0.24rem;
      }
    `}
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
    color: ${({ theme }) => theme.brand100};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.14rem;
      line-height: 0.2rem;
      .icon-chat-complete {
        font-size: 0.18rem;
      }
    `}
`

export default function Language() {
  const theme = useTheme()
  const isMobile = useIsMobile()
  const activeLocale = useActiveLocale()
  const toast = useToast()
  const { changeLanguage, isLoading } = useChangeLanguage()
  const changeLocale = useCallback(
    (local: LOCAL_TEXT) => {
      return async () => {
        if (isLoading || local === activeLocale) return

        const result = await changeLanguage(local)
        if (result.success) {
          toast({
            title: <Trans>Success</Trans>,
            description: <Trans>Language switched successfully</Trans>,
            status: TOAST_STATUS.SUCCESS,
            typeIcon: 'icon-chat-complete',
            iconTheme: theme.jade10,
            autoClose: 3000,
          })
        } else {
          toast({
            title: <Trans>Error</Trans>,
            description: <Trans>Failed to switch language</Trans>,
            status: TOAST_STATUS.ERROR,
            typeIcon: 'icon-chat-close',
            iconTheme: theme.ruby50,
            autoClose: 3000,
          })
        }
      }
    },
    [changeLanguage, toast, theme, activeLocale, isLoading],
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
        placement={isMobile ? 'top-start' : 'top-end'}
        value={activeLocale}
        dataList={languageList}
        popItemHoverBg={theme.bgT20}
        triggerMethod={TriggerMethod.CLICK}
        popStyle={{
          width: isMobile ? vm(160) : '160px',
          borderRadius: isMobile ? vm(12) : '12px',
          background: theme.black700,
          padding: isMobile ? vm(4) : '4px',
          border: 'none',
        }}
        popItemStyle={{
          padding: isMobile ? vm(8) : '8px',
          borderRadius: isMobile ? vm(8) : '8px',
          border: 'none',
          height: isMobile ? vm(36) : '36px',
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
