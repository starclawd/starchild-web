import styled, { css } from 'styled-components'
import AiThreadsList from './components/AiThreadsList'
import FileDrag from './components/FileDrag'
import { ANI_DURATION } from 'constants/index'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { useShowHistory } from 'store/tradeaicache/hooks'
import { useAddNewThread, useIsShowDefaultUi } from 'store/tradeai/hooks'
import TabList from './components/DeepThink/components/TabList'
import { useState } from 'react'
import ThinkList from './components/DeepThink/components/ThinkList'
import Sources from './components/DeepThink/components/Sources'

const TradeAiWrapper = styled.div<{ $showHistory: boolean }>`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding-bottom: 20px;
  ${({ theme }) => theme.mediaMinWidth.minWidth1024`
    .threads-list-wrapper {
      width: 380px;
    }
    .right-content {
      width: 564px;
      margin-left: 32px;
    }
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1280`
    .threads-list-wrapper {
      width: 380px;
    }
    .right-content {
      width: 780px;
      margin-left: 52px;
    }
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1440`
    .threads-list-wrapper {
      width: 516px;
    }
    .right-content {
      width: 780px;
      margin-left: 62px;
    }
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1920`
    .threads-list-wrapper {
      width: 516px;
    }
    .right-content {
      width: 780px;
       margin-left: 274px;
    }
  `}
`

const TopWrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 0;
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
  flex-shrink: 0;
  width: auto;
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

const DeepThinkContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-shrink: 0;
  width: 360px;
  height: 100%;
  padding: 16px;
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  background-color: ${({ theme }) => theme.bgL1};
  box-shadow: ${({ theme }) => theme.systemShadow};
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
  const [showHistory, setShowHistory] = useShowHistory()
  return <TradeAiWrapper $showHistory={showHistory}>
    {!isShowDefaultUi && <TopWrapper>
      <HistoryButton onClick={() => setShowHistory(!showHistory)}>
        <IconBase className="icon-chat-history" />
        <span><Trans>History</Trans></span>
      </HistoryButton>
      <NewThread onClick={addNewThread}>
        <IconBase className="icon-chat-new" />
      </NewThread>
    </TopWrapper>}
    <LeftContent style={{ display: isShowDefaultUi ? 'none' : 'flex' }} className="left-content">
      <AiThreadsList />
    </LeftContent>
    <RightContent $showHistory={showHistory} $isShowDefaultUi={isShowDefaultUi} className="right-content">
      <FileDrag />
    </RightContent>
    <DeepThinkContent>
      <TabWrapper>
        <TabList
          tabIndex={tabIndex}
          setTabIndex={setTabIndex}
          thoughtListLength={1}
        />
        <IconBase className="icon-chat-close" />
      </TabWrapper>
      {tabIndex === 0 && <ThinkList thoughtList={[]} />}
      {tabIndex === 1 && <Sources sourceList={[1]} />}
    </DeepThinkContent>
  </TradeAiWrapper>
}
