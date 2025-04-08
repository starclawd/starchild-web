/**
 * TradeAi 交易AI助手组件
 * 提供AI辅助交易功能的可拖拽浮动窗口
 * 支持订单模式和聊天模式的切换
 */
import { Trans } from '@lingui/react/macro'
import { IconAiHis } from 'components/Icons'
import FileDrag from 'pages/TradeAi/components/FileDrag'
import { memo, useCallback, useRef, useState } from 'react'
import { useIsMobile } from 'store/application/hooks'
import { useIsLoadingData, useIsRenderingData } from 'store/tradeai/hooks'
import {
  TradeAiWrapper,
  InnerContent,
  TopOperator,
  ControlWrapper,
  ControlButton,
  OperatorWrapper,
  ThreadListWrapper
} from './styles'
import AiThreadsList from 'pages/TradeAi/components/AiThreadsList'
import { TRADE_AI_TYPE } from 'store/tradeai/tradeai.d'

/**
 * TradeAi组件
 * 实现AI交易助手的核心功能：
 * 1. 支持窗口拖拽和位置调整
 * 2. 提供订单模式和聊天模式
 * 3. 集成文件拖放上传功能
 * 4. 响应式布局适配移动端
 */
export default memo(function TradeAi() {
  /* hooks声明 */
  const isMobile = useIsMobile()
  const [isAiLoading] = useIsLoadingData()
  const [isShowThreadList, setIsShowThreadList] = useState(false)
  const [isRenderingData] = useIsRenderingData()
  /* refs声明 */
  const tradeAiWrapperRef = useRef<HTMLDivElement>(null)  // 容器引用
  const controlButtonWrapperRef = useRef<HTMLDivElement>(null)  // 控制按钮容器引用 
  const showHistory = useCallback(() => {
    if (isAiLoading || isRenderingData) return
    setIsShowThreadList(true)
  }, [isAiLoading, isRenderingData])

  return <TradeAiWrapper
    id="tradeAiWrapperEl"
    className="trade-ai-warpper"
    ref={tradeAiWrapperRef as any}
  >
    {!isShowThreadList
      ? <InnerContent>
          <TopOperator>
            <ControlWrapper
              ref={controlButtonWrapperRef as any}
          >
            {!isMobile && <ControlButton>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </ControlButton>}
            <span><Trans>AI Agent</Trans></span>
          </ControlWrapper>
          <OperatorWrapper>
            <IconAiHis onClick={showHistory} />
          </OperatorWrapper>
          {/* {isGrabbingTradeAi && <Mask />} */}
        </TopOperator>
        <FileDrag tradeAiTypeProp={TRADE_AI_TYPE.ORDER_TYPE} />
      </InnerContent>
      : <ThreadListWrapper>
        <AiThreadsList isOrderHis={true} closeHistory={() => setIsShowThreadList(false)} />
      </ThreadListWrapper>}
  </TradeAiWrapper>
})
