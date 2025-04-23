import { vm } from 'pages/helper'
import styled, { css } from 'styled-components'
import img1 from 'assets/tradeai/voice.png'
import img2 from 'assets/tradeai/voice.png'
import { IconBase } from 'components/Icons'
import { formatFileSize, getFileType } from 'utils'
import { BorderAllSide1PxBox } from 'theme/borderStyled'
import { useTheme } from 'store/themecache/hooks'

const FileItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
  `}
`
const Content = styled.div`
  ${({ theme }) => theme.isMobile && css`
    font-size: .16rem;
    font-weight: 400;
    line-height: .22rem;
    color: #FFF;
  `}
`
const FileList = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
    overflow-x: auto;
    img {
      width: ${vm(60)};
      height: ${vm(60)};
      border-radius: ${vm(12)};
    }
  `}
`

const FileItemItem = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(10)};
    width: ${vm(160)};
    height: ${vm(60)};
    padding: ${vm(3)} ${vm(8)};
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

export default function FileItem() {
  const theme = useTheme()
  const fileList = [{
    name: 'test.png',
    size: 1024,
    type: 'PDF',
  }, {
    name: 'test.png',
    size: 1024,
    type: 'PDF',
  }]
  return <FileItemWrapper>
    <Content>test test test test test test test test test test test </Content>
    <FileList>
      {fileList.map((item, index) => (
        <FileItemItem
          key={index}
          $borderRadius={12}
          $borderColor={theme.textL5}
        >
          <IconBase className="icon-chat-file" />
          <span className="file-desc">
            <span>{item.name}</span>
            <span>{getFileType(item.type)}-{formatFileSize(item.size)}</span>
          </span>
        </FileItemItem>
      ))}
    </FileList>
  </FileItemWrapper>
}
