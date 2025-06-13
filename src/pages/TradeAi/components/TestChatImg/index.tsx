import { useCallback, useState } from 'react'
import { useGetChartImg, useGetOpenAiData } from 'store/tradeai/hooks'
import { TempAiContentDataType } from 'store/tradeai/tradeai'
import styled, { css, useTheme } from 'styled-components'
import { vm } from 'pages/helper'
import { ANI_DURATION } from 'constants/index'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { IconBase } from 'components/Icons'
import ImgModal from './ImgModal'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { Trans } from '@lingui/react/macro'
import Pending from 'components/Pending'
import { addTextToImage } from 'utils/imageUtils'
import { SYSTEM_PROMPT } from './prompt'

const IconWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textL1};
  min-width: 32px;
  height: 32px;
  transition: all ${ANI_DURATION}s;
  i {
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }
  span {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.ruby50};
  }
  ${({ theme }) => theme.isMobile
  ? css`
    min-width: ${vm(32)};
    height: ${vm(32)};
    i {
      font-size: 0.18rem;
    }
    span {
      font-size: .12rem;
      font-weight: 400;
      line-height: .18rem;
    }
    &:active {
      background-color: ${({ theme }) => theme.bgT30};
    }
  ` : css`
    cursor: pointer;
    &:hover {
      background-color: ${({ theme }) => theme.bgT30};
    }
  `}
`

export default function TestChatImg({
  data,
}: {
  data: TempAiContentDataType
}) {
  const theme = useTheme()
  const toast = useToast()
  const [isShowModal, setIsShowModal] = useState(false)
  const [imgList, setImgList] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const triggerChartImg = useGetChartImg()
  const triggerChatCompletions = useGetOpenAiData()

  /**
   * 在图片上添加文本的方法
   * @param text 要添加的文本
   * @param imageUrl 图片URL
   * @returns Promise<string> 返回包含文本的新图片的 data URL
   */
  const addTextToImageWithOptions = useCallback(async (text: string, imageUrl: string, parameter: any): Promise<string> => {
    try {
      const result = await addTextToImage({
        text,
        imageUrl,
        parameter,
      })
      return result
    } catch (error) {
      console.error('添加文本到图片失败:', error)
      throw error
    }
  }, [])

  const getChartImg = useCallback(async (testConfig: any) => {
    // '1m', '3m', '5m', '15m', '30m', '45m', '1h', '2h', '3h', '4h', '6h', '12h', '1D', '1W', '1M', '3M', '6M', '1Y'
    const now = new Date()
    const to = now.toISOString()
    let from: string

    // 根据interval计算需要多少时间才能有100根柱子
    switch (testConfig.interval) {
      case '1m':
        from = new Date(now.getTime() - 100 * 60 * 1000).toISOString() // 100分钟前
        break
      case '3m':
        from = new Date(now.getTime() - 100 * 3 * 60 * 1000).toISOString() // 300分钟前
        break
      case '5m':
        from = new Date(now.getTime() - 100 * 5 * 60 * 1000).toISOString() // 500分钟前
        break
      case '15m':
        from = new Date(now.getTime() - 100 * 15 * 60 * 1000).toISOString() // 1500分钟前
        break
      case '30m':
        from = new Date(now.getTime() - 100 * 30 * 60 * 1000).toISOString() // 3000分钟前
        break
      case '45m':
        from = new Date(now.getTime() - 100 * 45 * 60 * 1000).toISOString() // 4500分钟前
        break
      case '1h':
        from = new Date(now.getTime() - 100 * 60 * 60 * 1000).toISOString() // 100小时前
        break
      case '2h':
        from = new Date(now.getTime() - 100 * 2 * 60 * 60 * 1000).toISOString() // 200小时前
        break
      case '3h':
        from = new Date(now.getTime() - 100 * 3 * 60 * 60 * 1000).toISOString() // 300小时前
        break
      case '4h':
        from = new Date(now.getTime() - 100 * 4 * 60 * 60 * 1000).toISOString() // 400小时前
        break
      case '6h':
        from = new Date(now.getTime() - 100 * 6 * 60 * 60 * 1000).toISOString() // 600小时前
        break
      case '12h':
        from = new Date(now.getTime() - 100 * 12 * 60 * 60 * 1000).toISOString() // 1200小时前
        break
      case '1D':
      case '1d':
        from = new Date(now.getTime() - 100 * 24 * 60 * 60 * 1000).toISOString() // 100天前
        break
      case '1W':
      case '1w':
        from = new Date(now.getTime() - 100 * 7 * 24 * 60 * 60 * 1000).toISOString() // 100周前
        break
      case '1M':
        from = new Date(now.getTime() - 100 * 30 * 24 * 60 * 60 * 1000).toISOString() // 约100个月前
        break
      case '3M':
        from = new Date(now.getTime() - 100 * 3 * 30 * 24 * 60 * 60 * 1000).toISOString() // 约300个月前
        break
      case '6M':
        from = new Date(now.getTime() - 100 * 6 * 30 * 24 * 60 * 60 * 1000).toISOString() // 约600个月前
        break
      case '1Y':
        from = new Date(now.getTime() - 100 * 365 * 24 * 60 * 60 * 1000).toISOString() // 100年前
        break
      default:
        // 默认使用1天的时间范围
        from = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
        break
    }

    testConfig.range = {
      from,
      to
    }
    const originalSymbol = testConfig.symbol
    if (testConfig.symbol) {
      testConfig.symbol = `BINANCE:${originalSymbol}USDT`
    }
    let result = await triggerChartImg({
      ...testConfig,
      width: 1600,
      height: 900,
      theme: 'dark',
      format: 'png',
      timezone: 'Etc/UTC'
    })
    if ((result as any).error && (result as any).error.data.message === 'Invalid Symbol') {
      testConfig.symbol = `WOONETWORK:${originalSymbol}USDT`
      result = await await triggerChartImg({
        ...testConfig,
        width: 1600,
        height: 900,
        theme: 'dark',
        format: 'png',
        timezone: 'Etc/UTC'
      })
    }
    return result
  }, [triggerChartImg])

  const testChatImg = useCallback(async () => {
    try {
      if (isLoading) return
      setIsLoading(true)
      const result = await triggerChatCompletions({
        userValue: "*HYPE ‑ 近 7 日技术面快照*\n\n• 趋势：自 6 月初低点 ~33.3 美元起，价格阶梯式抬升至 6-11 日创下历史高点 43.82，整体维持*中期上升通道*。昨日回落至 37.65 后快速收回至 38 上方，说明多头仍在守关键支撑。\n\n• 支撑 / 阻力\n  1. 强支撑：37.65（24h 低点）→ 若跌破将测试前波平台 35.0-36.0 区。\n  2. 主阻力：43.76-43.82（昨日高点 & ATH）→ 站稳后有望打开新高空间。\n\n• 关键指标\n  • *RSI*（1h/4h）已从超买区回落至 55-60，动能降温但仍偏多头；若跌至 50 下方，将确认短线修正。\n  • *MACD*（4h）柱体开始收敛，快慢线有死叉风险 → 关注能否转阳。\n  • *MA*：MA-20 ≈ 39.5、MA-50 ≈ 36.8，短期均线上扬且价仍处 20 日线下方小幅回调区间，未破 MA-50 前多头结构完好。\n  • *成交量*：过去两日放量冲高后缩量回调，需放量重上 40 才能确认重启攻势。\n\n• 盘面解读\n  1. 近期涨幅累计超 *13%*（7 日），主升段中出现首次 >7% 日跌幅，属于*健康洗盘*概率较高。\n  2. 若能在 37-38 区构建小双底并放量突破 40，多头或再测 43+；反之失守 37，短线或回撤至 35 寻找买盘。\n\n📌 *操作提示*：趋势仍偏多，但技术指标显示短线动能放缓，耐心等待靠近支撑区的放量企稳或重新突破 40 再考虑追随。止损宜设在 35 下方以控制风险。\n\n---\n以上基于过去 7 日行情及 24h 指标，专注短期视角，供参考，勿构成投资建议。",
        systemValue: SYSTEM_PROMPT,
      })
      const list = JSON.parse((result as any).data.choices[0].message.content)
      const resultList = await Promise.all(list.map(async (item: any) => {
        const result: any = await getChartImg(item)
        return {
          ...result.data,
          parameter: item,
          detailDescription: item.detail_description
        }
      }))
      const imgList: string[] = []
      if (resultList.length > 0) {
        // 处理图片并添加文本
        const processedImages = await Promise.all(resultList.map(async (item: any, index: number) => {
          const detailDescription = item.detailDescription
          const parameter = item.parameter
          const imgUrl = item.url
          try {
            // 在图片上添加用户输入的文本作为标题
            const imageWithText = await addTextToImageWithOptions(
              detailDescription,
              imgUrl,
              parameter,
            )
            return imageWithText
          } catch (error) {
            console.error('处理图片失败:', error)
            // 如果添加文本失败，返回原图片
            return imgUrl
          }
        }))
        
        imgList.push(...processedImages)
        setImgList(imgList)
        setIsShowModal(true)
      } else {
        toast({
          title: <Trans>No Data</Trans>,
          description: <Trans>No img generated</Trans>,
          status: TOAST_STATUS.SUCCESS,
          typeIcon: 'icon-chat-complete',
          iconTheme: theme.jade10,
        })
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      toast({
        title: <Trans>Error</Trans>,
        description: <Trans>Failed to generate chart images</Trans>,
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-warning',
        iconTheme: theme.ruby50,
      })
    }
  }, [data.content, isLoading, theme.jade10, theme.ruby50, toast, getChartImg, triggerChatCompletions, addTextToImageWithOptions])
  // const getImg = useCallback(async () => {
  //   const imageWithText = await addTextToImageWithOptions(
  //     "技术面结论: BNB 在5-28日凌晨最高拉升至693美元，已向近一周被频繁测试的680-686美元颈线上方拉出长阳，短线完成对该阻力的日内突破。但日线收盘回落至683美元附近，尚未形成放量实体收在颈线上方，突破仍待确认。动能评估: 价量稳步上升，均线保持在20日与50日均线之上且多头排列，RSI中枢处于55-60区间，仍有上行空间。关键价位: 阻力位693→700→715，支撑位668→652。操作提示: 若日线稳收690-700之上并伴随放量，则目标指向715-730；否则跌破668则防守652。",
  //     "https://r2.chart-img.com/20250727/tradingview/advanced-chart/09422c8f-cb99-4494-8c13-897b6600c0aa.png"
  //   )
  //   console.log("imageWithText", imageWithText)
  // }, [addTextToImageWithOptions])
  // const toggleModal = useCallback(() => {
  //   setImgList([])
  //   setIsShowModal(true)
  // }, [])
  return  <IconWrapper
    $borderRadius={16}
    $borderColor={theme.bgT30}
    onClick={testChatImg}
  >
    {isLoading
      ? <Pending iconStyle={{ color: theme.textL1, fontSize: '18px' }} isFetching />
      : <IconBase className="icon-search"/>
    }
    {isShowModal && <ImgModal imgList={imgList} isShowModal={isShowModal} toggleTestChatImgModal={() => setIsShowModal(false)} />}
  </IconWrapper>
}
