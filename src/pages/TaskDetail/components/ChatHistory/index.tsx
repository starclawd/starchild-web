import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import Markdown from 'components/Markdown'
import useToast, { TOAST_STATUS } from 'components/Toast'
import copy from 'copy-to-clipboard'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { vm } from 'pages/helper'
import { useCallback, useMemo } from 'react'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { BorderBottom1PxBox } from 'styles/borderStyled'

const ChatHistoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  height: 100%;
  ${({ theme }) => theme.isMobile && css`
    width: 100%;
    min-width: 100%;
  `}
`

const ChatHistoryItem = styled(BorderBottom1PxBox)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 28px;
  padding-bottom: 40px;
  margin-bottom: 40px;
  &:last-child {
    margin-bottom: 0;
    border-bottom: none;
  }
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(28)};
    padding-bottom: ${vm(40)};
    margin-bottom: ${vm(40)};
  `}
`

const Title = styled.div`
  font-size: 26px;
  font-weight: 500;
  line-height: 34px; 
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) => theme.isMobile && css`
    font-size: 0.26rem;
    line-height: 0.34rem;
  `}
`

const UpdateTime = styled.div`
  font-size: 13px;
  font-weight: 400;
  line-height: 20px; 
  color: ${({ theme }) => theme.textL3};
  ${({ theme }) => theme.isMobile && css`
    font-size: 0.13rem;
    line-height: 0.2rem;
  `}
`

const Content = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
  color: ${({ theme }) => theme.textL2};
  ${({ theme }) => theme.isMobile && css`
    font-size: 0.16rem;
    line-height: 0.26rem;
  `}
`

const CopyWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
  .icon-chat-copy {
    font-size: 18px;
    color: ${({ theme }) => theme.textL3};
  }
  ${({ theme }) => theme.isMobile
  ? css`
      gap: ${vm(4)};
      font-size: 0.14rem;
      line-height: 0.2rem;
      .icon-chat-copy {
        font-size: 0.18rem;
      }
    `
    : css`
      cursor: pointer;
    `}
`

export default function ChatHistory() {
  const theme = useTheme()
  const toast = useToast()
  const list = useMemo(() => {
    return [
      {
        title: 'WOO Market Recap – June 8, 2025',
        updateTime: '2025-06-08 10:00:00',
        content: "*ETH 技术面快照*  \n``当前价≈2 515 USD``（24H 2 496 – 2 540）\n\n🕸 **趋势结构**  \n• 30 日 K 线保持 *震荡上升通道*，低点逐步抬高。  \n• 20 日均线已上穿 50 日均线，短期多头占优。  \n• 价格多次回踩 *2 500 ± 20* 区域获支撑，显示买盘承接。\n\n📏 **关键价位**  \n• *第一支撑*：2 500 美元  \n• *次级支撑*：2 445 – 2 495 区间  \n• *短线阻力*：2 600 美元  \n• *突破目标*：若日线收于 2 600 上方，技术位指向 2 700 – 2 900；主流分析师看向 *中期 3 000 – 3 300*（见新闻）。\n\n📊 **动量指标**  \n• MACD 日线红柱逐步放大，快慢线零轴上方发散，动能温和增强。  \n• RSI 55 – 60，未触及超买，仍有上行空间。  \n• 成交量在上行日放大、回调日缩量，量价配合健康。\n\n💬 **市场情绪**  \n• ETF *15 天连续净流入*，资金面支持多头。  \n• Twitter 舆情以“看涨/鲸鱼建仓”贴文居多，社媒情绪偏乐观。  \n• On-chain 活跃度再创新高，侧面验证基本面热度。\n\n⚠️ **风险信号**  \n• 若跌破 2 500 并失守 20 日均线，或回测 2 445 低区；MACD 若出现顶背离需谨慎。  \n• 美联储宏观事件及 VIX 波动仍可能带来短线冲击。\n\n🎯 **策略示例（仅作参考）**  \n1. *趋势跟随*：2 500 – 2 520 区间分批建仓，止损 2 440，下看 2 600 / 2 700。  \n2. *突破交易*：日线实体站稳 2 600 后入场，目标 2 900 上下，移动止盈。  \n3. *区间套利*：2 445 – 2 600 内高抛低吸，配合 RSI 40 / 60 分仓操作。\n\n📌 **结论**  \nETH 目前处于 *震荡上扬+量价共振* 的多头结构；``2 600`` 是短期风向标，上破将打开更大上行空间，失守 2 500 则警惕回踩。结合资金流与链上数据，*中期偏多* 但需关注宏观变量。\n\n> 投资有风险，以上仅为技术视角，不构成投资建议。"
      },
      {
        title: 'WOO Market Recap – June 8, 2025',
        updateTime: '2025-06-08 10:00:00',
        content: "*ETH 技术面快照*  \n``当前价≈2 515 USD``（24H 2 496 – 2 540）\n\n🕸 **趋势结构**  \n• 30 日 K 线保持 *震荡上升通道*，低点逐步抬高。  \n• 20 日均线已上穿 50 日均线，短期多头占优。  \n• 价格多次回踩 *2 500 ± 20* 区域获支撑，显示买盘承接。\n\n📏 **关键价位**  \n• *第一支撑*：2 500 美元  \n• *次级支撑*：2 445 – 2 495 区间  \n• *短线阻力*：2 600 美元  \n• *突破目标*：若日线收于 2 600 上方，技术位指向 2 700 – 2 900；主流分析师看向 *中期 3 000 – 3 300*（见新闻）。\n\n📊 **动量指标**  \n• MACD 日线红柱逐步放大，快慢线零轴上方发散，动能温和增强。  \n• RSI 55 – 60，未触及超买，仍有上行空间。  \n• 成交量在上行日放大、回调日缩量，量价配合健康。\n\n💬 **市场情绪**  \n• ETF *15 天连续净流入*，资金面支持多头。  \n• Twitter 舆情以“看涨/鲸鱼建仓”贴文居多，社媒情绪偏乐观。  \n• On-chain 活跃度再创新高，侧面验证基本面热度。\n\n⚠️ **风险信号**  \n• 若跌破 2 500 并失守 20 日均线，或回测 2 445 低区；MACD 若出现顶背离需谨慎。  \n• 美联储宏观事件及 VIX 波动仍可能带来短线冲击。\n\n🎯 **策略示例（仅作参考）**  \n1. *趋势跟随*：2 500 – 2 520 区间分批建仓，止损 2 440，下看 2 600 / 2 700。  \n2. *突破交易*：日线实体站稳 2 600 后入场，目标 2 900 上下，移动止盈。  \n3. *区间套利*：2 445 – 2 600 内高抛低吸，配合 RSI 40 / 60 分仓操作。\n\n📌 **结论**  \nETH 目前处于 *震荡上扬+量价共振* 的多头结构；``2 600`` 是短期风向标，上破将打开更大上行空间，失守 2 500 则警惕回踩。结合资金流与链上数据，*中期偏多* 但需关注宏观变量。\n\n> 投资有风险，以上仅为技术视角，不构成投资建议。"
      },
      
    ]
  }, [])
  const copyContent = useCallback((content: string) => {
    copy(content)
    toast({
      title: <Trans>Copied</Trans>,
      description: content,
      status: TOAST_STATUS.SUCCESS,
      typeIcon: 'icon-chat-copy',
      iconTheme: theme.textL1,
    })
  }, [toast, theme.textL1])
  const chatHistoryRef = useScrollbarClass<HTMLDivElement>()
  return <ChatHistoryWrapper ref={chatHistoryRef} className="scroll-style">
    {list.map((item, index) => {
      const { title, updateTime, content } = item
      return <ChatHistoryItem
        key={index}
        $borderColor={theme.lineDark8}
      >
        <Title>
          {title}
        </Title>
        <UpdateTime>
          {updateTime}
        </UpdateTime>
        <Content>
          <Markdown>
            {content}
          </Markdown>
        </Content>
        <CopyWrapper onClick={() => copyContent(content)}>
          <IconBase className="icon-chat-copy" />
          <Trans>Copy</Trans>
        </CopyWrapper>
      </ChatHistoryItem>
    })}
  </ChatHistoryWrapper>
}
