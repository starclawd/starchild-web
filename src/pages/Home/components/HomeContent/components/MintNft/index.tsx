import styled, { css } from 'styled-components'
import { ContentWrapper } from '../../styles'
import WalletAddress from '../WalletAddress'
import TgInfo from '../TgInfo'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { HomeButton } from 'components/Button'
import { vm } from 'pages/helper'
import { useIsMobile } from 'store/application/hooks'

const MintNftWrapper = styled.div<{ $bindSuccess: boolean }>`
  display: flex;
  gap: 20px;
  width: fit-content;
  height: 272px;
  ${({ $bindSuccess }) =>
    $bindSuccess &&
    css`
      height: 324px;
    `}
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(335)};
      height: auto;
      flex-direction: column;
      gap: ${vm(16)};
      padding: ${vm(16)};
      border-radius: ${vm(16)};
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(6px);
    `}
`

const Left = styled(ContentWrapper)`
  width: 480px;
  height: 100%;
  gap: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
      height: auto;
      gap: ${vm(16)};
      padding: 0;
      border: none;
      background: none;
      backdrop-filter: none;
    `}
`

const LeftTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`

const LeftBottom = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const Line = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.text20};
`

const Right = styled(ContentWrapper)`
  justify-content: space-between;
  width: 240px;
  height: 100%;
  gap: 12px;
  > span {
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL1};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
      height: auto;
      gap: ${vm(8)};
      padding: 0;
      > span {
        font-size: 0.12rem;
        line-height: 0.18rem;
      }
      border: none;
      background: none;
      backdrop-filter: none;
    `}
`

const NftWrapper = styled.div<{ $hasNft: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
  ${({ $hasNft }) =>
    $hasNft &&
    css`
      border: none;
      background: none;
    `}
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(140)};
      height: ${vm(140)};
      border-radius: ${vm(12)};
    `}
`

const MintButton = styled(HomeButton)`
  width: 98px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(94)};
    `}
`

const MintNftItemWrapper = styled.div`
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

function MintNftItem() {
  const isMobile = useIsMobile()
  return (
    <MintNftItemWrapper>
      <span>
        <Trans>
          Your wallet doesn't have StarChild NFT,
          {!isMobile && <br />} unable to authorize login
        </Trans>
      </span>
      <span>
        <Trans>Please go to claim NFT first.</Trans>
        <IconBase className='icon-chat-back' />
      </span>
    </MintNftItemWrapper>
  )
}

const BindTgWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 32px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(16)};
    `}
`

const BindTgInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  span:first-child {
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    text-align: center;
    color: ${({ theme }) => theme.textL1};
  }
  span:last-child {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    text-align: center;
    color: ${({ theme }) => theme.textL3};
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
      }
    `}
`

const BindTgButton = styled(HomeButton)`
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(180)};
    `}
`

function BindTg() {
  return (
    <BindTgWrapper>
      <BindTgInfo>
        <span>
          <Trans>StarChild NFT detected</Trans>
          {/* <Trans>StarChild NFT mint successful</Trans> */}
        </span>
        <span>
          <Trans>You can proceed with authorization login</Trans>
        </span>
      </BindTgInfo>
      <BindTgButton>
        <Trans>Bind Telegram</Trans>
      </BindTgButton>
    </BindTgWrapper>
  )
}

const BindSuccessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(16)};
    `}
`

const BindSuccessInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  span:first-child {
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    text-align: center;
    color: ${({ theme }) => theme.textL1};
  }
  span:last-child {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    text-align: center;
    color: ${({ theme }) => theme.textL3};
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
      }
    `}
`

const JoinButton = styled(HomeButton)`
  width: 120px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(180)};
    `}
`

function BindSuccess() {
  return (
    <BindSuccessWrapper>
      <BindSuccessInfo>
        <span>
          <Trans>
            Congratulations!
            <br /> You have login succesfully.
          </Trans>
        </span>
        <span>
          <Trans>Please join our VIP users group</Trans>
        </span>
      </BindSuccessInfo>
      <JoinButton>
        <Trans>join</Trans>
      </JoinButton>
    </BindSuccessWrapper>
  )
}

export default function MintNft() {
  const isMobile = useIsMobile()
  const nftScr = ''
  const bindSuccess = true
  return (
    <MintNftWrapper $bindSuccess={bindSuccess}>
      <Left>
        <LeftTop>
          <WalletAddress />
          {/* <TgInfo /> */}
        </LeftTop>
        <LeftBottom>
          {/* <MintNftItem /> */}
          <BindTg />
          {/* <BindSuccess /> */}
        </LeftBottom>
      </Left>
      {isMobile && <Line />}
      <Right>
        <NftWrapper $hasNft={!!nftScr}>
          {nftScr ? (
            <img src={nftScr} alt='nftScr' />
          ) : (
            <MintButton>
              <Trans>Mint NFT</Trans>
            </MintButton>
          )}
        </NftWrapper>
        <span>
          <Trans>StarChild AI Agent NFT</Trans>
        </span>
      </Right>
    </MintNftWrapper>
  )
}
