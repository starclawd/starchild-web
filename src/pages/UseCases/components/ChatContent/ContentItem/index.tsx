import styled from 'styled-components'
import { ROLE_TYPE, TempAiContentDataType } from 'store/chat/chat.d'
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import Markdown from 'components/Markdown'
import { Content, ContentItem, ContentItemWrapper } from 'pages/Chat/styles'
import { ANI_DURATION } from 'constants/index'
import DeepThink from '../DeepThink'
import Portal from 'components/Portal'
import ChatHistoryContent from 'pages/AgentDetail/components/ChatHistory/components/HistoryContent'

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
  const responseContentRef = useRef<HTMLDivElement>(null)
  const { id, content, role, klineCharts, triggerHistory } = data
  const ContentItemWrapperRef = useRef<HTMLDivElement>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const imgList = useMemo(() => {
    if (!klineCharts || !klineCharts.url) return []
    return [klineCharts.url]
  }, [klineCharts])

  const handleImageClick = useCallback((imageUrl: string) => {
    setPreviewImage(imageUrl)
  }, [])

  const handleClosePreview = useCallback(() => {
    setPreviewImage(null)
  }, [])

  const list = useMemo(() => {
    if (!Array.isArray(triggerHistory)) {
      return []
    }
    return [...triggerHistory].map((item: any) => {
      return {
        updateTime: item?.trigger_time || 0,
        content: item?.message || item?.error || '',
      }
    })
  }, [triggerHistory])

  if (role === ROLE_TYPE.USER) {
    return (
      <ContentItemWrapper role={role}>
        <ContentItem role={role} key={id}>
          <Content role={role}>{content}</Content>
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
        <DeepThink aiContentData={data} isTempAiContent={false} />
        <Content ref={responseContentRef as any} role={role}>
          {list.length > 0 ? <ChatHistoryContent list={list} /> : <Markdown>{content}</Markdown>}
          {imgList.length > 0 && (
            <ImgWrapper>
              {imgList.map((item, index) => {
                return <img key={index} src={item} alt='kline' onClick={() => handleImageClick(item)} />
              })}
            </ImgWrapper>
          )}
        </Content>
      </ContentItem>
      <Portal>
        <ImagePreviewModal $visible={!!previewImage} onClick={handleClosePreview}>
          {previewImage && <PreviewImage src={previewImage} alt='preview-kline' onClick={(e) => e.stopPropagation()} />}
        </ImagePreviewModal>
      </Portal>
    </ContentItemWrapper>
  )
})
