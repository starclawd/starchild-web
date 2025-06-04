import dayjs from 'dayjs'
import styled, { css } from 'styled-components'
import Markdown from 'react-markdown'
import copy from 'copy-to-clipboard'
import { useAiResponseContentList, useDeleteContent, useRecommandContentList, useSendAiContent } from 'store/tradeai/hooks'
import { ROLE_TYPE, TempAiContentDataType } from 'store/tradeai/tradeai.d'
import { memo, RefObject, useCallback, useRef, useState } from 'react'
import { IconBase } from 'components/Icons'
import { Trans } from '@lingui/react/macro'
import Feedback from '../Feedback'
import { Content, ContentItem, ContentItemWrapper, ItemImgWrapper } from 'pages/TradeAi/styles'
import AssistantIcon from '../AssistantIcon'
import InputArea from 'components/InputArea'
import { vm } from 'pages/helper'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { useTheme } from 'store/themecache/hooks'
import VoiceItem from './components/VoiceItem'
import ImgItem from './components/ImgItem'
import FileItem from './components/FileItem'
import { ANI_DURATION } from 'constants/index'
import { useTimezone } from 'store/timezonecache/hooks'
import DeepThink from '../DeepThink'
import BackTest from '../BackTest'

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
  gap: 8px;
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
  width: 100%;
  padding: 8px 12px;
  min-height: 40px;
  span:first-child {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL2};
  }
  span:last-child {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: transparent;
    transition: all ${ANI_DURATION}s;
    .icon-chat-back {
      font-size: 18px;
      transform: rotate(180deg);
      color: ${({ theme }) => theme.textL4};
    }
  }
  ${({ theme }) => theme.isMobile
  ? css`
    min-height: ${vm(28)};
    padding: ${vm(2)} ${vm(2)} ${vm(2)} ${vm(12)};
    span:first-child {
      font-size: .12rem;
      font-weight: 400;
      line-height: .18rem;
    }
    span:last-child {
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${vm(24)};
      height: ${vm(24)};
      border-radius: 50%;
      background-color: ${theme.sfC1};
      font-size: 0.18rem;
      color: ${theme.textL1};
    }
  ` : css`
    cursor: pointer;
    transition: all ${ANI_DURATION}s;
    &:hover {
      border: 1px solid transparent;
      background-color: ${({ theme }) => theme.bgL2};
      span:last-child {
        background-color: ${({ theme }) => theme.bgT30};
      }
    }
  `}
`


export default memo(function ContentItemCom({
  data,
}: {
  data: TempAiContentDataType
}) {
  const theme = useTheme()
  const [timezone] = useTimezone()
  const sendAiContent = useSendAiContent()
  const { id, content, role, timestamp } = data
  const ContentItemWrapperRef = useRef<HTMLDivElement>(null)
  const [editUserValue, setEditUserValue] = useState(content)
  const [isEditContent, setIsEditContent] = useState(false)
  const triggerDeleteContent = useDeleteContent()
  const [aiResponseContentList] = useAiResponseContentList()
  const [isEditContentLoading, setIsEditContentLoading] = useState(false)
  const [recommandContentList] = useRecommandContentList()
  const [isVoiceItem, setIsVoiceItem] = useState(false)
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
        a: ({node, ...props}) => {
          const { href } = props
          // 判断链接是否为图片
          const isImage = href && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(href)
          
          if (isImage) {
            return <ItemImgWrapper>
              {/* 'https://static-blog.onlyoffice.com/wp-content/uploads/2022/02/Blog_hyperlink-zh_CH.png' */}
              <img className="img-item" src={href} alt={props.children?.toString() || href} />
              <span>{dayjs.tz(timestamp, timezone).format('YYYY-MM-DD HH:mm:ss')}</span>
            </ItemImgWrapper>
          }
          
          return <a target="_blank" rel="noopener noreferrer" {...props}/>
        },
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
    return <ContentItemWrapper role={role}>
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
                      <Trans>Submit</Trans>
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
  return <ContentItemWrapper ref={ContentItemWrapperRef} role={role}>
    <ContentItem role={role} key={id}>
      <AssistantIcon />
      <DeepThink aiContentData={data} isTempAiContent={false} />
      <BackTest />
      <Content role={role}>
        {ResultContent}
      </Content>
    </ContentItem>
    <Feedback data={data} />
    {recommandContentList.length > 0 && <RecommandContent>
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
    </RecommandContent>}
  </ContentItemWrapper>
})