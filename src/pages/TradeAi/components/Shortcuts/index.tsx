import styled, { css } from 'styled-components'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSendAiContent } from 'store/tradeai/hooks'
import { Trans } from '@lingui/react/macro'
import { t } from '@lingui/core/macro'
import { useTheme } from 'store/themecache/hooks'
import { vm } from 'pages/helper'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import BottomSheet from 'components/BottomSheet'
import NoData from 'components/NoData'
import { IconBase } from 'components/Icons'
import { useAddQuestionModalToggle, useIsMobile, useModalOpen } from 'store/application/hooks'
import AddQuestionModal from '../AddQuestionModal'
import { ANI_DURATION } from 'constants/index'
import { ApplicationModal } from 'store/application/application.d'
import { TypeSelectContent } from '../AiInput/components/TypeSelect'
import ShortcutsEdit from './components/ShortcutsEdit'
import useToast, { TOAST_STATUS } from 'components/Toast'
import {
  useCreateShortcut,
  useDeleteShortcut,
  useGetAiStyleType,
  useGetShortcuts,
  useShortcuts,
} from 'store/shortcuts/hooks'
import { useUserInfo } from 'store/login/hooks'
import { useScrollbarClass } from 'hooks/useScrollbarClass'

const ShortcutsWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(4)} ${vm(12)} 0;
      gap: ${vm(4)};
    `}
`

const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  flex: 1;
  gap: 4px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
    `}
`

const ShortcutItem = styled(BorderAllSide1PxBox)<{ $active: boolean; $shortcutCuts: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 100%;
  height: 26px;
  padding: 0 8px;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
  transition: all ${ANI_DURATION}s;
  ${({ theme, $shortcutCuts }) =>
    $shortcutCuts === SHORTCUT_TYPE.SHORTCUTS &&
    css`
      background-color: ${theme.sfC1};
    `}
  ${({ theme, $active }) =>
    $active &&
    css`
      background-color: ${theme.brand6};
      color: ${theme.textL1};
    `}
  ${({ theme, $shortcutCuts }) =>
    theme.isMobile
      ? css`
          height: ${vm(26)};
          padding: 0 ${vm(8)};
          font-size: 0.13rem;
          font-weight: 500;
          line-height: 0.2rem;
          ${$shortcutCuts === SHORTCUT_TYPE.STYLE_TYPE &&
          css`
            padding: 0 ${vm(4)};
          `}
        `
      : css`
          cursor: pointer;
        `}
`

const StyleTypeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  .icon-style-type {
    font-size: 0.18rem;
    color: ${({ theme }) => theme.textL1};
  }
`

const CanAskContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  ${({ theme }) =>
    !theme.isMobile
      ? css`
          padding-bottom: 20px;
          border-radius: 24px;
          border: 1px solid ${({ theme }) => theme.bgT30};
          background: ${({ theme }) => theme.bgL0};
          backdrop-filter: blur(8px);
        `
      : css`
          padding-bottom: ${vm(20)};
        `}
`

const CanAskContentTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  height: 56px;
  padding: 20px 20px 8px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(44)};
      text-align: center;
      padding: ${vm(8)} ${vm(20)};
      font-size: 0.2rem;
      font-weight: 500;
      line-height: 0.28rem;
    `}
`

const AddWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: transparent;
  transition: all ${ANI_DURATION}s;
  .icon-chat-upload {
    font-size: 24px;
  }
  ${({ theme }) =>
    theme.isMobile
      ? css`
          width: ${vm(32)};
          height: ${vm(32)};
          .icon-chat-upload {
            font-size: 0.24rem;
          }
        `
      : css`
          cursor: pointer;
          &:hover {
            background-color: ${({ theme }) => theme.bgT30};
          }
        `}
`

const ContentList = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 300px;
  flex-grow: 0;
  gap: 8px;
  padding: 12px 20px 0;
  .no-data-wrapper {
    background-color: transparent;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      max-height: 50vh;
      gap: ${vm(8)};
      padding: ${vm(12)} ${vm(20)} 0;
    `}
`

const ContentItem = styled.div<{ $currentShortcut: string }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
  border-radius: 12px;
  .icon-chat-more {
    font-size: 18px;
    color: ${({ theme }) => theme.textDark54};
  }
  ${({ $currentShortcut }) =>
    $currentShortcut !== SHORTCUT_TYPE.SHORTCUTS
      ? css`
          padding: 8px 12px 8px 8px;
          gap: 8px;
        `
      : css`
          justify-content: space-between;
        `}
  ${({ theme, $currentShortcut }) =>
    theme.isMobile
      ? css`
          gap: ${vm(8)};
          padding: ${vm(8)} ${vm(8)} ${vm(8)} ${vm(12)};
          font-size: 0.14rem;
          font-weight: 400;
          line-height: 0.2rem;
          border-radius: ${vm(12)};
          background-color: ${({ theme }) => theme.sfC1};
          .icon-chat-more {
            font-size: 0.18rem;
          }
          ${$currentShortcut !== SHORTCUT_TYPE.SHORTCUTS &&
          css`
            padding: ${vm(8)} ${vm(12)} ${vm(8)} ${vm(8)};
          `}
        `
      : css`
          cursor: pointer;
          gap: 8px;
          transition: all ${ANI_DURATION}s;
          &:hover {
            background-color: ${({ theme }) => theme.bgL2};
          }
        `}
`

const StarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 100%;
  .icon-chat-star {
    font-size: 18px;
    color: ${({ theme }) => theme.jade10};
  }
  .icon-chat-star-empty {
    font-size: 18px;
    color: ${({ theme }) => theme.textL4};
  }
  ${({ theme }) =>
    theme.isMobile
      ? css`
          .icon-chat-star,
          .icon-chat-star-empty {
            font-size: 0.18rem;
          }
        `
      : css`
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: transparent;
          cursor: pointer;
          transition: all ${ANI_DURATION}s;
          &:hover {
            background-color: ${({ theme }) => theme.bgT30};
          }
        `}
`

const ShortcutTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  gap: 4px;
  .icon-chat-shortcuts {
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
      .icon-chat-upload {
        font-size: 0.18rem;
        color: ${theme.textL2};
      }
    `}
`

enum SHORTCUT_TYPE {
  STYLE_TYPE = 'StyleType',
  SHORTCUTS = 'Shortcuts',
  INDICATORS_AND_ANALYSIS = 'Indicators & Analysis',
  MACROECONOMIC = 'Macroeconomic',
  WEB3_EVENTS = 'Web3 Events',
  HISTORICAL_DATA = 'Historical Data',
  MARKET_MOVEMENTS = 'Market Movements',
}

export default memo(function Shortcuts() {
  const theme = useTheme()
  const toast = useToast()
  const isMobile = useIsMobile()
  const [shortcuts] = useShortcuts()
  const [{ telegramUserId }] = useUserInfo()
  const [isOpen, setIsOpen] = useState(false)
  const [editQuestionData, setEditQuestionData] = useState({
    text: '',
    id: '',
  })
  const [currentShortcut, setCurrentShortcut] = useState('')
  const currentShortcutRef = useRef(currentShortcut)
  const sendAiContent = useSendAiContent()
  const triggerGetAiStyleType = useGetAiStyleType()
  const triggerGetShortcuts = useGetShortcuts()
  const triggerCreateShortcut = useCreateShortcut()
  const triggerDeleteShortcut = useDeleteShortcut()
  const toggleAddQuestionModal = useAddQuestionModalToggle()
  const addQuestionModalOpen = useModalOpen(ApplicationModal.ADD_QUESTION_MODAL)
  const [operatorText, setOperatorText] = useState('')
  const shortcutsRef = useRef<HTMLDivElement>(null)
  const scrollRef = useScrollbarClass<HTMLDivElement>()
  const scrollRef1 = useScrollbarClass<HTMLDivElement>()
  const handleCloseSheet = useCallback(() => {
    setIsOpen(false)
    setCurrentShortcut('')
    setOperatorText('')
    setTimeout(() => {
      currentShortcutRef.current = ''
    }, ANI_DURATION * 1000)
  }, [setIsOpen, setCurrentShortcut])
  const shortcutClick = useCallback(
    (value: SHORTCUT_TYPE) => {
      return () => {
        if (value === currentShortcut && isOpen) {
          handleCloseSheet()
          return
        }
        setCurrentShortcut(value)
        currentShortcutRef.current = value
        setIsOpen(true)
      }
    },
    [setCurrentShortcut, setIsOpen, currentShortcut, isOpen, handleCloseSheet],
  )
  const shortcutsList = useMemo(() => {
    return [
      ...(isMobile
        ? [
            {
              key: 'StyleType',
              title: (
                <StyleTypeWrapper>
                  <IconBase className='icon-style-type' />
                </StyleTypeWrapper>
              ),
              value: SHORTCUT_TYPE.STYLE_TYPE,
              callback: shortcutClick(SHORTCUT_TYPE.STYLE_TYPE),
            },
          ]
        : []),
      {
        key: 'Shortcuts',
        title: (
          <ShortcutTitle>
            <IconBase className='icon-chat-shortcuts' />
            <Trans>Shortcuts</Trans>
          </ShortcutTitle>
        ),
        value: SHORTCUT_TYPE.SHORTCUTS,
        callback: shortcutClick(SHORTCUT_TYPE.SHORTCUTS),
      },
      {
        key: 'Indicators & Analysis',
        title: <Trans>Indicators & Analysis</Trans>,
        value: SHORTCUT_TYPE.INDICATORS_AND_ANALYSIS,
        callback: shortcutClick(SHORTCUT_TYPE.INDICATORS_AND_ANALYSIS),
      },
      {
        key: 'Macroeconomic',
        title: <Trans>Macroeconomic</Trans>,
        value: SHORTCUT_TYPE.MACROECONOMIC,
        callback: shortcutClick(SHORTCUT_TYPE.MACROECONOMIC),
      },
      {
        key: 'Web3 Events',
        title: <Trans>Web3 Events</Trans>,
        value: SHORTCUT_TYPE.WEB3_EVENTS,
        callback: shortcutClick(SHORTCUT_TYPE.WEB3_EVENTS),
      },
      {
        key: 'Historical Data',
        title: <Trans>Historical Data</Trans>,
        value: SHORTCUT_TYPE.HISTORICAL_DATA,
        callback: shortcutClick(SHORTCUT_TYPE.HISTORICAL_DATA),
      },
      {
        key: 'Market Movements',
        title: <Trans>Market Movements</Trans>,
        value: SHORTCUT_TYPE.MARKET_MOVEMENTS,
        callback: shortcutClick(SHORTCUT_TYPE.MARKET_MOVEMENTS),
      },
    ]
  }, [isMobile, shortcutClick])
  const shortcutContentMap: Record<string, { key: string; text: string }[]> = {
    [SHORTCUT_TYPE.SHORTCUTS]: shortcuts.map((shortcut) => ({
      key: shortcut.id.toString(),
      text: shortcut.content,
    })),
    [SHORTCUT_TYPE.INDICATORS_AND_ANALYSIS]: [
      {
        key: 'Give a technical analysis of BTC and ETH prices.',
        text: t`Give a technical analysis of BTC and ETH prices.`,
      },
      {
        key: 'Can you identify the support and resistance levels for BTC on the 4H and 1D chart?',
        text: t`Can you identify the support and resistance levels for BTC on the 4H and 1D chart?`,
      },
      {
        key: 'What are the current BTC perp funding rates across major exchanges?',
        text: t`What are the current BTC perp funding rates across major exchanges?`,
      },
      {
        key: 'What s the long/short ratio on Binance, OKX, and Bybit?',
        text: t`What's the long/short ratio on Binance, OKX, and Bybit?`,
      },
    ],
    [SHORTCUT_TYPE.MACROECONOMIC]: [
      {
        key: 'What economic data or meeting will be released this week? What are the market expectations?',
        text: t`What economic data or meeting will be released this week? What are the market expectations?`,
      },
      {
        key: 'Is there a chance of an interest rate hike or cut in the near future?',
        text: t`Is there a chance of an interest rate hike or cut in the near future?`,
      },
      {
        key: 'Are there any upcoming political events that might impact the crypto or financial markets?',
        text: t`Are there any upcoming political events that might impact the crypto or financial markets?`,
      },
    ],
    [SHORTCUT_TYPE.WEB3_EVENTS]: [
      {
        key: 'What major Web3 conferences or summits are happening next month?',
        text: t`What major Web3 conferences or summits are happening next month?`,
      },
      {
        key: 'Are there any major token unlocks scheduled for next month?',
        text: t`Are there any major token unlocks scheduled for next month?`,
      },
      {
        key: 'What new crypto projects launched last week or are launching next week?',
        text: t`What new crypto projects launched last week or are launching next week?`,
      },
      {
        key: 'What are the latest and most talked-about token listings recently?',
        text: t`What are the latest and most talked-about token listings recently?`,
      },
    ],
    [SHORTCUT_TYPE.HISTORICAL_DATA]: [
      {
        key: 'What was the largest 24-hour ETH drop in the past 3 years?',
        text: t`What was the largest 24-hour ETH drop in the past 3 years?`,
      },
      {
        key: 'On which day did BTC record its biggest single-day gain, and by how much?',
        text: t`On which day did BTC record its biggest single-day gain, and by how much?`,
      },
      {
        key: 'How many times has BTC surged more than 5% in a single day over the past 10 years?',
        text: t`How many times has BTC surged more than 5% in a single day over the past 10 years?`,
      },
    ],
    [SHORTCUT_TYPE.MARKET_MOVEMENTS]: [
      {
        key: 'Which institutions/whales bought or sold BTC/ETH today?',
        text: t`Which institutions/whales bought or sold BTC/ETH today?`,
      },
      {
        key: 'What did major KOLs tweet today about the market?',
        text: t`What did major KOLs tweet today about the market?`,
      },
      {
        key: 'What s the BTC ETF net inflow over the past 24 hours?',
        text: t`What's the BTC ETF net inflow over the past 24 hours?`,
      },
      {
        key: 'Any large wallet transactions on-chain today?',
        text: t`Any large wallet transactions on-chain today?`,
      },
      {
        key: 'Did any exchange see a sudden spike in long positions or short positions?',
        text: t`Did any exchange see a sudden spike in long positions or short positions?`,
      },
      {
        key: 'Have there been any unusual moves in funding rates over the past hour?',
        text: t`Have there been any unusual moves in funding rates over the past hour?`,
      },
      {
        key: 'What triggered the sudden BTC dump?',
        text: t`What triggered the sudden BTC dump?`,
      },
      {
        key: 'Are there any breaking news that moved the market?',
        text: t`Are there any breaking news that moved the market?`,
      },
    ],
  }
  const shortcutContentList = shortcutContentMap[currentShortcutRef.current || currentShortcut] || []
  const handleSendShortcut = useCallback(
    (text: string) => {
      return (e: any) => {
        e.stopPropagation()
        sendAiContent({
          value: text,
        })
        handleCloseSheet()
      }
    },
    [sendAiContent, handleCloseSheet],
  )
  const addToFavorites = useCallback(
    (text: string) => {
      return async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        const data: any = await triggerCreateShortcut({
          account: telegramUserId,
          content: text,
        })
        if (data.isSuccess) {
          await triggerGetShortcuts({
            account: telegramUserId,
          })
          toast({
            title: <Trans>Add to Favorites</Trans>,
            description: text,
            status: TOAST_STATUS.SUCCESS,
            typeIcon: 'icon-chat-star',
            iconTheme: theme.jade10,
          })
        }
      }
    },
    [theme, toast, telegramUserId, triggerGetShortcuts, triggerCreateShortcut],
  )
  const removeFromFavorites = useCallback(
    ({ id, text }: { id: string; text: string }) => {
      return async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        const data: any = await triggerDeleteShortcut({
          account: telegramUserId,
          shortcutId: id,
        })
        if (data.isSuccess) {
          await triggerGetShortcuts({
            account: telegramUserId,
          })
          toast({
            title: <Trans>Remove from Favorites</Trans>,
            description: text,
            status: TOAST_STATUS.SUCCESS,
            typeIcon: 'icon-chat-star-empty',
            iconTheme: theme.textL2,
          })
        }
      }
    },
    [theme, toast, telegramUserId, triggerGetShortcuts, triggerDeleteShortcut],
  )
  const showAddQuestionModal = useCallback(() => {
    // handleCloseSheet()
    setEditQuestionData({
      text: '',
      id: '',
    })
    toggleAddQuestionModal()
  }, [toggleAddQuestionModal])
  useEffect(() => {
    if (telegramUserId) {
      triggerGetShortcuts({
        account: telegramUserId,
      })
    }
  }, [telegramUserId, triggerGetShortcuts])
  useEffect(() => {
    if (telegramUserId && isMobile) {
      triggerGetAiStyleType({
        account: telegramUserId,
      })
    }
  }, [triggerGetAiStyleType, telegramUserId, isMobile])
  return (
    <ShortcutsWrapper ref={shortcutsRef as any}>
      {shortcutsList
        .filter((shortcut) => shortcut.value === SHORTCUT_TYPE.SHORTCUTS || shortcut.value === SHORTCUT_TYPE.STYLE_TYPE)
        .map((shortcut) => (
          <ShortcutItem
            key={shortcut.key}
            $borderColor={theme.bgT30}
            $borderRadius={8}
            $active={currentShortcut === shortcut.value}
            $hideBorder={shortcut.value === SHORTCUT_TYPE.SHORTCUTS}
            $shortcutCuts={shortcut.value}
            onClick={shortcut.callback}
          >
            {shortcut.title}
          </ShortcutItem>
        ))}
      <RightWrapper ref={scrollRef} className='scroll-style'>
        {shortcutsList
          .filter(
            (shortcut) => shortcut.value !== SHORTCUT_TYPE.SHORTCUTS && shortcut.value !== SHORTCUT_TYPE.STYLE_TYPE,
          )
          .map((shortcut) => (
            <ShortcutItem
              $borderTop
              $borderBottom
              $borderLeft
              $borderRight
              key={shortcut.key}
              $borderColor={theme.bgT30}
              $borderRadius={8}
              $active={currentShortcut === shortcut.value}
              $hideBorder={currentShortcut === shortcut.value}
              $shortcutCuts={shortcut.value}
              onClick={shortcut.callback}
            >
              {shortcut.title}
            </ShortcutItem>
          ))}
      </RightWrapper>
      <BottomSheet
        hideDragHandle={!isMobile}
        placement={isMobile ? 'top' : 'bottom'}
        positionRef={shortcutsRef as any}
        isOpen={isOpen}
        onClose={handleCloseSheet}
      >
        {currentShortcutRef.current !== SHORTCUT_TYPE.STYLE_TYPE ? (
          <CanAskContent>
            <CanAskContentTitle>
              <span>
                {currentShortcut === SHORTCUT_TYPE.SHORTCUTS ? <Trans>Shortcuts</Trans> : <Trans>You can ask</Trans>}
              </span>
              {currentShortcut === SHORTCUT_TYPE.SHORTCUTS && (
                <AddWrapper onClick={showAddQuestionModal}>
                  <IconBase className='icon-chat-upload' />
                </AddWrapper>
              )}
            </CanAskContentTitle>
            <ContentList ref={scrollRef1} className='scroll-style'>
              {shortcutContentList.length > 0 ? (
                shortcutContentList.map((item) => {
                  const { key, text } = item
                  const data = shortcuts.find((shortcut) => shortcut.content === text || String(shortcut.id) === key)
                  const isFavorite = !!data
                  return (
                    <ContentItem key={key} $currentShortcut={currentShortcut} onClick={handleSendShortcut(text)}>
                      {currentShortcut !== SHORTCUT_TYPE.SHORTCUTS && (
                        <StarWrapper
                          onClick={
                            isFavorite
                              ? removeFromFavorites({
                                  id: data?.id.toString(),
                                  text,
                                })
                              : addToFavorites(text)
                          }
                        >
                          {isFavorite ? (
                            <IconBase className='icon-chat-star' />
                          ) : (
                            <IconBase className='icon-chat-star-empty' />
                          )}
                        </StarWrapper>
                      )}
                      <span>{text}</span>
                      {currentShortcut === SHORTCUT_TYPE.SHORTCUTS && (
                        <ShortcutsEdit
                          text={text}
                          id={key}
                          operatorText={operatorText}
                          setOperatorText={setOperatorText}
                          setEditQuestionData={setEditQuestionData}
                        />
                      )}
                    </ContentItem>
                  )
                })
              ) : (
                <NoData />
              )}
            </ContentList>
          </CanAskContent>
        ) : (
          <TypeSelectContent onClose={handleCloseSheet} />
        )}
      </BottomSheet>
      {addQuestionModalOpen && <AddQuestionModal editQuestionData={editQuestionData} />}
    </ShortcutsWrapper>
  )
})
