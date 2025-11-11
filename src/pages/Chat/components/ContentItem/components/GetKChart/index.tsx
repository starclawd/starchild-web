import { Trans } from '@lingui/react/macro'
import { useLazyGenerateKlineChartQuery } from 'api/chat'
import { ButtonCommon } from 'components/Button'
import { IconBase } from 'components/Icons'
import Pending from 'components/Pending'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import { useCallback, useState } from 'react'
import { TempAiContentDataType } from 'store/chat/chat'
import { useGetAiBotChatContents } from 'store/chat/hooks'
import { useUserInfo } from 'store/login/hooks'
import styled, { css } from 'styled-components'

const GetKChartWrapper = styled(ButtonCommon)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px 0 9px;
  width: 100%;
  height: 32px;
  gap: 4px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  border-radius: 32px;
  color: ${({ theme }) => theme.textL1};
  background-color: ${({ theme }) => theme.bgT20};
  cursor: pointer;
  transition: all ${ANI_DURATION}s;
  .icon-backtest {
    font-size: 18px;
    color: ${({ theme }) => theme.textL1};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
      margin: ${vm(16)} 0 ${vm(9)};
      height: ${vm(32)};
      font-size: 0.14rem;
      line-height: 0.2rem;
      border-radius: ${vm(32)};
      .icon-backtest {
        font-size: 0.18rem;
      }
    `}
`

export default function GetKChart({ data }: { data: TempAiContentDataType }) {
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [triggerGenerateKlineChart] = useLazyGenerateKlineChartQuery()
  const triggerGetAiBotChatContents = useGetAiBotChatContents()
  const genenrateKChart = useCallback(() => {
    setIsLoadingData(true)
    triggerGenerateKlineChart({
      id: data.id,
      threadId: data.threadId,
      finalAnswer: data.content,
    })
      .then((res: any) => {
        // 当收到 final_result 时，触发获取聊天内容
        if (res.isSuccess || (res.data && res.data.type === 'final_result')) {
          triggerGetAiBotChatContents({
            threadId: data.threadId || '',
          }).finally(() => {
            setIsLoadingData(false)
          })
        }
      })
      .catch((error: any) => {
        console.error('Error generating kline chart:', error)
        setIsLoadingData(false)
      })
  }, [triggerGenerateKlineChart, triggerGetAiBotChatContents, data])
  return (
    <GetKChartWrapper $disabled={isLoadingData} onClick={genenrateKChart}>
      {isLoadingData ? (
        <Pending />
      ) : (
        <>
          <IconBase className='icon-backtest' />
          <Trans>Get K-Chart</Trans>
        </>
      )}
    </GetKChartWrapper>
  )
}
