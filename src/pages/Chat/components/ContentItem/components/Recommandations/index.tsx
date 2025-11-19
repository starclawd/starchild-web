import dayjs from 'dayjs'
import { Trans } from '@lingui/react/macro'
import { ButtonCommon } from 'components/Button'
import { IconBase } from 'components/Icons'
import Pending from 'components/Pending'
import { ANI_DURATION } from 'constants/index'
import useSubErrorInfo from 'hooks/useSubErrorInfo'
import { vm } from 'pages/helper'
import { useCallback, useMemo, useState } from 'react'
import { useGetSubscribedAgents, useSubscribeAgent, useUnsubscribeAgent } from 'store/agenthub/hooks'
import { ACTION_TYPE, RecommandContentDataType, RECOMMENDATION_TYPE } from 'store/chat/chat'
import { useIsLoadingData, useSendAiContent } from 'store/chat/hooks'
import { useTrackRecommendations } from 'store/chat/hooks/useRecommandations'
import { useSubscribedAgents } from 'store/myagent/hooks'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { BorderBottom1PxBox } from 'styles/borderStyled'
import { useTimezone } from 'store/timezonecache/hooks'

const RecommandationsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 36px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin-top: ${vm(36)};
    `}
`

const RecommandationItem = styled(BorderBottom1PxBox)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 20px 0;
  &:last-child {
    border: none;
    &::after {
      border: none;
    }
  }
  .item-top {
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    color: ${({ theme }) => theme.textL2};
  }
  .item-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 12px;
    .item-bottom-left {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 4px;
      a {
        font-size: 13px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
        word-break: break-word;
        text-decoration-line: underline;
        color: ${({ theme }) => theme.brand100};
        transition: all ${ANI_DURATION}s;
        &:hover {
          opacity: 0.7;
        }
      }
      span {
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: ${({ theme }) => theme.textL2};
      }
    }
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      padding: ${vm(20)} 0;
      .item-top {
        font-size: 0.16rem;
        line-height: 0.22rem;
      }
      .item-bottom {
        flex-direction: column;
        align-items: flex-start;
        gap: ${vm(12)};
        .item-bottom-left {
          gap: ${vm(4)};
          a {
            font-size: 0.13rem;
            line-height: 0.2rem;
          }
          span {
            font-size: 0.14rem;
            line-height: 0.2rem;
          }
        }
      }
    `}
`

const ButtonSub = styled(ButtonCommon)<{ $isSubscribed: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  white-space: nowrap;
  gap: 4px;
  width: fit-content;
  height: 32px;
  padding: 0 12px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  border-radius: 32px;
  color: ${({ theme }) => theme.textL1};
  .icon-subscription {
    font-size: 18px;
    color: ${({ theme }) => theme.textL1};
  }
  ${({ $isSubscribed, theme }) =>
    $isSubscribed &&
    css`
      background: ${theme.bgT30};
    `}
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
      height: ${vm(32)};
      gap: ${vm(4)};
      padding: 0 ${vm(12)};
      font-size: 0.14rem;
      line-height: 0.2rem;
      border-radius: ${vm(32)};
      .icon-subscription {
        font-size: 0.18rem;
      }
    `}
`

const ButtonCreate = styled(ButtonSub)`
  .icon-chat-upload {
    font-size: 18px;
    color: ${({ theme }) => theme.textL1};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      .icon-chat-upload {
        font-size: 0.18rem;
      }
    `}
`

export function RecommandationsItem({ data }: { data: RecommandContentDataType }) {
  const theme = useTheme()
  const [timezone] = useTimezone()
  const [isSubscribeLoading, setIsSubscribeLoading] = useState(false)
  const subErrorInfo = useSubErrorInfo()
  const sendAiContent = useSendAiContent()
  const [isLoadingData] = useIsLoadingData()
  const triggerSubscribeAgent = useSubscribeAgent()
  const triggerUnsubscribeAgent = useUnsubscribeAgent()
  const triggerGetSubscribedAgents = useGetSubscribedAgents()
  const triggerTrackRecommendations = useTrackRecommendations()
  const [subscribedAgents] = useSubscribedAgents()
  const { message, task_id, recommendation_type, ts, recommendation_id } = data
  const url = `${window.location.origin}/agentdetail?agentId=${task_id}`
  const isSubscribed = subscribedAgents.some((agent) => String(agent.id) === task_id)
  const handleClickUrl = useCallback(() => {
    triggerTrackRecommendations({
      recommendationId: recommendation_id,
      actionType: ACTION_TYPE.CLICKED,
    })
  }, [recommendation_id, triggerTrackRecommendations])
  const handleCreateAgent = useCallback(async () => {
    if (!message || isLoadingData) return
    await sendAiContent({ value: message })
    triggerTrackRecommendations({
      recommendationId: recommendation_id,
      actionType:
        recommendation_type === RECOMMENDATION_TYPE.CREATE_ALERT
          ? ACTION_TYPE.CREATED_ALERT
          : recommendation_type === RECOMMENDATION_TYPE.CREATE_BACKTEST
            ? ACTION_TYPE.CREATED_BACKTEST
            : ACTION_TYPE.ASKED,
    })
  }, [message, isLoadingData, recommendation_type, recommendation_id, sendAiContent, triggerTrackRecommendations])
  const handleSubscribe = useCallback(async () => {
    setIsSubscribeLoading(true)
    try {
      if (subErrorInfo()) {
        setIsSubscribeLoading(false)
        return
      }
      if (!isSubscribed) {
        triggerTrackRecommendations({
          recommendationId: recommendation_id,
          actionType: ACTION_TYPE.SUBSCRIBED,
        })
      }
      const res = await (isSubscribed ? triggerUnsubscribeAgent : triggerSubscribeAgent)(Number(task_id))
      if (res) {
        await triggerGetSubscribedAgents()
      }
      setIsSubscribeLoading(false)
    } catch (error) {
      setIsSubscribeLoading(false)
    }
  }, [
    isSubscribed,
    task_id,
    recommendation_id,
    triggerTrackRecommendations,
    triggerGetSubscribedAgents,
    triggerSubscribeAgent,
    triggerUnsubscribeAgent,
    subErrorInfo,
  ])
  return (
    <RecommandationItem key={task_id} $borderColor={theme.lineDark8}>
      <span className='item-top'>{message}</span>
      <span className='item-bottom'>
        <span className='item-bottom-left'>
          {task_id && (
            <a onClick={handleClickUrl} target='_blank' rel='noopener noreferrer' href={url}>
              {url}
            </a>
          )}
          <span>{dayjs.tz(ts, timezone).format('YYYY-MM-DD HH:mm:ss')}</span>
        </span>
        {!task_id ? (
          <ButtonCreate $disabled={isLoadingData} onClick={handleCreateAgent} $isSubscribed={false}>
            <IconBase className='icon-chat-upload' />
            {recommendation_type === RECOMMENDATION_TYPE.REQUEST_RECOMMEND ? <Trans>Ask</Trans> : <Trans>Create</Trans>}
          </ButtonCreate>
        ) : (
          <ButtonSub $isSubscribed={isSubscribed} onClick={handleSubscribe}>
            {isSubscribeLoading ? (
              <Pending />
            ) : (
              <>
                <IconBase className={isSubscribed ? 'icon-chat-noti-enable' : 'icon-subscription'} />
                {isSubscribed ? <Trans>Unsubscribe</Trans> : <Trans>Follow this agent</Trans>}
              </>
            )}
          </ButtonSub>
        )}
      </span>
    </RecommandationItem>
  )
}

export default function Recommandations({
  agentRecommendationList,
}: {
  agentRecommendationList: RecommandContentDataType[]
}) {
  return (
    <RecommandationsWrapper>
      {agentRecommendationList.map((data, index) => {
        return <RecommandationsItem key={data.recommendation_id} data={data} />
      })}
    </RecommandationsWrapper>
  )
}
