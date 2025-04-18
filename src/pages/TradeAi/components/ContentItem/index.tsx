import styled from 'styled-components'
import Markdown from 'react-markdown'
import copy from 'copy-to-clipboard'
import { isNanCommandResponse, parseTradeCommandContent, useAiResponseContentList, useCurrentRenderingId, useDeleteContent, useIsLoadingData, useIsRenderingData, useSendAiContent } from 'store/tradeai/hooks'
import { ROLE_TYPE, TempAiContentDataType, TRADE_AI_TYPE } from 'store/tradeai/tradeai.d'
import { memo, ReactNode, RefObject, useCallback, useState } from 'react'
import { IconBase } from 'components/Icons'
import { Trans } from '@lingui/react/macro'
import ButtonLoading, { BUTTON_LOADING_TYPE } from 'components/ButtonLoading'
import ThoughtContent from '../ThoughtContent'
import Feedback from '../Feedback'
import { Content, ContentItem, ContentItemWrapper } from 'pages/TradeAi/styles'
import AssistantIcon from '../AssistantIcon'
import InputArea from 'components/InputArea'
import { ANI_DURATION } from 'constants/index'

const UserOperatorWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  .icon-copy {
    cursor: pointer;
    color: ${({ theme }) => theme.text4};
    font-size: 18px;
    transition: all ${ANI_DURATION}s;
    &:hover {
      color: ${({ theme }) => theme.green};
    }
  }
  .icon-ai-edit {
    cursor: pointer;
    path {
      transition: all ${ANI_DURATION}s;
    }
    &:hover {
      path {
        fill: ${({ theme }) => theme.green};
      }
    }
  }
`

const EditContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 88px;
`

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 30px;
`

const ButtonCancel = styled.div`
  min-width: 64px;
  width: fit-content;
  height: 28px;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
`

const ButtonConfirm = styled.div`
  min-width: 64px;
  width: fit-content;
  height: 28px;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  border-radius: 6px;
  padding: 0 12px;
  &:before, &:after {
    border-radius: 6px;
  }
`

const OperatorWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  font-weight: 800;
`


export default memo(function ContentItemCom({
  isTempAiContent,
  data,
  contentInnerRef,
  shouldAutoScroll,
}: {
  isTempAiContent?: boolean
  data: TempAiContentDataType
  contentInnerRef?: RefObject<HTMLDivElement>
  shouldAutoScroll?: boolean
}) {
  const sendAiContent = useSendAiContent()
  const [isLoading] = useIsLoadingData()
  const [isRenderingData] = useIsRenderingData()
  const { id, content, role, thoughtContent, observationContent } = data
  const [editUserValue, setEditUserValue] = useState(content)
  const [isEditContent, setIsEditContent] = useState(false)
  const triggerDeleteContent = useDeleteContent()
  const [currentRenderingId] = useCurrentRenderingId()
  const [aiResponseContentList] = useAiResponseContentList()
  const [isEditContentLoading, setIsEditContentLoading] = useState(false)
  const [isInputDislikeContent, setIsInputDislikeContent] = useState(false)

  const editContent = useCallback(() => {
    setIsEditContent(true)
    setEditUserValue(content)
  }, [content])
  const copyContent = useCallback(() => {
    copy(content)
    // promptInfo(PromptInfoType.SUCCESS, <Trans>Copy Successful</Trans>)
  }, [content])
  const cancelEdit = useCallback(() => {
    setIsEditContent(false)
  }, [])
  const confirmEdit = useCallback(async () => {
    if (!editUserValue || isEditContentLoading) return
    setIsEditContentLoading(true)
    await triggerDeleteContent(id)
    const nextAiResponseContentList = aiResponseContentList.filter(item => item.id !== id)
    await sendAiContent({
      value: editUserValue,
      nextAiResponseContentList,
    })
    setIsEditContentLoading(false)
    setIsEditContent(false)
  }, [id, editUserValue, isEditContentLoading, aiResponseContentList, sendAiContent, triggerDeleteContent])
  let ResultContent = (
    <Markdown
      components={{
        a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" {...props}/>
      }}
    >
      {content}
    </Markdown>
  )
  if (role === ROLE_TYPE.USER) {
    return <ContentItemWrapper isInputDislikeContent={isInputDislikeContent} role={role}>
      <ContentItem role={role} key={id}>
        <Content role={role}>
          {isEditContent
            ? <EditContentWrapper>
              <InputArea
                value={editUserValue}
                setValue={setEditUserValue}
              />
              <ButtonWrapper>
                <ButtonCancel onClick={cancelEdit}><Trans>Cancel</Trans></ButtonCancel>
                <ButtonConfirm onClick={confirmEdit}>
                  {isEditContentLoading
                    ? <ButtonLoading type={BUTTON_LOADING_TYPE.GREEN_BUTTON} />
                    : <Trans>Submit</Trans>
                  }
                </ButtonConfirm>
              </ButtonWrapper>
            </EditContentWrapper>
            : content}
        </Content>
      </ContentItem>
      <UserOperatorWrapper className="user-operator-wrapper">
        <IconBase onClick={copyContent} className="icon-copy"/>
        <IconBase onClick={editContent} className="icon-ai-edit"/>
      </UserOperatorWrapper>
    </ContentItemWrapper>
  }
  return <ContentItemWrapper isRendering={currentRenderingId === id} isInputDislikeContent={isInputDislikeContent} role={role}>
    <ContentItem role={role} key={id}>
      <AssistantIcon />
      <Content role={role}>
        {thoughtContent.length > 0 && isLoading && isRenderingData && <ThoughtContent contentInnerRef={contentInnerRef} shouldAutoScroll={shouldAutoScroll} content={content} isTempAiContent={!!isTempAiContent} thoughtContent={thoughtContent} observationContent={observationContent} />}
        {ResultContent}
      </Content>
    </ContentItem>
    <Feedback data={data} isInputDislikeContent={isInputDislikeContent} setIsInputDislikeContent={setIsInputDislikeContent} />
  </ContentItemWrapper>
})