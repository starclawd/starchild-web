import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { vm } from 'pages/helper'
import { useIsMobile } from 'store/application/hooks'
import styled from 'styled-components'
import { css } from 'styled-components'

const MintNftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  span:first-child {
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    text-align: center;
    color: ${({ theme }) => theme.textL1};
  }
  span:last-child {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL3};
    .icon-chat-back {
      transform: rotate(180deg);
      font-size: 18px;
      color: ${({ theme }) => theme.textL3};
    }
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      span:first-child {
        font-size: 0.18rem;
        line-height: 0.26rem;
      }
      span:last-child {
        font-size: 0.13rem;
        line-height: 0.2rem;
        .icon-chat-back {
          font-size: 0.18rem;
        }
      }
    `}
`
export default function MintNft() {
  return (
    <MintNftWrapper>
      <span>
        <Trans>User has been identified.</Trans>
      </span>
      <span>
        <Trans>Please go to claim NFT first.</Trans>
        <IconBase className='icon-chat-back' />
      </span>
    </MintNftWrapper>
  )
}
