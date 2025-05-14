import styled, { css } from 'styled-components'
import AiThreadsList from './components/AiThreadsList'
import FileDrag from './components/FileDrag'
import { ANI_DURATION } from 'constants/index'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { useShowHistory } from 'store/tradeaicache/hooks'
import { useAddNewThread, useIsShowDeepThink, useIsShowDefaultUi } from 'store/tradeai/hooks'
import TabList from './components/DeepThink/components/TabList'
import { useState } from 'react'
import ThinkList from './components/DeepThink/components/ThinkList'
import Sources from './components/DeepThink/components/Sources'

const TradeAiWrapper = styled.div<{ $showHistory: boolean, $isShowDeepThink: boolean, $isShowDefaultUi: boolean }>`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  padding-bottom: 20px;
  ${({ $isShowDefaultUi }) => $isShowDefaultUi && css`
    justify-content: center !important;
  `}
  ${({ theme, $showHistory }) => theme.mediaMinWidth.minWidth1024`
    .threads-list-wrapper {
      width: 360px;
    }
    .left-content {
      margin-right: 20px;
      flex-grow: 1;
      max-width: 438px;
      transition: all ${ANI_DURATION}s;
    }
    .right-content {
      width: 778px;
      max-width: 778px;
      min-width: 600px;
      flex-shrink: 1;
      transition: max-width 0.2s;
    }
    ${!$showHistory && css`
      .left-content {
        max-width: 182px;
      }
    `}
  `}
  ${({ theme, $showHistory, $isShowDeepThink }) => theme.mediaMinWidth.minWidth1280`
    justify-content: space-between;
    .threads-list-wrapper {
      width: 360px;
    }
    .left-content {
      margin-right: 20px;
      flex-grow: 1;
      max-width: 438px;
    }
    .right-content {
      width: 778px;
      max-width: 778px;
      min-width: 440px;
      flex-shrink: 1;
    }
    ${$isShowDeepThink && !$showHistory
      ? css`
        .left-content {
          max-width: 182px;
        }
      `: !$showHistory && css`
        .left-content {
          max-width: 0;
        }
    `}
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1440`
  `}
  ${({ theme, $isShowDeepThink, $showHistory }) => theme.mediaMinWidth.minWidth1920`
    .threads-list-wrapper {
      width: 516px;
    }
    .left-content {
      max-width: 516px;
    }
    .right-content {
      width: 780px;
    }
    ${$isShowDeepThink && !$showHistory
      ? css`
        .left-content {
          max-width: 182px;
        }
      `: !$showHistory && css`
        .left-content {
          max-width: 0;
        }
    `}
  `}
`

const TopWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 44px;
`

const HistoryButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  gap: 8px;
  width: fit-content;
  height: 100%;
  padding: 0 18px;
  border-radius: 44px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  cursor: pointer;
  z-index: 1;
  .icon-chat-history {
    font-size: 24px;
    color: ${({ theme }) => theme.textL3};
  }
  span {
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL3};
  }
`

const NewThread = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.bgT30};
  cursor: pointer;
  .icon-chat-new {
    font-size: 24px;
    color: ${({ theme }) => theme.textL3};
  }
`

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
  width: auto;
  padding-top: 20px;
`

const RightContent = styled.div<{ $showHistory: boolean, $isShowDefaultUi: boolean }>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width ${ANI_DURATION}s;
  will-change: width;
  ${({ $isShowDefaultUi }) => $isShowDefaultUi && css`
    width: 800px !important;
    gap: 30px;
  `}
  ${({ $showHistory }) => !$showHistory && css`
    margin-left: 0 !important;
  `}
`

const DeepThinkContent = styled.div<{ $isShowDeepThink: boolean }>`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: -360px;
  gap: 20px;
  flex-shrink: 0;
  width: 360px;
  height: 100%;
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  background-color: ${({ theme }) => theme.bgL1};
  box-shadow: -4px 0px 4px 0px ${({ theme }) => theme.systemShadow};
  ${({ theme, $isShowDeepThink }) => theme.mediaMinWidth.minWidth1024`
    transition: transform ${ANI_DURATION}s;
    ${$isShowDeepThink && css`
      right: -346px;
      transform: translateX(-100%);
    `}
  `}
  ${({ theme, $isShowDeepThink }) => theme.mediaMinWidth.minWidth1280`
    position: unset;
    transform: unset;
    transition: width ${ANI_DURATION}s;
    overflow: hidden;
    ${!$isShowDeepThink && css`
      width: 0;
      border: none;
    `}
  `}
`

const DeepThinkInnerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-shrink: 0;
  width: 360px;
  height: 100%;
  padding: 16px;
`

const TabWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  .tab-list-wrapper {
    width: 240px;
  }
  .icon-chat-close {
    font-size: 28px;
    color: ${({ theme }) => theme.textL4};
    cursor: pointer;
  }
`

export default function TradeAi() {
  const [tabIndex, setTabIndex] = useState(0)
  const isShowDefaultUi = useIsShowDefaultUi()
  const addNewThread = useAddNewThread()
  const [isShowDeepThink, setIsShowDeepThink] = useIsShowDeepThink()
  const [showHistory, setShowHistory] = useShowHistory()
  return <TradeAiWrapper $isShowDefaultUi={isShowDefaultUi} $showHistory={showHistory} $isShowDeepThink={isShowDeepThink}>
    <LeftContent style={{ display: isShowDefaultUi ? 'none' : 'flex' }} className="left-content">
      <TopWrapper>
        <HistoryButton onClick={() => setShowHistory(!showHistory)}>
          <IconBase className="icon-chat-history" />
          <span><Trans>History</Trans></span>
        </HistoryButton>
        <NewThread onClick={addNewThread}>
          <IconBase className="icon-chat-new" />
        </NewThread>
      </TopWrapper>
      <AiThreadsList />
    </LeftContent>
    <RightContent $showHistory={showHistory} $isShowDefaultUi={isShowDefaultUi} className="right-content">
      <FileDrag />
    </RightContent>
    <DeepThinkContent $isShowDeepThink={isShowDeepThink}>
      <DeepThinkInnerContent>
        <TabWrapper>
          <TabList
            tabIndex={tabIndex}
            setTabIndex={setTabIndex}
            thoughtListLength={0}
          />
          <IconBase onClick={() => setIsShowDeepThink(false)} className="icon-chat-close" />
        </TabWrapper>
        {tabIndex === 0 && <ThinkList thoughtList={[]} />}
        {tabIndex === 1 && <Sources sourceList={[]} />}
      </DeepThinkInnerContent>
    </DeepThinkContent>
  </TradeAiWrapper>
}
