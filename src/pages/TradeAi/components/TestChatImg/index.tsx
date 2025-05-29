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
