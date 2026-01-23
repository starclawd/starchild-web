import styled, { css } from 'styled-components'
import ChatContent from '../ChatContent'
import ChatInput from '../ChatInput'
import { memo, useCallback, useState, useRef } from 'react'
import { useAiResponseContentList, useFileList, useTempAiContentData } from 'store/chat/hooks'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'

const FileDragWrapper = styled.div<{ $isEmpty: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px 0;
  ${({ theme, $isEmpty }) =>
    theme.isMobile
      ? css`
          padding: 0;
          height: calc(100% - ${vm(44)});
        `
      : css`
          ${$isEmpty &&
          css`
            justify-content: center;
          `}
        `}
`

const DropPrompt = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: 2;
`

export default memo(function FileDrag() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [fileList, setFileList] = useFileList()
  const [isDragging, setIsDragging] = useState(false)
  const tempAiContentData = useTempAiContentData()
  const [aiResponseContentList] = useAiResponseContentList()

  const handleDragOver = useCallback((e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])
  const handleDragLeave = useCallback((e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])
  const handleDrop = useCallback(
    (e: any) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      const files = []
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const file = e.dataTransfer.files[i]
        if (file.type.startsWith('image/') && file.type !== 'image/gif') {
          files.push(file)
        }
      }
      const list = [...fileList, ...files]
      setFileList(list)
    },
    [fileList, setFileList],
  )
  return (
    <FileDragWrapper
      ref={scrollRef}
      className={`file-drag-wrapper`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      $isEmpty={aiResponseContentList.length === 0 && !tempAiContentData.id}
    >
      {isDragging && (
        <DropPrompt>
          <Trans>Drop img here to add it to the conversation</Trans>
        </DropPrompt>
      )}
      <ChatContent />
      <ChatInput />
      {/* {isShowDefaultUi && !isMobile && <ShortcutsList />} */}
    </FileDragWrapper>
  )
})
