import styled from 'styled-components'
import { ACTION_TYPE, ChatResponseContentDataType, STRATEGY_TAB_INDEX } from 'store/createstrategy/createstrategy'
import { memo, useCallback, useMemo, useRef } from 'react'
import { ROLE_TYPE } from 'store/chat/chat'
import Markdown from 'components/Markdown'
import { css } from 'styled-components'
import { vm } from 'pages/helper'
import Action from '../Action'
import { useCurrentStrategyTabIndex, useIsShowActionLayer } from 'store/createstrategy/hooks/useCreateStrategyDetail'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { useIsLoadingChatStream } from 'store/createstrategy/hooks/useLoadingState'
import { useIsLogin } from 'store/login/hooks'
import { isPro } from 'utils/url'

export const ContentItemWrapper = styled.div<{ role: ROLE_TYPE; $isEditStrategyContent?: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  padding-bottom: 20px;
  gap: 4px;
  ${({ role, $isEditStrategyContent }) =>
    role === ROLE_TYPE.USER &&
    css`
      align-self: flex-end;
      width: fit-content;
      max-width: 82.5%;
      ${$isEditStrategyContent &&
      css`
        max-width: 100%;
      `}
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
          border-radius: 8px;
          color: ${({ theme }) => theme.black100};
          background: ${({ theme }) => theme.black800};
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

export const Content = styled.div<{ $isEditStrategyContent?: boolean }>`
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
      color: ${({ theme }) => theme.black100};
      .markdown-wrapper {
        width: 100%;
      }
    `}
  ${({ role, $isEditStrategyContent }) =>
    role === ROLE_TYPE.USER &&
    css`
      p {
        margin: 0;
      }
      ${$isEditStrategyContent &&
      css`
        display: flex;
        flex-direction: column;
        gap: 20px;
        .content-text {
          max-height: 440px;
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: 22px;
          color: ${({ theme }) => theme.black100};
        }
      `}
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
        color: ${theme.black100};
      `}
    `}
`

const EditStrategyHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black0};
`

const ButtonEdit = styled.div<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black100};
  cursor: pointer;
  transition: all ${ANI_DURATION}s;
  .icon-edit {
    transition: all ${ANI_DURATION}s;
    font-size: 14px;
    color: ${({ theme }) => theme.black100};
  }

  ${({ $disabled }) =>
    $disabled
      ? css`
          cursor: not-allowed;
          opacity: 0.7;
        `
      : css`
          &:hover {
            color: ${({ theme }) => theme.black0};
            .icon-edit {
              color: ${({ theme }) => theme.black0};
            }
          }
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
  const isLogin = useIsLogin()
  const responseContentRef = useRef<HTMLDivElement>(null)
  const { id, content, role, nextActions } = data
  const ContentItemWrapperRef = useRef<HTMLDivElement>(null)
  const [isLoadingChatStreamFrontend] = useIsLoadingChatStream()
  const [, setCurrentStrategyTabIndex] = useCurrentStrategyTabIndex()
  const actionData = useMemo(() => {
    if (!isLastChatResponseContent || !nextActions || nextActions.length === 0) {
      return null
    }
    return nextActions.filter((action) => action.action_type !== ACTION_TYPE.DEPLOY_LIVE)[0]
  }, [nextActions, isLastChatResponseContent])

  const isEditStrategyContent = useMemo(() => {
    return content.startsWith('Edit Strategy:')
  }, [content])

  const handleEditStrategyInfo = useCallback(() => {
    if (isLoadingChatStreamFrontend) {
      return
    }
    setCurrentStrategyTabIndex(STRATEGY_TAB_INDEX.CREATE)
    document.getElementById('strategyEditButton')?.click()
  }, [setCurrentStrategyTabIndex, isLoadingChatStreamFrontend])

  if (role === ROLE_TYPE.USER) {
    return (
      <ContentItemWrapper $isEditStrategyContent={isEditStrategyContent} role={role}>
        <ContentItem role={role} key={id}>
          <Content $isEditStrategyContent={isEditStrategyContent} role={role}>
            {isEditStrategyContent && (
              <EditStrategyHeader>
                <span>
                  <Trans>Strategy info</Trans>
                </span>
                <ButtonEdit $disabled={isLoadingChatStreamFrontend} onClick={handleEditStrategyInfo}>
                  <IconBase className='icon-edit' />
                  <Trans>Edit</Trans>
                </ButtonEdit>
              </EditStrategyHeader>
            )}
            <span className={`content-text ${isEditStrategyContent ? 'scroll-style' : ''}`}>{content}</span>
          </Content>
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
          {actionData && isLogin && (
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
