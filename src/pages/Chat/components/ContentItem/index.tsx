import styled from 'styled-components'
import { useAiResponseContentList, useDeleteContent, useSendAiContent } from 'store/chat/hooks'
import { ROLE_TYPE, TempAiContentDataType } from 'store/chat/chat.d'
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import Feedback from '../Feedback'
import Markdown from 'components/Markdown'
import { Content, ContentItem, ContentItemWrapper } from 'pages/Chat/styles'
import InputArea from 'components/InputArea'
import VoiceItem from './components/VoiceItem'
import ImgItem from './components/ImgItem'
import FileItem from './components/FileItem'
import { ANI_DURATION } from 'constants/index'
import DeepThink from '../DeepThink'
import Recommandations from './components/Recommandations'
import Portal from 'components/Portal'
import GetKChart from './components/GetKChart'
import LazyImage from 'components/LazyImage'

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
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity ${ANI_DURATION}s ease-in-out;
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
`

const PreviewImage = styled.img`
  max-width: 95vw;
  max-height: 95vh;
  object-fit: contain;
  border-radius: 8px;
`

export default memo(function ContentItemCom({ data }: { data: TempAiContentDataType }) {
  const sendAiContent = useSendAiContent()
  const responseContentRef = useRef<HTMLDivElement>(null)
  const { id, content, role, klineCharts, agentRecommendationList, shouldShowKchart } = data
  const ContentItemWrapperRef = useRef<HTMLDivElement>(null)
  const [editUserValue, setEditUserValue] = useState(content)
  const [isEditContent, setIsEditContent] = useState(false)
  const triggerDeleteContent = useDeleteContent()
  const [aiResponseContentList] = useAiResponseContentList()
  const [isEditContentLoading, setIsEditContentLoading] = useState(false)
  const [isVoiceItem, setIsVoiceItem] = useState(false)
  const [isImgItem, setIsImgItem] = useState(false)
  const [isFileItem, setIsFileItem] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const voiceUrl = 'https://cdn.pixabay.com/audio/2024/03/15/audio_3c299134d9.mp3'

  const imgList = useMemo(() => {
    if (!klineCharts || !klineCharts.url) return []
    return [klineCharts.url]
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
        <IconBase onClick={copyContent} className="icon-copy"/>
        <IconBase onClick={editContent} className="icon-ai-edit"/>
      </UserOperatorWrapper> */}
      </ContentItemWrapper>
    )
  }
  return (
    <ContentItemWrapper ref={ContentItemWrapperRef} role={role}>
      <ContentItem role={role} key={id}>
        <DeepThink aiContentData={data} isTempAiContent={false} />
        <Content ref={responseContentRef as any} role={role}>
          <Markdown>{content}</Markdown>
          {imgList.length > 0 && (
            <ImgWrapper>
              {imgList.map((item, index) => {
                return (
                  <LazyImage width='100%' key={index} src={item} alt='kline' onClick={() => handleImageClick(item)} />
                )
              })}
            </ImgWrapper>
          )}
        </Content>
      </ContentItem>
      {shouldShowKchart && imgList.length === 0 && <GetKChart data={data} />}
      <Feedback data={data} responseContentRef={responseContentRef as any} />
      <Recommandations agentRecommendationList={agentRecommendationList} />
      <Portal>
        <ImagePreviewModal $visible={!!previewImage} onClick={handleClosePreview}>
          {previewImage && <PreviewImage src={previewImage} alt='preview-kline' onClick={(e) => e.stopPropagation()} />}
        </ImagePreviewModal>
      </Portal>
    </ContentItemWrapper>
  )
})
