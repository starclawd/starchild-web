import styled, { css } from 'styled-components'
import AiContent from '../AiContent'
import AiInput from '../AiInput'
import { memo, useCallback, useState } from 'react'
import { useFileList, useIsShowDefaultUi } from 'store/tradeai/hooks'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import ShortcutsList from '../DefalutUi/components/ShortcutsList'
import { useIsMobile } from 'store/application/hooks'

const FileDragWrapper = styled.div<{ $isShowDefaultUi: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-top: 16px;
  ${({ theme, $isShowDefaultUi }) => theme.isMobile
  ? css`
    padding-top: 0;
    height: calc(100% - ${vm(60)});
    ${$isShowDefaultUi && css`
      height: 100%;
    `}
  ` : css`
    ${$isShowDefaultUi && css`
      gap: 18px;
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
  const isMobile = useIsMobile()
  const [fileList, setFileList] = useFileList()
  const [isDragging, setIsDragging] = useState(false)
  const isShowDefaultUi = useIsShowDefaultUi()

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
  const handleDrop = useCallback((e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const files = [];
    for (let i = 0; i < e.dataTransfer.files.length; i++) {
      const file = e.dataTransfer.files[i];
      if (file.type.startsWith('image/') && file.type !== 'image/gif') {
        files.push(file);
      }
    }
    const list = [
      ...fileList,
      ...files,
    ]
    setFileList(list)
  }, [fileList, setFileList])
  return <FileDragWrapper
    className={`file-drag-wrapper ${isShowDefaultUi ? 'scroll-style' : ''}`}
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
    $isShowDefaultUi={isShowDefaultUi}
  >
    {isDragging && <DropPrompt>
      <Trans>Drop img here to add it to the conversation</Trans>
    </DropPrompt>}
    <AiContent />
    <AiInput />
    {isShowDefaultUi && !isMobile && <ShortcutsList />}
  </FileDragWrapper>
})
