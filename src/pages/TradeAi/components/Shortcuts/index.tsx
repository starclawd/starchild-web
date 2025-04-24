import styled, { css } from 'styled-components'
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { useSendAiContent } from 'store/tradeai/hooks'
import { Trans } from '@lingui/react/macro'
import { t } from "@lingui/core/macro"
import { useTheme } from 'store/themecache/hooks'
import { vm } from 'pages/helper'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import BottomSheet from 'components/BottomSheet'
import NoData from 'components/NoData'
import { IconBase } from 'components/Icons'
import { useAddQuestionModalToggle, useModalOpen } from 'store/application/hooks'
import AddQuestionModal from '../AddQuestionModal'
import { ANI_DURATION } from 'constants/index'
import Popover from 'components/Popover'
import { ApplicationModal } from 'store/application/application.d'

const ShortcutsWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
  ${({ theme }) => theme.isMobile && css`
    padding: ${vm(4)} ${vm(12)} 0;
    gap: ${vm(4)};
    margin-bottom: ${vm(8)};
  `}
`

const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  flex: 1;
  overflow-x: auto;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(4)};
  `}
`

const ShortcutItem = styled(BorderAllSide1PxBox)<{ $active: boolean, $shortcutCuts: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 100%;
  ${({ theme, $active, $shortcutCuts }) => theme.isMobile && css`
    height: ${vm(26)};
    padding: 0 ${vm(8)};
    font-size: 0.13rem;
    font-weight: 500;
    line-height: 0.20rem;
    color: ${({ theme }) => theme.textL2};
    ${$shortcutCuts === SHORTCUT_TYPE.SHORTCUTS && css`
      background-color: ${theme.sfC1};
    `}
    ${$active && css`
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
  ${({ theme }) => theme.isMobile && css`
    height: ${vm(44)};
    text-align: center;
    padding: ${vm(8)} ${vm(20)};
    font-size: 0.2rem;
    font-weight: 500;
    line-height: 0.28rem;
    color: ${({ theme }) => theme.textL1};
    .icon-chat-upload {
      font-size: 0.24rem;
    }
  `}
`

const ContentList = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  ${({ theme }) => theme.isMobile && css`
    max-height: 60vh;
    flex-grow: 0;
    gap: ${vm(8)};
    padding: ${vm(12)} ${vm(20)} ${vm(20)};
  `}
`

const ContentItem = styled.div<{ $currentShortcut: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  ${({ theme, $currentShortcut }) => theme.isMobile && css`
    padding: ${vm(8)} ${vm(8)} ${vm(8)} ${vm(12)};
    font-size: 0.14rem;
    font-weight: 400;
    line-height: 0.20rem;
    color: ${theme.textL2};
    background-color: ${theme.sfC1};
    border-radius: ${vm(12)};
    .icon-chat-more {
      font-size: 0.18rem;
      color: ${theme.textDark54};
    }
    ${$currentShortcut !== SHORTCUT_TYPE.SHORTCUTS && css`
      padding: ${vm(8)} ${vm(12)} ${vm(8)} ${vm(8)};
      gap: ${vm(8)};
    `}
  `}
`

const StarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 100%;
  .icon-chat-star {
    color: ${({ theme }) => theme.jade10};
  }
  .icon-chat-star-empty {
    color: ${({ theme }) => theme.textL4};
  }
  ${({ theme }) => theme.isMobile && css`
    font-size: 0.18rem;
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

const ChatMoreWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 100%;
  ${({ theme }) => theme.isMobile && css`
    font-size: 0.18rem;
    color: ${theme.textL2};
  `}
`

const OperatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 0;
  right: 0;
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(270)};
    padding: ${vm(20)};
    gap: ${vm(20)};
    border-radius: ${vm(24)};
    background-color: ${theme.sfC2};
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.50);
  `}
`

const EditWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  ${({ theme }) => theme.isMobile && css`
    width: 100%;
    height: ${vm(36)};
    > span:first-child {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      gap: ${vm(12)};
      font-size: 0.16rem;
      font-weight: 500;
      line-height: 0.24rem;
      color: ${theme.textL1};
    }
    .icon-chat-expand {
      font-size: 0.18rem;
      color: ${theme.textL3};
    }
  `}
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(36)};
    height: ${vm(36)};
    border-radius: 50%;
    background-color: ${theme.sfC1};
    color: ${theme.textL2};
    .icon-chat-new,
    .icon-chat-rubbish {
      font-size: 0.18rem;
    }
  `}
`

const DeleteWrapper = styled(EditWrapper)`
  ${({ theme }) => theme.isMobile && css`
    width: 100%;
    height: ${vm(36)};
    > span:first-child {
      color: ${theme.ruby50};
      .icon-chat-rubbish {
        color: ${theme.ruby50};
      }
    }
  `}
`

enum SHORTCUT_TYPE {
  SHORTCUTS = 'Shortcuts',
  INDICATORS_AND_ANALYSIS = 'Indicators & Analysis',
  MACROECONOMIC = 'Macroeconomic',
  WEB3_EVENTS = 'Web3 Events',
}

export default memo(function Shortcuts() {
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [editQuestionText, setEditQuestionText] = useState('')
  const [currentShortcut, setCurrentShortcut] = useState('')
  const currentShortcutRef = useRef(currentShortcut)
  const sendAiContent = useSendAiContent()
  const toggleAddQuestionModal = useAddQuestionModalToggle()
  const addQuestionModalOpen = useModalOpen(ApplicationModal.ADD_QUESTION_MODAL)
  const [operatorText, setOperatorText] = useState('')
  const shortcutsRef = useRef<HTMLDivElement>(null)
  const handleCloseSheet = useCallback(() => {
    setIsOpen(false)
    setCurrentShortcut('')
    setTimeout(() => {
      currentShortcutRef.current = ''
    }, ANI_DURATION * 1000)
  }, [setIsOpen, setCurrentShortcut])
  const shortcutClick = useCallback((value: SHORTCUT_TYPE) => {
    return () => {
      if (value === currentShortcut && isOpen) {
        handleCloseSheet()
        return
      }
      setCurrentShortcut(value)
      currentShortcutRef.current = value
      setIsOpen(true)
    }
  }, [setCurrentShortcut, setIsOpen, currentShortcut, isOpen, handleCloseSheet])
  const shortcutsList = useMemo(() => {
    return [
      {
        key: 'Shortcuts',
        title: <ShortcutTitle>
          <IconBase className="icon-chat-shortcuts" />
          <Trans>Shortcuts</Trans>
        </ShortcutTitle>,
        value: SHORTCUT_TYPE.SHORTCUTS,
        callback: shortcutClick(SHORTCUT_TYPE.SHORTCUTS),
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
      [SHORTCUT_TYPE.SHORTCUTS]: [
        {
          key: 'What is the current price of Bitcoin and Ethereum?',
          text: t`What is the current price of Bitcoin and Ethereum?`,
          isFavorite: true,
        },
        {
          key: 'What are the latest and most talked-about token listings recently? What triggered the sudden BTC dump or pump?',
          text: t`What are the latest and most talked-about token listings recently? What triggered the sudden BTC dump or pump?`,
          isFavorite: false,
        },
      ],
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
    return shortcutContentMap[currentShortcutRef.current || currentShortcut] || []
  }, [currentShortcutRef, shortcutContentMap, currentShortcut])
  const handleSendShortcut = useCallback((text: string) => {
    return (e: any) => {
      e.stopPropagation()
      sendAiContent({
        value: text,
      })
      handleCloseSheet()
    }
  }, [sendAiContent, handleCloseSheet])
  const addToFavorites = useCallback((text: string) => {
    return (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      console.log('addToFavorites', text)
    }
  }, [])
  const removeFromFavorites = useCallback((text: string) => {
    return (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setOperatorText('')
      console.log('removeFromFavorites', text)
    }
  }, [])
  const showAddQuestionModal = useCallback(() => {
    // handleCloseSheet()
    setEditQuestionText('')
    toggleAddQuestionModal()
  }, [toggleAddQuestionModal])
  const changeOperatorText = useCallback((text: string) => {
    return (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      if (text === operatorText) {
        setOperatorText('')
        return
      }
      setOperatorText(text)
    }
  }, [operatorText])
  const editQuestion = useCallback((text: string) => {
    return (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setEditQuestionText(text)
      toggleAddQuestionModal()
      setOperatorText('')
    }
  }, [toggleAddQuestionModal])
  return <ShortcutsWrapper ref={shortcutsRef as any}>
    {shortcutsList.filter((shortcut) => shortcut.value === SHORTCUT_TYPE.SHORTCUTS).map((shortcut) => (
      <ShortcutItem
        key={shortcut.key}
        $borderColor={theme.bgT30}
        $borderRadius={8}
        $active={currentShortcut === shortcut.value}
        $hideBorder={true}
        $shortcutCuts={shortcut.value}
        onClick={shortcut.callback}
      >
        {shortcut.title}
      </ShortcutItem>
    ))}
    <RightWrapper>
      {shortcutsList.filter((shortcut) => shortcut.value !== SHORTCUT_TYPE.SHORTCUTS).map((shortcut) => (
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
      showFromBottom={false}
      positionRef={shortcutsRef as any}
      isOpen={isOpen} 
      onClose={handleCloseSheet}
    >
      <CanAskContent>
        <CanAskContentTitle>
          <span>
            {currentShortcut === SHORTCUT_TYPE.SHORTCUTS ? <Trans>Shortcuts</Trans> : <Trans>You can ask</Trans>}
          </span>
          {currentShortcut === SHORTCUT_TYPE.SHORTCUTS && <IconBase onClick={showAddQuestionModal} className="icon-chat-upload" />}
        </CanAskContentTitle>
        <ContentList>
          {
            shortcutContentList.length > 0 ?
            shortcutContentList.map((item) => {
              const { key, text, isFavorite } = item
              return (
                <ContentItem
                  key={key}
                  $currentShortcut={currentShortcut}
                  onClick={handleSendShortcut(text)}
                >
                  {currentShortcut !== SHORTCUT_TYPE.SHORTCUTS && <StarWrapper onClick={isFavorite ? removeFromFavorites(text) : addToFavorites(text)}>
                    {
                      isFavorite
                        ? <IconBase className="icon-chat-star" />
                        : <IconBase className="icon-chat-star-empty" />
                    }
                  </StarWrapper>}
                  <span>{text}</span>
                  {currentShortcut === SHORTCUT_TYPE.SHORTCUTS && <ChatMoreWrapper onClick={changeOperatorText(text)}>
                    <Popover
                      placement="bottom"
                      show={operatorText === text}
                      offsetTop={-38}
                      offsetLeft={18}
                      content={<OperatorWrapper>
                        <EditWrapper onClick={editQuestion(text)}>
                          <span>
                            <IconWrapper>
                              <IconBase className="icon-chat-new" />
                            </IconWrapper>
                            <span><Trans>Edit</Trans></span>
                          </span>
                          <IconBase className="icon-chat-expand" />
                        </EditWrapper>
                        <DeleteWrapper onClick={removeFromFavorites(text)}>
                          <span>
                            <IconWrapper>
                              <IconBase className="icon-chat-rubbish" />
                            </IconWrapper>
                            <span><Trans>Delete</Trans></span>
                          </span>
                          <IconBase className="icon-chat-expand" />
                        </DeleteWrapper>
                      </OperatorWrapper>}
                    >
                      <IconBase className="icon-chat-more" />
                    </Popover>
                  </ChatMoreWrapper>}
                </ContentItem>
              )
            }) :
            <NoData />
          }
        </ContentList>
      </CanAskContent>
    </BottomSheet>
    {addQuestionModalOpen && <AddQuestionModal text={editQuestionText} />}
  </ShortcutsWrapper>
})
