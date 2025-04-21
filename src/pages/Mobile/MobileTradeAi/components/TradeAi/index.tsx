import FileDrag from 'pages/TradeAi/components/FileDrag'
import { memo, useMemo, useRef, useState } from 'react'
import { useAiResponseContentList, useIsLoadingData, useIsRenderingData, useTempAiContentData, useThreadsList } from 'store/tradeai/hooks'
import {
  TradeAiWrapper,
  InnerContent,
  ThreadListWrapper,
} from './styles'
import AiThreadsList from 'pages/TradeAi/components/AiThreadsList'
import Header from '../Header'

export default memo(function TradeAi() {
  const [isAiLoading] = useIsLoadingData()
  const [isShowThreadList, setIsShowThreadList] = useState(false)
  const [isRenderingData] = useIsRenderingData()
  /* refs声明 */
  const tradeAiWrapperRef = useRef<HTMLDivElement>(null)  // 容器引用
  const [aiResponseContentList] = useAiResponseContentList()
  const tempAiContentData = useTempAiContentData()
  const [threadList] = useThreadsList()
  const isShowDefaultUi = useMemo(() => {
    return aiResponseContentList.length === 0 && !tempAiContentData.id && threadList.length === 0 && !(isAiLoading && isRenderingData)
  }, [aiResponseContentList.length, tempAiContentData.id, threadList.length, isAiLoading, isRenderingData])
  return <TradeAiWrapper
    id="tradeAiWrapperEl"
    className="trade-ai-warpper"
    ref={tradeAiWrapperRef as any}
  >
    <InnerContent>
      {(!isShowDefaultUi || isShowThreadList) && <Header
        isShowThreadList={isShowThreadList}
        setIsShowThreadList={setIsShowThreadList}
      />}
      {isShowThreadList
        ? <ThreadListWrapper>
          <AiThreadsList isMobileHistory={true} closeHistory={() => setIsShowThreadList(false)} />
        </ThreadListWrapper>
        : <FileDrag />
      }
    </InnerContent>
  </TradeAiWrapper>
})
