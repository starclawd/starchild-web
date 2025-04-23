import styled, { css } from 'styled-components'
import Markdown from 'react-markdown'
import copy from 'copy-to-clipboard'
import { isNanCommandResponse, parseTradeCommandContent, useAiResponseContentList, useCurrentRenderingId, useDeleteContent, useIsLoadingData, useIsRenderingData, useRecommandContentList, useSendAiContent } from 'store/tradeai/hooks'
import { ROLE_TYPE, TempAiContentDataType, TRADE_AI_TYPE } from 'store/tradeai/tradeai.d'
import { memo, ReactNode, RefObject, useCallback, useState } from 'react'
import { IconBase } from 'components/Icons'
import { Trans } from '@lingui/react/macro'
import ButtonLoading, { BUTTON_LOADING_TYPE } from 'components/ButtonLoading'
import ThoughtContent from '../ThoughtContent'
import Feedback from '../Feedback'
import { Content, ContentItem, ContentItemWrapper, ItemImgWrapper } from 'pages/TradeAi/styles'
import AssistantIcon from '../AssistantIcon'
import InputArea from 'components/InputArea'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import { BorderAllSide1PxBox } from 'styles/theme'
import { useTheme } from 'store/theme/hooks'
import VoiceItem from './components/VoiceItem'
import ImgItem from './components/ImgItem'
import FileItem from './components/FileItem'
const UserOperatorWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  .icon-chat-copy {
    color: ${({ theme }) => theme.textL1};
    font-size: 18px;
    transition: all ${ANI_DURATION}s;
    &:hover {
      color: ${({ theme }) => theme.green};
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

const RecommandContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  ${({ theme }) => theme.isMobile && css`
    margin-top: ${vm(12)};
    gap: ${vm(8)};
  `}
`

const RecommandContentItem = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  ${({ theme }) => theme.isMobile && css`
    min-height: ${vm(28)};
    padding: ${vm(2)} ${vm(2)} ${vm(2)} ${vm(12)};
    span:first-child {
      font-size: .12rem;
      font-weight: 400;
      line-height: .18rem;
      color: ${theme.textL2};
    }
    span:last-child {
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${vm(24)};
      height: ${vm(24)};
      border-radius: 50%;
      background-color: ${theme.bgL1};
      font-size: 0.18rem;
      color: ${theme.textL1};
      .icon-chat-back {
        transform: rotate(180deg);
      }
    }
  `}
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
  const theme = useTheme()
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
  const [recommandContentList] = useRecommandContentList()
  const [isVoiceItem, setIsVoiceItem] = useState(true)
  const [isImgItem, setIsImgItem] = useState(false)
  const [isFileItem, setIsFileItem] = useState(false)
  const voiceUrl = 'https://cdn.pixabay.com/audio/2024/03/15/audio_3c299134d9.mp3'

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
  const sendContent = useCallback((content: string) => {
    return () => {
      sendAiContent({
        value: content,
      })
    }
  }, [sendAiContent])
  const ResultContent = (
    <Markdown
      components={{
        a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" {...props}/>,
        img: ({node, ...props}) => {
          return <ItemImgWrapper>
            <img className="img-item" {...props} />
          </ItemImgWrapper>
        }
      }}
    >
      {content}
    </Markdown>
  )
  if (role === ROLE_TYPE.USER) {
    return <ContentItemWrapper $isInputDislikeContent={isInputDislikeContent} role={role}>
      <ContentItem role={role} key={id}>
        {isFileItem
          ? <FileItem />
          : isImgItem
            ? <ImgItem />
            : isVoiceItem
            ? <VoiceItem voiceUrl={voiceUrl} />
            : <Content role={role}>
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
        }
      </ContentItem>
      {/* <UserOperatorWrapper className="user-operator-wrapper">
        <IconBase onClick={copyContent} className="icon-chat-copy"/>
        <IconBase onClick={editContent} className="icon-ai-edit"/>
      </UserOperatorWrapper> */}
    </ContentItemWrapper>
  }
  return <ContentItemWrapper $isInputDislikeContent={isInputDislikeContent} role={role}>
    <ContentItem role={role} key={id}>
      <AssistantIcon />
      <Content role={role}>
        {thoughtContent.length > 0 && isLoading && isRenderingData && <ThoughtContent contentInnerRef={contentInnerRef} shouldAutoScroll={shouldAutoScroll} content={content} isTempAiContent={!!isTempAiContent} thoughtContent={thoughtContent} observationContent={observationContent} />}
        {ResultContent}
      </Content>
    </ContentItem>
    <Feedback data={data} isInputDislikeContent={isInputDislikeContent} setIsInputDislikeContent={setIsInputDislikeContent} />
    <RecommandContent>
      {recommandContentList.map((data, index) => {
        const { content } = data
        return <RecommandContentItem
          key={index}
          $borderRadius={60}
          $borderColor={theme.bgT30}
          onClick={sendContent(content)}
        >
          <span>{content}</span>
          <span>
            <IconBase className="icon-chat-back" />
          </span>
        </RecommandContentItem>
      })}
    </RecommandContent>
  </ContentItemWrapper>
})