import styled, { css } from 'styled-components'
import FileDrag from 'pages/TradeAi/components/FileDrag'
import { memo, useMemo, useRef, useState } from 'react'
import { useAiResponseContentList, useIsLoadingData, useIsRenderingData, useTempAiContentData, useThreadsList } from 'store/tradeai/hooks'
import AiThreadsList from 'pages/TradeAi/components/AiThreadsList'
import Header from '../Header'

const TradeAiWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  z-index: 1000;
  z-index: 1000;
  padding: 0 8px;
  ${({ theme }) => theme.isMobile && css`
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0;
    border-radius: 12px;
    overflow: hidden;
  `}
`

const InnerContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  ${({ theme }) => theme.isMobile && css`
    border-radius: 0;
    .file-drag-wrapper {
      border-radius: 0;
    }
  `}
`

const ThreadListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-grow: 1;
  border-radius: 16px;
`

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
