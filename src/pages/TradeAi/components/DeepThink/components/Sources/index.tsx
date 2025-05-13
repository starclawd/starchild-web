import { Trans } from '@lingui/react/macro'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import styled, { css } from 'styled-components'

const SourcesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(20)};
  `}
`

const Title = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) => theme.isMobile && css`
    font-size: 0.16rem;
    line-height: 0.22rem;
  `}
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
  `}
`

const SourceItem = styled.a`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 16px;
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
  &:hover {
    -webkit-background-clip: unset !important;
    color: unset !important;
    background-color: ${({ theme }) => theme.bgL2} !important;
  }
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
    padding: ${vm(12)};
    border-radius: ${vm(16)};
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
  `}
`

export default function Sources({
  sourceList
}: {
  sourceList: any[]
}) {
  return <SourcesWrapper>
    <Title><span><Trans>References</Trans></span></Title>
    <List>
      {sourceList.map((item, index) => {
        return <SourceItem key={index} rel="noopener noreferrer" href="" target="_blank">
          <span>
            <img src="" alt="" />
            <span>linkedin.com</span>
          </span>
          <span>
            <span>RWA Tokenization: Recent Developments and Key Trends</span>
            <span>Real-world asset (RWA) tokenization has expanded into multiple asset classes, each...</span>
          </span>
        </SourceItem>
      })}
    </List>
  </SourcesWrapper>
}
