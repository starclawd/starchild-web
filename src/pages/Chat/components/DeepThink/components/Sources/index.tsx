import { ANI_DURATION } from 'constants/index'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { vm } from 'pages/helper'
import { SourceListDetailsDataType } from 'store/chat/chat.d'
import styled, { css } from 'styled-components'
import { getFaviconUrl } from 'utils/common'

const SourcesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(20)};
    `}
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 8px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
    `}
`

const SourceItem = styled.a`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  transition: all ${ANI_DURATION}s;
  background-color: transparent;
  > span:first-child {
    display: flex;
    align-items: center;
    gap: 6px;
    img {
      width: 18px;
      height: 18px;
      border-radius: 4px;
      flex-shrink: 0;
    }
    span {
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      color: ${({ theme }) => theme.textL2};
    }
  }
  > span:last-child {
    display: flex;
    flex-direction: column;
    gap: 4px;
    span:first-child {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: ${({ theme }) => theme.textL1};
    }
    span:last-child {
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      color: ${({ theme }) => theme.textL3};
    }
  }
  ${({ theme }) =>
    theme.isMobile
      ? css`
          gap: ${vm(8)};
          padding: ${vm(12)};
          border-radius: ${vm(12)};
          > span:first-child {
            display: flex;
            align-items: center;
            gap: ${vm(6)};
            img {
              width: ${vm(18)};
              height: ${vm(18)};
              border-radius: ${vm(4)};
            }
            span {
              font-size: 0.12rem;
              line-height: 0.18rem;
            }
          }
          > span:last-child {
            display: flex;
            flex-direction: column;
            gap: ${vm(4)};
            span:first-child {
              font-size: 0.14rem;
              line-height: 0.2rem;
            }
            span:last-child {
              font-size: 0.12rem;
              line-height: 0.18rem;
            }
          }
          &:active {
            -webkit-background-clip: unset !important;
            color: unset !important;
            background-color: ${({ theme }) => theme.bgL2} !important;
          }
        `
      : css`
          &:hover {
            -webkit-background-clip: unset !important;
            color: unset !important;
            background-color: ${({ theme }) => theme.bgT20} !important;
          }
        `}
`

export default function Sources({ sourceList }: { sourceList: SourceListDetailsDataType[] }) {
  const scrollRef = useScrollbarClass<HTMLDivElement>()
  return (
    <SourcesWrapper className='sources-wrapper'>
      <List ref={scrollRef} className='sources-list scroll-style'>
        {sourceList.map((item) => {
          const { id, title, description } = item
          const [origin, faviconUrl] = getFaviconUrl(id)
          return (
            <SourceItem key={id} rel='noopener noreferrer' href={id} target='_blank'>
              <span>
                <img src={faviconUrl} alt='' />
                <span>{origin.replace('https://', '')}</span>
              </span>
              <span>
                <span>{title}</span>
                <span>{description}</span>
              </span>
            </SourceItem>
          )
        })}
      </List>
    </SourcesWrapper>
  )
}
