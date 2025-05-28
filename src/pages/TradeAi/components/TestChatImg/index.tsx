import { useCallback, useState } from 'react'
import { useGetChartImg, useGetOpenAiData } from 'store/tradeai/hooks'
import { TempAiContentDataType } from 'store/tradeai/tradeai'
import styled, { css, useTheme } from 'styled-components'
import parameter from './parameter.json'
import { vm } from 'pages/helper'
import { ANI_DURATION } from 'constants/index'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { IconBase } from 'components/Icons'
import ImgModal from './ImgModal'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { Trans } from '@lingui/react/macro'
import Pending from 'components/Pending'
import { addTextToImage } from 'utils/imageUtils'

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

const SYSTEM_PROMPT = JSON.stringify({
  "role": "You are a financial chart API parameter generator for chart-img.com (based on TradingView). Generate correct JSON parameters.",
  "task": "Analyze user input to determine if market data visualization is needed, and if so, generate minimal required parameter configuration.",
  "supported_symbols": {
    "crypto": ["BINANCE:BTCUSDT", "COINBASE:BTCUSD", "KRAKEN:XBTUSD", "BINANCE:ETHUSDT", "BINANCE:ADAUSDT", "and more"],
  },
  "parameter_definitions": parameter,
  "output_format": "Return ONLY an array of request body JSON objects that would be sent to the chart-img.com API. If single symbol, return array with 1 object. If multiple symbols, return array with multiple objects.",
  "api_info": {
    "endpoint": "v2/tradingview/advanced-chart/storage",
    "method": "POST",
    "url": "https://api.chart-img.com/v2/tradingview/advanced-chart/storage",
    "note": "You should return ONLY the body content, not the full API configuration"
  },
  "CRITICAL_STRUCTURE_RULES": {
    "drawings_not_studies": "IMPORTANT: 'Horizontal Line', 'Vertical Line', 'Trend Line' belong in 'drawings' array, NOT 'studies' array",
    "studies_are_indicators": "studies array is ONLY for technical indicators like 'Accumulation/Distribution', 'Accumulative Swing Index', 'Advance/Decline', 'Arnaud Legoux Moving Average', 'Aroon', 'Average Directional Index', 'Average True Range', 'Awesome Oscillator', 'Balance of Power', 'Bollinger Bands', 'Bollinger Bands %B', 'Bollinger Bands Width', 'Chaikin Money Flow', 'Chaikin Oscillator', 'Chaikin Volatility', 'Chande Kroll Stop', 'Chande Momentum Oscillator', 'Chop Zone', 'Choppiness Index', 'Commodity Channel Index', 'Connors RSI', 'Coppock Curve', 'Detrended Price Oscillator', 'Directional Movement', 'Donchian Channels', 'Double EMA', 'Ease of Movement', 'Elder\\'s Force Index', 'Envelopes', 'Fisher Transform', 'Historical Volatility', 'Hull Moving Average', 'Ichimoku Cloud', 'Keltner Channels', 'Klinger Oscillator', 'Know Sure Thing', 'Least Squares Moving Average', 'Linear Regression Curve', 'Linear Regression Slope', 'MA Cross', 'MA with EMA Cross', 'MACD', 'Majority Rule', 'Mass Index', 'McGinley Dynamic', 'Momentum', 'Money Flow Index', 'Moving Average', 'Moving Average Adaptive', 'Moving Average Channel', 'Moving Average Double', 'Moving Average Exponential', 'Moving Average Hamming', 'Moving Average Multiple', 'Moving Average Triple', 'Moving Average Weighted', 'Net Volume', 'On Balance Volume', 'Parabolic SAR', 'Price Channel', 'Price Oscillator', 'Price Volume Trend', 'Rate Of Change', 'Relative Strength Index', 'Relative Vigor Index', 'SMI Ergodic Indicator/Oscillator', 'Smoothed Moving Average', 'Standard Deviation', 'Standard Error', 'Standard Error Bands', 'Stochastic', 'Stochastic RSI', 'Super Trend', 'Trend Strength Index', 'Triple EMA', 'TRIX', 'True Strength Index', 'Ultimate Oscillator', 'Volatility Close-to-Close', 'Volatility Index', 'Volatility O-H-L-C', 'Volatility Zero Trend Close-to-Close', 'Volume', 'Volume Oscillator', 'Volume Profile Visible Range', 'Vortex Indicator', 'VWAP', 'VWMA', 'Williams %R', 'Williams Alligator', 'Williams Fractal', 'Zig Zag'",
    "drawings_are_lines": "drawings array is for lines and shapes like 'Order Line', 'Trend Line', 'Horizontal Line', 'Vertical Line', 'Long Position', 'Short Position', 'Fib Retracement', 'Date Range', 'Date Price Range', 'Rectangle', 'Arrow Marker', 'Arrow Mark Up', 'Arrow Mark Down', 'Text', 'Callout'",
    "EXACT_NAMES_ONLY": "CRITICAL: Use ONLY the exact 'name' values from parameter_definitions. Do NOT create custom names.",
    "EXACT_VALUES_ONLY": "CRITICAL: Use ONLY supported values (e.g., range must be 1D, 5D, 1M, 3M, 6M, 1Y, 5Y, ALL, DTD, WTD, MTD, YTD)",
    "ENFORCEMENT": "Always use correct array: drawings for lines, studies for indicators. Always use exact names from parameter_definitions."
  },
  "parameter_value_rules": {
    "override_handling": "When generating override parameters, use ACTUAL VALUES not parameter definitions. For example:",
    "correct_override": {
      "MACD.linewidth": 2,
      "MACD.color": "rgb(33,150,243)"
    },
    "incorrect_override": {
      "MACD.linewidth": {
        "type": "Integer",
        "description": "(Min: 1, Max: 10)",
        "default": 1
      }
    },
    "value_extraction": "Extract default values from parameter definitions and use them directly",
    "type_conversion": {
      "Integer": "Use numeric value (e.g., 1, 2, 10)",
      "Float": "Use decimal value (e.g., 0.85, 6.0)",
      "Boolean": "Use true/false",
      "Color": "Use rgb() format (e.g., 'rgb(33,150,243)')",
      "String": "Use string value from allowed options"
    }
  },
  "critical_formatting_rules": {
    "ABSOLUTELY_FORBIDDEN": [
      "Do NOT use markdown code blocks (```)",
      "Do NOT use backticks (`)",
      "Do NOT use markdown headers (#)",
      "Do NOT use markdown bold (**text**)",
      "Do NOT use markdown italic (*text*)",
      "Do NOT use any markdown syntax whatsoever"
    ],
    "REQUIRED_OUTPUT_FORMAT": "Raw JSON object only - no formatting, no explanations, no markdown"
  },
  "rules": [
    "1. Determine if chart visualization is needed",
    "2. CRITICAL: Use 'drawings' array for Horizontal Line, Vertical Line, Trend Line",
    "3. CRITICAL: Use 'studies' array ONLY for technical indicators (Moving Average, Relative Strength Index, MACD, etc.)",
    "4. NEVER put Horizontal Line in studies array - it belongs in drawings array",
    "5. MANDATORY: Use ONLY exact 'name' values from parameter_definitions - never invent custom names",
    "6. MANDATORY: Use ONLY supported parameter values (e.g., range: 1D, 5D, 1M, 3M, 6M, 1Y, 5Y, ALL, DTD, WTD, MTD, YTD)",
    "7. Return ONLY an array of request body JSON objects (not the full API config)",
    "8. Return ONLY raw JSON - absolutely NO markdown formatting",
    "9. Do NOT wrap response in code blocks or backticks",
    "10. Start response directly with [ and end with ]",
    "11. Do NOT include endpoint, method, url, or headers - only the body content"
  ],
  "response_format": "MANDATORY: Return ONLY an array of request body JSON objects that would be sent to chart-img.com API. Start with [ and end with ]. NO markdown, NO code blocks, NO explanations, NO API metadata."
})

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
  const addTextToImageWithOptions = useCallback(async (text: string, imageUrl: string): Promise<string> => {
    try {
      const result = await addTextToImage({
        text,
        imageUrl,
      })
      return result
    } catch (error) {
      console.error('添加文本到图片失败:', error)
      throw error
    }
  }, [])

  const getChartImg = useCallback(async (testConfig: any) => {
    const result = await triggerChartImg({
      ...testConfig,
      width: 1600,
      height: 900,
      theme: 'dark',
      format: 'png',
      timezone: 'Etc/UTC'
    })
    return result
  }, [triggerChartImg])

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
          detailDescription: item.detail_description
        }
      }))
      const imgList: string[] = []
      if (resultList.length > 0) {
        // 处理图片并添加文本
        const processedImages = await Promise.all(resultList.map(async (item: any, index: number) => {
          const detailDescription = item.detailDescription
          const imgUrl = item.url
          try {
            // 在图片上添加用户输入的文本作为标题
            const imageWithText = await addTextToImageWithOptions(
              detailDescription,
              imgUrl
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
