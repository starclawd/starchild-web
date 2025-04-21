import styled, { css } from 'styled-components'
import { memo, ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import { useSendAiContent } from 'store/tradeai/hooks'
import { Trans } from '@lingui/react/macro'
import { t } from "@lingui/core/macro"
import { useTheme } from 'store/theme/hooks'
import { vm } from 'pages/helper'
import { BorderBox } from 'styles/theme'
import BottomSheet from 'components/BottomSheet'
import NoData from 'components/NoData'
import { IconBase } from 'components/Icons'
import { useAddQuestionModalToggle } from 'store/application/hooks'
import AddQuestionModal from '../AddQuestionModal'
import { ANI_DURATION } from 'constants/index'

const ShortcutsWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  overflow-x: auto;
  padding: 0 ${vm(12)};
  ${({ theme }) => theme.isMobile && css`
    height: ${vm(24)};
    gap: ${vm(4)};
    margin-bottom: ${vm(8)};
  `}
`

const ShortcutItem = styled(BorderBox)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 100%;
  ${({ theme, $active }) => theme.isMobile && css`
    padding: 0 ${vm(8)};
    font-size: 0.13rem;
    font-weight: 500;
    line-height: 0.20rem;
    color: ${({ theme }) => theme.textL2};
    ${$active && css`
      border: 1px solid transparent;
      background-color: #335FFC;
      color: ${theme.textL1};
    `}
  `}
`

const CanAskContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`

const CanAskContentTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  height: ${vm(44)};
  text-align: center;
  padding: ${vm(8)} ${vm(20)};
  font-size: 0.2rem;
  font-weight: 500;
  line-height: 0.28rem;
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) => theme.isMobile && css`
    .icon-chat-upload {
      font-size: 0.24rem;
    }
  `}
`

const ContentList = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 60vh;
  flex-grow: 0;
  gap: ${vm(8)};
  padding: ${vm(20)};
  overflow: auto;
`

const ContentItem = styled(BorderBox)`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(4)};
    padding: ${vm(2)} ${vm(12)} ${vm(2)} ${vm(1)};
    font-size: 0.12rem;
    font-weight: 700;
    line-height: 0.18rem;
    color: ${theme.textL2};
  `}
`

const StarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  .icon-chat-star {
    color: ${({ theme }) => theme.jade10};
  }
  .icon-chat-star-empty {
    color: ${({ theme }) => theme.textL4};
  }
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(24)};
    height: ${vm(24)};
    border-radius: 50%;
    background-color: ${theme.bgL1};
    font-size: 0.14rem;
  `}
`

const ShortcutTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(4)};
    .icon-chat-upload {
      font-size: 0.18rem;
      color: ${theme.textL2};
    }
  `}
`

enum SHORTCUT_TYPE {
  FAVORITES = 'Favorites',
  INDICATORS_AND_ANALYSIS = 'Indicators & Analysis',
  MACROECONOMIC = 'Macroeconomic',
  WEB3_EVENTS = 'Web3 Events',
}

export default memo(function Shortcuts() {
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [currentShortcut, setCurrentShortcut] = useState('')
  const sendAiContent = useSendAiContent()
  const toggleAddQuestionModal = useAddQuestionModalToggle()
  const shortcutsRef = useRef<HTMLDivElement>(null)
  const handleCloseSheet = useCallback(() => {
    setIsOpen(false)
    setTimeout(() => {
      setCurrentShortcut('')
    }, ANI_DURATION * 1000)
  }, [setIsOpen, setCurrentShortcut])
  const shortcutClick = useCallback((value: SHORTCUT_TYPE) => {
    return () => {
      if (value === currentShortcut && isOpen) {
        handleCloseSheet()
        return
      }
      setCurrentShortcut(value)
      setIsOpen(true)
    }
  }, [setCurrentShortcut, setIsOpen, currentShortcut, isOpen, handleCloseSheet])
  const shortcutsList = useMemo(() => {
    return [
      {
        key: 'Favorites',
        title: <ShortcutTitle>
          <IconBase className="icon-chat-shortcuts" />
          <Trans>Shortcuts</Trans>
        </ShortcutTitle>,
        value: SHORTCUT_TYPE.FAVORITES,
        callback: shortcutClick(SHORTCUT_TYPE.FAVORITES),
      },
      {
        key: 'Indicators & Analysis',
        title: t`Indicators & Analysis`,
        value: SHORTCUT_TYPE.INDICATORS_AND_ANALYSIS,
        callback: shortcutClick(SHORTCUT_TYPE.INDICATORS_AND_ANALYSIS),
      },
      {
        key: 'Macroeconomic',
        title: t`Macroeconomic`,
        value: SHORTCUT_TYPE.MACROECONOMIC,
        callback: shortcutClick(SHORTCUT_TYPE.MACROECONOMIC),
      },
      {
        key: 'Web3 Events',
        title: t`Web3 Events`,
        value: SHORTCUT_TYPE.WEB3_EVENTS,
        callback: shortcutClick(SHORTCUT_TYPE.WEB3_EVENTS),
      },
      
    ]
  }, [shortcutClick])
  const shortcutContentMap: Record<string, { key: string; text: string; isFavorite: boolean }[]> = useMemo(() => {
    return {
      [SHORTCUT_TYPE.FAVORITES]: [],
      [SHORTCUT_TYPE.INDICATORS_AND_ANALYSIS]: [
        {
          key: 'What economic data or meeting will be released this week? What are the market expectations?',
          text: t`What economic data or meeting will be released this week? What are the market expectations?`,
          isFavorite: true,
        },
        {
          key: 'What are the latest and most talked-about token listings recently? What triggered the sudden BTC dump or pump?',
          text: t`What are the latest and most talked-about token listings recently? What triggered the sudden BTC dump or pump?`,
          isFavorite: false,
        },
        {
          key: 'On which day did BTC record its biggest single-day gain, and by how much?',
          text: t`On which day did BTC record its biggest single-day gain, and by how much?`,
          isFavorite: false,
        },
        {
          key: 'Give a technical analysis of BTC and ETH prices.',
          text: t`Give a technical analysis of BTC and ETH prices.`,
          isFavorite: false,
        },
        {
          key: 'What s the long/short accounts ratio and long/short position ratio on Binance, OKX, and Bybit?',
          text: t`What's the long/short accounts ratio and long/short position ratio on Binance, OKX, and Bybit?`,
          isFavorite: false,
        },
        {
          key: 'How is AI being integrated with blockchain technology?',
          text: t`How is AI being integrated with blockchain technology?`,
          isFavorite: false,
        },
        {
          key: 'Whats the latest news about Bitcoin ETFs?',
          text: t`What's the latest news about Bitcoin ETFs?`,
          isFavorite: false,
        },
        {
          key: 'What security incidents have happened recently in crypto?',
          text: t`What security incidents have happened recently in crypto?`,
          isFavorite: false,
        },
      ],
      [SHORTCUT_TYPE.MACROECONOMIC]: [
        {
          key: 'What is the current price of Bitcoin and Ethereum?',
          text: t`What is the current price of Bitcoin and Ethereum?`,
          isFavorite: false,
        },
        {
          key: 'Which altcoins have the best recent performance?',
          text: t`Which altcoins have the best recent performance?`,
          isFavorite: false,
        },
        {
          key: 'What are the top gainers and losers today?',
          text: t`What are the top gainers and losers today?`,
          isFavorite: false,
        },
        {
          key: 'What are the most traded tokens in the last 24 hours?',
          text: t`What are the most traded tokens in the last 24 hours?`,
          isFavorite: false,
        },
        {
          key: 'How is the overall crypto market sentiment?',
          text: t`How is the overall crypto market sentiment?`,
          isFavorite: false,
        },
        {
          key: 'Which sectors are outperforming in the crypto market?',
          text: t`Which sectors are outperforming in the crypto market?`,
          isFavorite: false,
        },
        {
          key: 'What are the biggest whales buying or selling?',
          text: t`What are the biggest whales buying or selling?`,
          isFavorite: false,
        },
        {
          key: 'What s the correlation between crypto and traditional markets?',
          text: t`What's the correlation between crypto and traditional markets?`,
          isFavorite: false,
        },
      ],
      [SHORTCUT_TYPE.WEB3_EVENTS]: [],
    }
  }, [])
  const shortcutContentList = useMemo(() => {
    return shortcutContentMap[currentShortcut] || []
  }, [currentShortcut, shortcutContentMap])
  const handleSendShortcut = useCallback((text: string) => {
    return (e: any) => {
      e.stopPropagation()
      sendAiContent({
        value: text,
      })
      handleCloseSheet()
    }
  }, [sendAiContent, handleCloseSheet])
  const addToFavorites = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    console.log('addToFavorites')
  }, [])
  const removeFromFavorites = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    console.log('removeFromFavorites')
  }, [])
  const showAddQuestionModal = useCallback(() => {
    handleCloseSheet()
    toggleAddQuestionModal()
  }, [toggleAddQuestionModal, handleCloseSheet])
  return <ShortcutsWrapper ref={shortcutsRef as any}>
    {shortcutsList.map((shortcut) => (
      <ShortcutItem
        $borderTop
        $borderBottom
        $borderLeft
        $borderRight
        key={shortcut.key}
        $borderColor={theme.bgT30}
        $borderRadius={8}
        $active={currentShortcut === shortcut.value}
        onClick={shortcut.callback}
      >
        {shortcut.title}
      </ShortcutItem>
    ))}
    <BottomSheet
      positionRef={shortcutsRef as any}
      isOpen={isOpen} 
      onClose={handleCloseSheet}
    >
      <CanAskContent>
        <CanAskContentTitle>
          <span><Trans>You can ask</Trans></span>
          {currentShortcut === SHORTCUT_TYPE.FAVORITES && <IconBase onClick={showAddQuestionModal} className="icon-chat-upload" />}
        </CanAskContentTitle>
        <ContentList>
          {
            shortcutContentList.length > 0 ?
            shortcutContentList.map((item) => {
              const { key, text, isFavorite } = item
              return (
                <ContentItem
                  key={key}
                  $borderTop
                  $borderBottom
                  $borderLeft
                  $borderRight
                  $borderColor={theme.bgT30}
                  $borderRadius={60}
                  onClick={handleSendShortcut(text)}
                >
                  <StarWrapper onClick={isFavorite ? removeFromFavorites : addToFavorites}>
                    {
                      isFavorite
                        ? <IconBase className="icon-chat-star" />
                        : <IconBase className="icon-chat-star-empty" />
                    }
                  </StarWrapper>
                  <span>{text}</span>
                </ContentItem>
              )
            }) :
            <NoData />
          }
        </ContentList>
      </CanAskContent>
    </BottomSheet>
    <AddQuestionModal />
  </ShortcutsWrapper>
})
