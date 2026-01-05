import styled from 'styled-components'
import { ACTION_TYPE, ChatResponseContentDataType } from 'store/createstrategy/createstrategy'
import { memo, useMemo, useRef } from 'react'
import { ROLE_TYPE } from 'store/chat/chat'
import Markdown from 'components/Markdown'
import { css } from 'styled-components'
import { vm } from 'pages/helper'
import Action from '../Action'
import { useIsShowActionLayer } from 'store/createstrategy/hooks/useStrategyDetail'

export const ContentItemWrapper = styled.div<{ role: ROLE_TYPE }>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  padding-bottom: 20px;
  gap: 4px;
  ${({ role }) =>
    role === ROLE_TYPE.USER &&
    css`
      align-self: flex-end;
      width: fit-content;
      max-width: 82.5%;
    `}

  ${({ theme, role }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
      max-width: 100%;
      padding-bottom: ${vm(20)};
      ${role === ROLE_TYPE.USER &&
      css`
        max-width: ${vm(280)};
      `}
    `}
`

export const ContentItem = styled.div<{ role: ROLE_TYPE }>`
  position: relative;
  display: flex;
  padding: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
  gap: 28px;
  width: 100%;
  word-break: break-word;
  > img {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }
  ${({ role }) =>
    role === ROLE_TYPE.USER
      ? css`
          align-self: flex-end;
          width: fit-content;
          padding: 12px;
          border-radius: 12px;
          color: ${({ theme }) => theme.textL2};
          background: ${({ theme }) => theme.bgT30};
        `
      : css`
          flex-direction: column;
          align-items: flex-start;
        `}
  ${({ theme, role }) =>
    theme.isMobile &&
    css`
      ${role === ROLE_TYPE.USER
        ? css`
            padding: ${vm(8)};
            border-radius: ${vm(8)};
            font-size: 0.16rem;
            font-weight: 400;
            line-height: 0.22rem;
          `
        : css`
            gap: ${vm(20)};
          `}
    `}
`

export const Content = styled.div`
  width: fit-content;
  flex-grow: 1;
  ${({ role }) =>
    role === ROLE_TYPE.ASSISTANT &&
    css`
      width: 100%;
      border-radius: 24px;
      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
      color: ${({ theme }) => theme.textL2};
      .markdown-wrapper {
        width: 100%;
      }
    `}
  ${({ role }) =>
    role === ROLE_TYPE.USER &&
    css`
      p {
        margin: 0;
      }
    `}
  ${({ theme, role }) =>
    theme.isMobile &&
    css`
      ${role === ROLE_TYPE.ASSISTANT &&
      css`
        border-radius: ${vm(24)};
        font-size: 0.16rem;
        font-weight: 400;
        line-height: 0.22rem;
        color: ${theme.textL2};
      `}
    `}
`

const NextActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.black800};
`

export default memo(function ChatItem({
  data,
  isLastChatResponseContent,
}: {
  data: ChatResponseContentDataType
  isLastChatResponseContent?: boolean
}) {
  const responseContentRef = useRef<HTMLDivElement>(null)
  const { id, content, role, nextActions } = data
  const ContentItemWrapperRef = useRef<HTMLDivElement>(null)
  const { isShowGenerateCodeOperation, isShowPaperTradingOperation, isShowLaunchOperation } = useIsShowActionLayer()
  const actionData = useMemo(() => {
    if (!isLastChatResponseContent || !nextActions || nextActions.length === 0) {
      return null
    }
    if (isShowGenerateCodeOperation) {
      return nextActions.find((action) => action.action_type === ACTION_TYPE.GENERATE_CODE)
    }
    if (isShowPaperTradingOperation) {
      return nextActions.find((action) => action.action_type === ACTION_TYPE.START_PAPER_TRADING)
    }
    if (isShowLaunchOperation) {
      return nextActions.find((action) => action.action_type === ACTION_TYPE.DEPLOY_LIVE)
    }
  }, [
    nextActions,
    isLastChatResponseContent,
    isShowGenerateCodeOperation,
    isShowPaperTradingOperation,
    isShowLaunchOperation,
  ])

  if (role === ROLE_TYPE.USER) {
    return (
      <ContentItemWrapper role={role}>
        <ContentItem role={role} key={id}>
          <Content role={role}>{content}</Content>
        </ContentItem>
      </ContentItemWrapper>
    )
  }
  return (
    <ContentItemWrapper ref={ContentItemWrapperRef} role={role}>
      <ContentItem role={role} key={id}>
        {/* <DeepThink aiContentData={data} isTempAiContent={false} /> */}
        <Content ref={responseContentRef as any} role={role}>
          <Markdown>{content}</Markdown>
          {actionData && (
            <NextActions>
              <span>{actionData.description}</span>
              <Action action={actionData} />
            </NextActions>
          )}
        </Content>
      </ContentItem>
    </ContentItemWrapper>
  )
})
