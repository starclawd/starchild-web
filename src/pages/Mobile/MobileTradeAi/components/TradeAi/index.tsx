import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import FileDrag from 'pages/TradeAi/components/FileDrag'
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { useAiResponseContentList, useIsLoadingData, useIsRenderingData, useTempAiContentData } from 'store/tradeai/hooks'
import {
  TradeAiWrapper,
  InnerContent,
  TopOperator,
  NewThreadButton,
  ShowHistoryIcon,
  ThreadListWrapper,
  TopOperatorWrapper
} from './styles'
import AiThreadsList from 'pages/TradeAi/components/AiThreadsList'
import { TRADE_AI_TYPE } from 'store/tradeai/tradeai.d'

export default memo(function TradeAi() {
  const [isAiLoading] = useIsLoadingData()
  const [isShowThreadList, setIsShowThreadList] = useState(false)
  const [isRenderingData] = useIsRenderingData()
  /* refs声明 */
  const tradeAiWrapperRef = useRef<HTMLDivElement>(null)  // 容器引用
  const [aiResponseContentList] = useAiResponseContentList()
  const tempAiContentData = useTempAiContentData()
  const isShowDefaultUi = useMemo(() => {
    return aiResponseContentList.length === 0 && !tempAiContentData.id
  }, [aiResponseContentList.length, tempAiContentData.id])
  const showHistory = useCallback(() => {
    if (isAiLoading || isRenderingData) return
    setIsShowThreadList(true)
  }, [isAiLoading, isRenderingData])

  return <TradeAiWrapper
    id="tradeAiWrapperEl"
    className="trade-ai-warpper"
    ref={tradeAiWrapperRef as any}
  >
    <InnerContent>
      <TopOperatorWrapper>
        <TopOperator>
          <ShowHistoryIcon onClick={showHistory}>
            <IconBase className="icon-chat-history" />
        </ShowHistoryIcon>
        <span><Trans>Chat</Trans></span>
        <NewThreadButton>
          <IconBase className="icon-chat-new" />
          </NewThreadButton>
        </TopOperator>
      </TopOperatorWrapper>
      {isShowThreadList
        ? <ThreadListWrapper>
          <AiThreadsList isOrderHis={true} closeHistory={() => setIsShowThreadList(false)} />
        </ThreadListWrapper>
        : <FileDrag tradeAiTypeProp={TRADE_AI_TYPE.ORDER_TYPE} />
      }
    </InnerContent>
  </TradeAiWrapper>
})
