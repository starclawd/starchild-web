import { IconBase } from 'components/Icons'
import { vm } from 'pages/helper'
import { useCallback } from 'react'
import { useFileList } from 'store/tradeai/hooks'
import styled, { css } from 'styled-components'
import { formatFileSize, getFileType } from 'utils'

const FileShowWrapper = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  gap: 12px;
  padding-top: ${vm(12)};
  overflow-x: auto;
  ${({ theme }) => theme.isMobile && css`
    padding-top: ${vm(12)};
    height: ${vm(72)};
    gap: ${vm(12)};
  `}
`

const ImgItem = styled.div`
  position: relative;
  display: flex;
  flex-shrink: 0;
  img {
    width: 60px;
    height: 60px;
    border-radius: 12px;
  }
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(60)};
    height: ${vm(60)};
    border-radius: ${vm(12)};
  `}
`

const DeleteIconWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(24)};
    height: ${vm(24)};
    top: ${vm(-8)};
    right: ${vm(-8)};
    border-radius: 50%;
    border: 1px solid ${({ theme }) => theme.bgT30};
    background-color: ${({ theme }) => theme.bgL0};
    font-size: .14rem;
    color: ${({ theme }) => theme.textL3};
  `}
`

const FileWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(10)};
    width: ${vm(160)};
    height: ${vm(60)};
    border-radius: ${vm(12)};
    padding: ${vm(3)} ${vm(8)};
    border: 1px solid ${({ theme }) => theme.textL5};
    background-color: ${({ theme }) => theme.sfC1};
    .icon-chat-file {
      font-size: .24rem;
      color: ${({ theme }) => theme.textL1};
    }
    .file-desc {
      display: flex;
      flex-direction: column;
      gap: ${vm(4)};
      span:first-child {
        width: ${vm(108)};
        font-size: .14rem;
        font-weight: 400;
        line-height: .2rem;
        color: ${({ theme }) => theme.textL1};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      span:last-child {
        font-size: .12rem;
        font-weight: 400;
        line-height: .18rem;
        color: ${({ theme }) => theme.textL3};
      }
    }
  `}
`

export default function FileShow() {
  const [fileList, setFileList] = useFileList()
  const deleteImg = useCallback((deleteIndex: number) => {
    return () => {
      const list = fileList.filter((data, index) => index !== deleteIndex)
      setFileList(list)
    }
  }, [fileList, setFileList])
  if (fileList.length === 0) {
    return null
  }
  return <FileShowWrapper>
    {fileList.map((file, index) => {
      const { lastModified } = file
      const src = URL.createObjectURL(file)
      return file.type.startsWith('image/')
        ? <ImgItem key={String(lastModified)}>
          <DeleteIconWrapper onClick={deleteImg(index)}>
            <IconBase className="icon-chat-delete" />
          </DeleteIconWrapper>
          <img src={src} alt="" />
        </ImgItem>
        : <FileWrapper key={String(lastModified)}>
          <DeleteIconWrapper onClick={deleteImg(index)}>
            <IconBase className="icon-chat-delete" />
          </DeleteIconWrapper>
          <IconBase className="icon-chat-file" />
          <span className="file-desc">
            <span>{file.name}</span>
            <span>{getFileType(file.type)}-{formatFileSize(file.size)}</span>
          </span>
        </FileWrapper>
    })}
  </FileShowWrapper>
}
