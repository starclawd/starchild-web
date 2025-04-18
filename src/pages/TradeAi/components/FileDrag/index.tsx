import styled, { css } from 'styled-components'
import AiContent from '../AiContent'
import AiInput from '../AiInput'
import { TRADE_AI_TYPE } from 'store/tradeai/tradeai.d'
import { memo, useCallback, useState } from 'react'
import { useFileList } from 'store/tradeai/hooks'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'

const FileDragWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  height: 100%;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(4)};
    height: calc(100% - ${vm(60)});
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
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.depthGreen};
`

export default memo(function FileDrag({
  tradeAiTypeProp,
}: {
  tradeAiTypeProp: TRADE_AI_TYPE
}) {
  const [fileList, setFileList] = useFileList()
  const [isDragging, setIsDragging] = useState(false)
  
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
    className="file-drag-wrapper"
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
  >
    {isDragging && <DropPrompt>
      <Trans>Drop img here to add it to the conversation</Trans>
    </DropPrompt>}
    <AiContent />
    <AiInput />
  </FileDragWrapper>
})
