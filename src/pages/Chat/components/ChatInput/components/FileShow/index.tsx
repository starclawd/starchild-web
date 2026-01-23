import { IconBase } from 'components/Icons'
import { vm } from 'pages/helper'
import { useCallback, useRef } from 'react'
import { useTheme } from 'store/themecache/hooks'
import { useFileList } from 'store/chat/hooks'
import styled, { css } from 'styled-components'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { formatFileSize, getFileType } from 'utils'
import LazyImage from 'components/LazyImage'

const FileShowWrapper = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  gap: 12px;
  padding-top: ${vm(12)};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding-top: ${vm(12)};
      height: ${vm(72)};
      gap: ${vm(12)};
    `}
`

const ImgItem = styled.div`
  position: relative;
  display: flex;
  flex-shrink: 0;
`

const DeleteIconWrapper = styled(BorderAllSide1PxBox)`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(24)};
      height: ${vm(24)};
      top: ${vm(-8)};
      right: ${vm(-8)};
      background-color: ${({ theme }) => theme.bgL0};
      font-size: 0.14rem;
      color: ${({ theme }) => theme.black200};
    `}
`

const FileWrapper = styled(BorderAllSide1PxBox)`
  position: relative;
  display: flex;
  align-items: center;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(10)};
      width: ${vm(160)};
      height: ${vm(60)};
      padding: ${vm(3)} ${vm(8)};
      background-color: ${({ theme }) => theme.sfC1};
      .icon-chat-file {
        font-size: 0.24rem;
        color: ${({ theme }) => theme.black0};
      }
      .file-desc {
        display: flex;
        flex-direction: column;
        gap: ${vm(4)};
        span:first-child {
          width: ${vm(108)};
          font-size: 0.14rem;
          font-weight: 400;
          line-height: 0.2rem;
          color: ${({ theme }) => theme.black0};
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        span:last-child {
          font-size: 0.12rem;
          font-weight: 400;
          line-height: 0.18rem;
          color: ${({ theme }) => theme.black200};
        }
      }
    `}
`

export default function FileShow() {
  const theme = useTheme()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [fileList, setFileList] = useFileList()
  const deleteImg = useCallback(
    (deleteIndex: number) => {
      return () => {
        const list = fileList.filter((data, index) => index !== deleteIndex)
        setFileList(list)
      }
    },
    [fileList, setFileList],
  )
  if (fileList.length === 0) {
    return null
  }
  return (
    <FileShowWrapper ref={scrollRef} className='scroll-style'>
      {fileList.map((file, index) => {
        const { lastModified } = file
        const src = URL.createObjectURL(file)
        return file.type.startsWith('image/') ? (
          <ImgItem key={String(lastModified)}>
            <DeleteIconWrapper $borderRadius={12} $borderColor={theme.black600} onClick={deleteImg(index)}>
              <IconBase className='icon-chat-delete' />
            </DeleteIconWrapper>
            <LazyImage src={src} alt='' width={60} height={60} borderRadius='12px' />
          </ImgItem>
        ) : (
          <FileWrapper $borderRadius={12} $borderColor={theme.black600} key={String(lastModified)}>
            <DeleteIconWrapper $borderRadius={12} $borderColor={theme.black600} onClick={deleteImg(index)}>
              <IconBase className='icon-chat-delete' />
            </DeleteIconWrapper>
            <IconBase className='icon-chat-file' />
            <span className='file-desc'>
              <span>{file.name}</span>
              <span>
                {getFileType(file.type)}-{formatFileSize(file.size)}
              </span>
            </span>
          </FileWrapper>
        )
      })}
    </FileShowWrapper>
  )
}
