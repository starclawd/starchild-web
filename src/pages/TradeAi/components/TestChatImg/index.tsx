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

  const getTimeByBarCount = useCallback((interval: string, barCount: number) => {
    // '1m', '3m', '5m', '15m', '30m', '45m', '1h', '2h', '3h', '4h', '6h', '12h', '1D', '1W', '1M', '3M', '6M', '1Y'
    let time = ''
    
    // 获取当前时间并按照周期对齐到整数时间戳
    const getCurrentAlignedTime = (interval: string) => {
      const now = new Date()
      const minutes = now.getUTCMinutes()
      const hours = now.getUTCHours()
      const date = now.getUTCDate()
      const month = now.getUTCMonth()
      const year = now.getUTCFullYear()
      
      switch (interval) {
        case '1m':
          return new Date(Date.UTC(year, month, date, hours, minutes, 0, 0))
        case '3m':
          return new Date(Date.UTC(year, month, date, hours, (Math.floor(minutes / 3) + 1) * 3, 0, 0))
        case '5m':
          return new Date(Date.UTC(year, month, date, hours, (Math.floor(minutes / 5) + 1) * 5, 0, 0))
        case '15m':
          return new Date(Date.UTC(year, month, date, hours, (Math.floor(minutes / 15) + 1) * 15, 0, 0))
        case '30m':
          return new Date(Date.UTC(year, month, date, hours, (Math.floor(minutes / 30) + 1) * 30, 0, 0))
        case '45m':
          return new Date(Date.UTC(year, month, date, hours, (Math.floor(minutes / 45) + 1) * 45, 0, 0))
        case '1h':
          return new Date(Date.UTC(year, month, date, (hours + 1), 0, 0, 0))
        case '2h':
          return new Date(Date.UTC(year, month, date, (Math.floor(hours / 2) + 1) * 2, 0, 0, 0))
        case '3h':
          return new Date(Date.UTC(year, month, date, (Math.floor(hours / 3) + 1) * 3, 0, 0, 0))
        case '4h':
          return new Date(Date.UTC(year, month, date, (Math.floor(hours / 4) + 1) * 4, 0, 0, 0))
        case '6h':
          return new Date(Date.UTC(year, month, date, (Math.floor(hours / 6) + 1) * 6, 0, 0, 0))
        case '12h':
          return new Date(Date.UTC(year, month, date, (Math.floor(hours / 12) + 1) * 12, 0, 0, 0))
        case '1D':
          return new Date(Date.UTC(year, month, (date + 1), 0, 0, 0, 0))
        case '1W': {
          const dayOfWeek = now.getUTCDay()
          const startOfWeek = new Date(Date.UTC(year, month, (date - dayOfWeek + 1), 0, 0, 0, 0))
          return startOfWeek
        }
        case '1M':
          return new Date(Date.UTC(year, (month + 1), 1, 0, 0, 0, 0))
        case '3M':
          return new Date(Date.UTC(year, (Math.floor(month / 3) + 1) * 3, 1, 0, 0, 0, 0))
        case '6M':
          return new Date(Date.UTC(year, (Math.floor(month / 6) + 1) * 6, 1, 0, 0, 0, 0))
        case '1Y':
          return new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0, 0))
        default:
          return new Date(Date.UTC(year, month, date, hours, minutes, 0, 0))
      }
    }
    
    const now = getCurrentAlignedTime(interval)
    switch (interval) {
      case '1m':
        time = new Date(now.getTime() + barCount * 60 * 1000).toISOString() // 100分钟前
        break
      case '3m':
        time = new Date(now.getTime() + barCount * 3 * 60 * 1000).toISOString() // 300分钟前
        break
      case '5m':
        time = new Date(now.getTime() + barCount * 5 * 60 * 1000).toISOString() // 500分钟前
        break
      case '15m':
        time = new Date(now.getTime() + barCount * 15 * 60 * 1000).toISOString() // 1500分钟前
        break
      case '30m':
        time = new Date(now.getTime() + barCount * 30 * 60 * 1000).toISOString() // 3000分钟前
        break
      case '45m':
        time = new Date(now.getTime() + barCount * 45 * 60 * 1000).toISOString() // 4500分钟前
        break
      case '1h':
        time = new Date(now.getTime() + barCount * 60 * 60 * 1000).toISOString() // 100小时前
        break
      case '2h':
        time = new Date(now.getTime() + barCount * 2 * 60 * 60 * 1000).toISOString() // 200小时前
        break
      case '3h':
        time = new Date(now.getTime() + barCount * 3 * 60 * 60 * 1000).toISOString() // 300小时前
        break
      case '4h':
        time = new Date(now.getTime() + barCount * 4 * 60 * 60 * 1000).toISOString() // 400小时前
        break
      case '6h':
        time = new Date(now.getTime() + barCount * 6 * 60 * 60 * 1000).toISOString() // 600小时前
        break
      case '12h':
        time = new Date(now.getTime() + barCount * 12 * 60 * 60 * 1000).toISOString() // 1200小时前
        break
      case '1D':
      case '1d':
        time = new Date(now.getTime() + barCount * 24 * 60 * 60 * 1000).toISOString() // 100天前
        break
      case '1W':
      case '1w':
        time = new Date(now.getTime() + barCount * 7 * 24 * 60 * 60 * 1000).toISOString() // 100周前
        break
      case '1M':
        time = new Date(now.getTime() + barCount * 30 * 24 * 60 * 60 * 1000).toISOString() // 约100个月前
        break
      case '3M':
        time = new Date(now.getTime() + barCount * 3 * 30 * 24 * 60 * 60 * 1000).toISOString() // 约300个月前
        break
      case '6M':
        time = new Date(now.getTime() + barCount * 6 * 30 * 24 * 60 * 60 * 1000).toISOString() // 约600个月前
        break
      case '1Y':
        time = new Date(now.getTime() + barCount * 365 * 24 * 60 * 60 * 1000).toISOString() // 100年前
        break
      default:
        // 默认使用1天的时间范围
        time = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
        break
    }
    return time
  }, [])

  const getChartImg = useCallback(async (testConfig: any) => {
    const from = getTimeByBarCount(testConfig.interval, -50)
    let to = getTimeByBarCount(testConfig.interval, 25)
    testConfig.range = {
      from,
      to
    }
    const originalSymbol = testConfig.symbol.toUpperCase().replace('USDT', '').replace('USDC', '').replace('USD', '')
    if (testConfig.symbol) {
      testConfig.symbol = `BINANCE:${originalSymbol}USDT`
    }
    // 1
    if (!testConfig.drawings) {
      testConfig.drawings = []
    }
    if (testConfig.trend_price && testConfig.trend_price.length > 0) {
      const filterTrendPrice = testConfig.trend_price.filter((item: number[]) => {
        const item0 = item[0]
        const lastItem = item[item.length - 1]
        if (testConfig.detail_description.includes('bearish')) {
          return item0 > lastItem
        } else if (testConfig.detail_description.includes('bullish') || testConfig.detail_description.includes('neutral')) {
          return lastItem > item0
        }
        return false
      })
      let item = filterTrendPrice[0]
      if (item && item.length > 1) {
        // 先获取最新价，填充到第 0 项目，根据 id 去获取
        // const lastPrice = await getLastPrice(testConfig.symbol)
        // item.unshift(lastPrice)
        // 前置处理：如果项数少于6个，在第0项和最后一项之间填充
        if (item.length < 6) {
          const firstPrice = item[0]
          const lastPrice = item[item.length - 1]
          const targetLength = 6
          const needToAdd = targetLength - item.length
          
          // 创建震荡分布的中间值
          const newItem = [firstPrice]
          const minPrice = Math.min(firstPrice, lastPrice)
          const maxPrice = Math.max(firstPrice, lastPrice)
          
          for (let i = 1; i <= needToAdd; i++) {
            const progress = i / (needToAdd + 1) // 在 0 到 1 之间的进度
            
            // 生成震荡效果：使用正弦函数创建多周期震荡
            const oscillationPhase = progress * Math.PI * 4 // 4个周期的震荡
            // 将正弦函数的输出[-1, 1]转换到[0, 1]
            const normalizedOscillation = (Math.sin(oscillationPhase) + 1) / 2
            
            // 在价格范围内应用震荡效果
            const oscillatedPrice = minPrice + normalizedOscillation * (maxPrice - minPrice)
            
            // 添加一些随机性来增加变化
            const randomFactor = (Math.random() - 0.5) * 0.1 // -5% 到 +5% 的随机变化
            const priceRange = maxPrice - minPrice
            let finalPrice = oscillatedPrice + randomFactor * priceRange
            
            // 确保价格在首尾值范围内
            finalPrice = Math.max(minPrice, Math.min(maxPrice, finalPrice))
            
            newItem.push(finalPrice)
          }
          
          // 添加原有的中间项（如果有的话）
          for (let i = 1; i < item.length - 1; i++) {
            newItem.push(item[i])
          }
          
          newItem.push(lastPrice)
          item = newItem
        }
        
        // 第0项和第1项是一条，第1项和第2项是一条，依次类推
        const lineCount = item.length - 1
        const eachLineBarCount = Math.floor(25 / lineCount)
        for (let i = 0; i < lineCount; i++) {
          testConfig.drawings.push({
            name: 'Trend Line',
            input: {
              startPrice: item[i],
              endPrice: item[i + 1],
              startDatetime: getTimeByBarCount(testConfig.interval, eachLineBarCount * i),
              endDatetime: getTimeByBarCount(testConfig.interval, eachLineBarCount * (i + 1)),
              text: 'Trend Line',
            },
            override: {
              lineWidth: 4,
              fontSize: 14,
              showLabel: true,
            }
          })
        }
      } else {
        to = getTimeByBarCount(testConfig.interval, 0)
      }
    }
    testConfig.override = {
      priceRange: {
        from: 90000,
        to: 170000,
      }
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
  }, [triggerChartImg, getTimeByBarCount])

  const testChatImg = useCallback(async () => {
    try {
      if (isLoading) return
      setIsLoading(true)
      const result = await triggerChatCompletions({
        userValue: data.content,
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
