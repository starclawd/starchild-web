import { Trans } from '@lingui/react/macro'
import { useAppKitAccount } from '@reown/appkit/react'
import { HomeButton } from 'components/Button'
import Pending from 'components/Pending'
import { vm } from 'pages/helper'
import { useCallback, useState } from 'react'
import { useBindNft, useGetCandidateStatus, useGetSignatureText } from 'store/home/hooks'
import styled, { css } from 'styled-components'
import { useSignMessage } from 'wagmi'
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

export default function BindTg({ setHasBingdTg }: { setHasBingdTg: (hasBingdTg: boolean) => void }) {
  const triggerBindNft = useBindNft()
  const { signMessageAsync } = useSignMessage()
  const getSignatureText = useGetSignatureText()
  const triggerGetCandidateStatus = useGetCandidateStatus()
  const { address } = useAppKitAccount({ namespace: 'eip155' })
  const [isBindNftLoading, setIsBindNftLoading] = useState(false)
  const bindNft = useCallback(async () => {
    if (!address) return
    try {
      setIsBindNftLoading(true)
      const signatureText = getSignatureText('Bind Telegram')
      const signature = await signMessageAsync({ message: signatureText })
      await triggerBindNft({ account: address, message: signatureText, signature })
      await triggerGetCandidateStatus(address)
      setIsBindNftLoading(false)
      setHasBingdTg(true)
    } catch (error) {
      setIsBindNftLoading(false)
    }
  }, [address, getSignatureText, signMessageAsync, setHasBingdTg, triggerBindNft, triggerGetCandidateStatus])
  return (
    <BindTgWrapper>
      <BindTgInfo>
        <span>
          <Trans>Access Pass detected.</Trans>
        </span>
        <span>
          <Trans>You can proceed to log in.</Trans>
        </span>
      </BindTgInfo>
      <BindTgButton onClick={bindNft}>
        {isBindNftLoading ? <Pending /> : <Trans>Link your Telegram</Trans>}
      </BindTgButton>
    </BindTgWrapper>
  )
}
