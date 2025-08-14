import dayjs from 'dayjs'
import styled, { css } from 'styled-components'
import { ContentWrapper } from '../../styles'
import WalletAddress from '../WalletAddress'
import TgInfo from '../TgInfo'
import { Trans } from '@lingui/react/macro'
import { HomeButton } from 'components/Button'
import { vm } from 'pages/helper'
import { useIsMobile } from 'store/application/hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import BindTg from './components/BindTg'
import MosaicImage from './components/MosaicImage'
import { ANI_DURATION } from 'constants/index'
import MintNft from './components/MintNft'
import { useCandidateStatus, useGetCandidateStatus, useGetSignatureText, useMintNft } from 'store/home/hooks'
import { useAppKitAccount } from '@reown/appkit/react'
import { useSignMessage } from 'wagmi'
import Pending from 'components/Pending'
import BindSuccess from './components/BindSuccess'
import Divider from 'components/Divider'
import { useTheme } from 'store/themecache/hooks'
import useToast, { TOAST_STATUS } from 'components/Toast'

const NftMintAndBindWrapper = styled.div<{ $hasBindTg: boolean }>`
  display: flex;
  gap: 20px;
  width: fit-content;
  height: 272px;
  transition: height ${ANI_DURATION}s;
  ${({ $hasBindTg }) =>
    $hasBindTg &&
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

const Right = styled(ContentWrapper)`
  justify-content: space-between;
  width: 240px;
  height: 100%;
  gap: 12px;
  > span {
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    text-align: center;
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

const NftWrapper = styled.div<{ $hasMinted: boolean }>`
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
  ${({ $hasMinted }) =>
    $hasMinted &&
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

export default function NftMintAndBind() {
  const theme = useTheme()
  const toast = useToast()
  const isMobile = useIsMobile()
  const [{ hasMinted, burnAt, mintEligibleAt }] = useCandidateStatus()
  const [isLoading, setIsLoading] = useState(false)
  const { address } = useAppKitAccount({ namespace: 'eip155' })
  const getSignatureText = useGetSignatureText()
  const triggerGetCandidateStatus = useGetCandidateStatus()
  const triggerMintNft = useMintNft()
  const { signMessageAsync } = useSignMessage()
  const hasBindTg = useMemo(() => {
    return !!burnAt
  }, [burnAt])
  const mintNft = useCallback(async () => {
    if (!address) return
    const time = Date.now()
    const claimTime = dayjs.tz(mintEligibleAt, 'Etc/UTC').format('YYYY-MM-DD HH:mm:ss')
    if (time < mintEligibleAt) {
      toast({
        title: <Trans>Claim Failed</Trans>,
        description: <Trans>You can not claim at this time. Return at {claimTime} UTC to try and claim.</Trans>,
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-claim',
        iconTheme: theme.textL1,
        autoClose: 2000,
      })
      return
    }
    try {
      setIsLoading(true)
      const signatureText = getSignatureText('Mint NFT')
      const signature = await signMessageAsync({ message: signatureText })
      const data = await triggerMintNft({ account: address, message: signatureText, signature })
      if (data?.data?.success) {
        await triggerGetCandidateStatus(address)
      } else {
        toast({
          title: <Trans>Claim Failed</Trans>,
          description: (data as any).error.data.message,
          status: TOAST_STATUS.ERROR,
          typeIcon: 'icon-claim',
          iconTheme: theme.textL1,
          autoClose: 2000,
        })
      }
      setIsLoading(false)
    } catch (error) {
      console.log('error', error)
      setIsLoading(false)
    }
  }, [
    address,
    mintEligibleAt,
    theme.textL1,
    toast,
    getSignatureText,
    signMessageAsync,
    triggerMintNft,
    triggerGetCandidateStatus,
  ])
  return (
    <NftMintAndBindWrapper $hasBindTg={hasBindTg}>
      <Left>
        <LeftTop>
          <WalletAddress />
          {hasBindTg && <TgInfo />}
        </LeftTop>
        <LeftBottom>{!hasMinted ? <MintNft /> : !hasBindTg ? <BindTg /> : <BindSuccess />}</LeftBottom>
      </Left>
      {isMobile && <Divider color={theme.text20} />}
      <Right>
        <NftWrapper $hasMinted={hasMinted}>
          {hasMinted ? (
            <MosaicImage hasBindTg={hasBindTg} />
          ) : (
            <MintButton onClick={mintNft}>{isLoading ? <Pending /> : <Trans>Claim</Trans>}</MintButton>
          )}
        </NftWrapper>
        <span>
          {!hasBindTg ? (
            <Trans>Starchild Early Access Pass</Trans>
          ) : (
            <Trans>
              Your Starchild Early Access Pass has been consumed. A Starchild Gen:0 Builders NFT has been sent to your
              wallet.
            </Trans>
          )}
        </span>
      </Right>
    </NftMintAndBindWrapper>
  )
}
