import styled, { css } from 'styled-components'
import AiThreadsList from './components/AiThreadsList'
import FileDrag from './components/FileDrag'
import { ANI_DURATION } from 'constants/index'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { useShowHistory } from 'store/tradeaicache/hooks'
import { useIsShowDefaultUi } from 'store/tradeai/hooks'

const TradeAiWrapper = styled.div<{ $showHistory: boolean }>`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
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

const HistoryButton = styled.div`
  position: absolute;
  top: 32px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  gap: 8px;
  width: fit-content;
  height: 44px;
  padding: 0 18px;
  border-radius: 44px;
  border: 1px solid ${({ theme }) => theme.textL6};
  cursor: pointer;
  z-index: 1;
  .icon-chat-history {
    font-size: 24px;
    color: ${({ theme }) => theme.textL1};
  }
  span {
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL1};
  }
`

const LeftContent = styled.div`
  display: flex;
  flex-shrink: 0;
  width: auto;
`

const RightContent = styled.div<{ $isShowDefaultUi: boolean }>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width ${ANI_DURATION}s;
  will-change: width;
  ${({ $isShowDefaultUi }) => $isShowDefaultUi && css`
    width: 800px !important;
    gap: 30px;
  `}
`

export default function TradeAi() {
  const isShowDefaultUi = useIsShowDefaultUi()
  const [showHistory, setShowHistory] = useShowHistory()
  return <TradeAiWrapper $showHistory={showHistory}>
    {!isShowDefaultUi && <HistoryButton onClick={() => setShowHistory(!showHistory)}>
      <IconBase className="icon-chat-history" />
      <span><Trans>History</Trans></span>
    </HistoryButton>}
    <LeftContent style={{ display: isShowDefaultUi ? 'none' : 'flex' }} className="left-content">
      <AiThreadsList />
    </LeftContent>
    <RightContent $isShowDefaultUi={isShowDefaultUi} className="right-content">
      <FileDrag />
    </RightContent>
  </TradeAiWrapper>
}
