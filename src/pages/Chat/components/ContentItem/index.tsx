import styled, { css } from 'styled-components'
import {
  useAiResponseContentList,
  useDeleteContent,
  useGetAiBotChatContents,
  useRecommandContentList,
  useSendAiContent,
} from 'store/chat/hooks'
import { ROLE_TYPE, TempAiContentDataType } from 'store/chat/chat.d'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IconBase } from 'components/Icons'
import { Trans } from '@lingui/react/macro'
import Feedback from '../Feedback'
import Markdown from 'components/Markdown'
import { Content, ContentItem, ContentItemWrapper } from 'pages/Chat/styles'
import AssistantIcon from '../AssistantIcon'
import InputArea from 'components/InputArea'
import { vm } from 'pages/helper'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { useTheme } from 'store/themecache/hooks'
import VoiceItem from './components/VoiceItem'
import ImgItem from './components/ImgItem'
import FileItem from './components/FileItem'
import { ANI_DURATION } from 'constants/index'
import DeepThink from '../DeepThink'
import BackTest from '../BackTest'
import { useGetBacktestData } from 'store/agentdetail/hooks'
import { useUserInfo } from 'store/login/hooks'
import { useLazyGetAiBotChatContentsQuery } from 'api/chat'
import { useCurrentAiThreadId } from 'store/chatcache/hooks'

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
  &:before,
  &:after {
    border-radius: 6px;
  }
`

const RecommandContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
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
  ${({ theme }) =>
    theme.isMobile
      ? css`
          min-height: ${vm(28)};
          padding: ${vm(2)} ${vm(2)} ${vm(2)} ${vm(12)};
          span:first-child {
            font-size: 0.12rem;
            font-weight: 400;
            line-height: 0.18rem;
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
        `
      : css`
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

const ImgWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  img {
    width: 100%;
    border-radius: 12px;
    cursor: pointer;
    transition: all ${ANI_DURATION}s;
    &:hover {
      opacity: 0.8;
    }
  }
`

const ImagePreviewModal = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
  display: ${({ $visible }) => ($visible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: pointer;
`

const PreviewImage = styled.img`
  max-width: 95vw;
  max-height: 95vh;
  object-fit: contain;
  border-radius: 8px;
`

export default memo(function ContentItemCom({ data }: { data: TempAiContentDataType }) {
  const theme = useTheme()
  const [{ telegramUserId }] = useUserInfo()
  const checkBacktestDataRef = useRef<NodeJS.Timeout>(null)
  const sendAiContent = useSendAiContent()
  const [currentAiThreadId] = useCurrentAiThreadId()
  const responseContentRef = useRef<HTMLDivElement>(null)
  const { id, content, role, klineCharts, backtestData, taskId, threadId } = data
  const ContentItemWrapperRef = useRef<HTMLDivElement>(null)
  const [editUserValue, setEditUserValue] = useState(content)
  const [isEditContent, setIsEditContent] = useState(false)
  const triggerDeleteContent = useDeleteContent()
  const [aiResponseContentList] = useAiResponseContentList()
  const triggerGetBacktestData = useGetBacktestData()
  const [isEditContentLoading, setIsEditContentLoading] = useState(false)
  const [recommandContentList] = useRecommandContentList()
  const [isVoiceItem, setIsVoiceItem] = useState(false)
  const [isImgItem, setIsImgItem] = useState(false)
  const [isFileItem, setIsFileItem] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const voiceUrl = 'https://cdn.pixabay.com/audio/2024/03/15/audio_3c299134d9.mp3'
  const triggerGetAiBotChatContents = useGetAiBotChatContents()

  const imgList = useMemo(() => {
    if (!klineCharts) return []
    return klineCharts.charts.map((item: any) => item.url)
  }, [klineCharts])

  const cancelEdit = useCallback(() => {
    setIsEditContent(false)
  }, [])
  const confirmEdit = useCallback(async () => {
    if (!editUserValue || isEditContentLoading) return
    setIsEditContentLoading(true)
    await triggerDeleteContent(id)
    const nextAiResponseContentList = aiResponseContentList.filter((item) => item.id !== id)
    await sendAiContent({
      value: editUserValue,
      nextAiResponseContentList,
    })
    setIsEditContentLoading(false)
    setIsEditContent(false)
  }, [id, editUserValue, isEditContentLoading, aiResponseContentList, sendAiContent, triggerDeleteContent])
  const sendContent = useCallback(
    (content: string) => {
      return () => {
        sendAiContent({
          value: content,
        })
      }
    },
    [sendAiContent],
  )

  const handleImageClick = useCallback((imageUrl: string) => {
    setPreviewImage(imageUrl)
  }, [])

  const handleClosePreview = useCallback(() => {
    setPreviewImage(null)
  }, [])
  const checkBacktestData = useCallback(async () => {
    if (taskId && !backtestData && threadId === currentAiThreadId) {
      try {
        checkBacktestDataRef.current && clearTimeout(checkBacktestDataRef.current)
        const data = await triggerGetBacktestData(taskId)
        if ((data as any).data.backtest_result?.status === 'success') {
          triggerGetAiBotChatContents({ threadId, telegramUserId })
        } else {
          checkBacktestDataRef.current = setTimeout(() => {
            checkBacktestData()
          }, 5000)
        }
      } catch (error) {
        console.log('error', error)
      }
    }
  }, [
    taskId,
    telegramUserId,
    threadId,
    backtestData,
    currentAiThreadId,
    triggerGetBacktestData,
    triggerGetAiBotChatContents,
  ])

  useEffect(() => {
    return () => {
      checkBacktestDataRef.current && clearTimeout(checkBacktestDataRef.current)
    }
  }, [])

  // useEffect(() => {
  //   checkBacktestData()
  // }, [checkBacktestData])

  if (role === ROLE_TYPE.USER) {
    return (
      <ContentItemWrapper role={role}>
        <ContentItem role={role} key={id}>
          {isFileItem ? (
            <FileItem />
          ) : isImgItem ? (
            <ImgItem />
          ) : isVoiceItem ? (
            <VoiceItem voiceUrl={voiceUrl} />
          ) : (
            <Content role={role}>
              {isEditContent ? (
                <EditContentWrapper>
                  <InputArea value={editUserValue} setValue={setEditUserValue} />
                  <ButtonWrapper>
                    <ButtonCancel onClick={cancelEdit}>
                      <Trans>Cancel</Trans>
                    </ButtonCancel>
                    <ButtonConfirm onClick={confirmEdit}>
                      <Trans>Submit</Trans>
                    </ButtonConfirm>
                  </ButtonWrapper>
                </EditContentWrapper>
              ) : (
                content
              )}
            </Content>
          )}
        </ContentItem>
        {/* <UserOperatorWrapper className="user-operator-wrapper">
        <IconBase onClick={copyContent} className="icon-chat-copy"/>
        <IconBase onClick={editContent} className="icon-ai-edit"/>
      </UserOperatorWrapper> */}
      </ContentItemWrapper>
    )
  }
  return (
    <ContentItemWrapper ref={ContentItemWrapperRef} role={role}>
      <ContentItem role={role} key={id}>
        <AssistantIcon />
        <DeepThink aiContentData={data} isTempAiContent={false} />
        {backtestData && <BackTest backtestData={backtestData} />}
        <Content ref={responseContentRef as any} role={role}>
          <Markdown>{backtestData?.requirement || content}</Markdown>
          {imgList.length > 0 && (
            <ImgWrapper>
              {imgList.map((item, index) => {
                return <img key={index} src={item} alt='kline' onClick={() => handleImageClick(item)} />
              })}
            </ImgWrapper>
          )}
        </Content>
      </ContentItem>
      <Feedback data={data} responseContentRef={responseContentRef as any} />
      {recommandContentList.length > 0 && (
        <RecommandContent>
          {recommandContentList.map((data, index) => {
            const { content } = data
            return (
              <RecommandContentItem
                key={index}
                $borderRadius={60}
                $borderColor={theme.bgT30}
                onClick={sendContent(content)}
              >
                <span>{content}</span>
                <span>
                  <IconBase className='icon-chat-back' />
                </span>
              </RecommandContentItem>
            )
          })}
        </RecommandContent>
      )}

      <ImagePreviewModal $visible={!!previewImage} onClick={handleClosePreview}>
        {previewImage && <PreviewImage src={previewImage} alt='preview-kline' onClick={(e) => e.stopPropagation()} />}
      </ImagePreviewModal>
    </ContentItemWrapper>
  )
})
