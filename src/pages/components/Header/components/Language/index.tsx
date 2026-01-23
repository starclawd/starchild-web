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
import { ANI_DURATION } from 'constants/index'

const LanguageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  cursor: pointer;
  border-radius: 4px;
  transition: all ${ANI_DURATION}s;
  background-color: transparent;
  .icon-menu-language {
    font-size: 16px;
    color: #d9d9d9;
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
    background-color: transparent;
  }
  &:hover {
    background-color: ${({ theme }) => theme.black700};
  }
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
            typeIcon: 'icon-complete',
            iconTheme: theme.black0,
            autoClose: 3000,
          })
        } else {
          toast({
            title: <Trans>Error</Trans>,
            description: <Trans>Failed to switch language</Trans>,
            status: TOAST_STATUS.ERROR,
            typeIcon: 'icon-close',
            iconTheme: theme.black0,
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
        isActive,
        key: locale,
        text: LOCALE_LABEL[locale],
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
        offsetLeft={24}
        offsetTop={-24}
        placement={isMobile ? 'top-start' : 'top-end'}
        value={activeLocale}
        dataList={languageList}
        triggerMethod={TriggerMethod.CLICK}
      >
        <IconBase className='icon-menu-language' />
      </Select>
    </LanguageWrapper>
  )
}
