import styled, { css } from 'styled-components'
import { ContentWrapper } from '../../styles'
import WalletAddress from '../WalletAddress'
import TgInfo from '../TgInfo'
import { Trans } from '@lingui/react/macro'
import { HomeButton } from 'components/Button'
import { vm } from 'pages/helper'
import { useIsMobile } from 'store/application/hooks'
import { useState } from 'react'
import BindTg from './components/BindTg'
import MosaicImage from './components/MosaicImage'
import { ANI_DURATION } from 'constants/index'

const MintNftWrapper = styled.div<{ $hasBingdTg: boolean }>`
  display: flex;
  gap: 20px;
  width: fit-content;
  height: 272px;
  transition: height ${ANI_DURATION}s;
  ${({ $hasBingdTg }) =>
    $hasBingdTg &&
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

export default function MintNft() {
  const isMobile = useIsMobile()
  const [hasBingdTg, setHasBingdTg] = useState(false)
  const hasNft = true
  return (
    <MintNftWrapper $hasBingdTg={hasBingdTg}>
      <Left>
        <LeftTop>
          <WalletAddress />
          {hasBingdTg && <TgInfo />}
        </LeftTop>
        <LeftBottom>
          {/* <MintNftItem /> */}
          <BindTg setHasBingdTg={setHasBingdTg} />
          {/* <BindSuccess /> */}
        </LeftBottom>
      </Left>
      {isMobile && <Line />}
      <Right>
        <NftWrapper $hasNft={hasNft}>
          {hasNft ? (
            <MosaicImage hasBingdTg={hasBingdTg} />
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
