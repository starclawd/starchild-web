import { Trans } from '@lingui/react/macro'
import { useAppKitAccount } from '@reown/appkit/react'
import { HomeButton } from 'components/Button'
import Pending from 'components/Pending'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { vm } from 'pages/helper'
import { useCallback, useState } from 'react'
import { useBindAddress, useGetCandidateStatus, useGetSignatureText } from 'store/home/hooks'
import { useTheme } from 'store/themecache/hooks'
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

export default function BindTg() {
  const toast = useToast()
  const theme = useTheme()
  const triggerBindAddress = useBindAddress()
  const { signMessageAsync } = useSignMessage()
  const getSignatureText = useGetSignatureText()
  const triggerGetCandidateStatus = useGetCandidateStatus()
  const { address } = useAppKitAccount({ namespace: 'eip155' })
  const [isBindNftLoading, setIsBindNftLoading] = useState(false)
  const bindAddress = useCallback(async () => {
    if (!address) return
    try {
      setIsBindNftLoading(true)
      const signatureText = getSignatureText('Link Telegram')
      const signature = await signMessageAsync({ message: signatureText })
      const data = await triggerBindAddress({ account: address, message: signatureText, signature })
      if (data?.data?.success) {
        await triggerGetCandidateStatus(address)
      } else {
        toast({
          title: <Trans>Link Failed</Trans>,
          description: (data as any).error.data.message,
          status: TOAST_STATUS.ERROR,
          typeIcon: 'icon-bind',
          iconTheme: theme.textL1,
          autoClose: 2000,
        })
      }
      setIsBindNftLoading(false)
    } catch (error) {
      console.log('error', error)
      setIsBindNftLoading(false)
    }
  }, [address, toast, theme.textL1, getSignatureText, signMessageAsync, triggerBindAddress, triggerGetCandidateStatus])
  return (
    <BindTgWrapper>
      <BindTgInfo>
        <span>
          <Trans>Please proceed to link your telegram to log in.</Trans>
        </span>
      </BindTgInfo>
      <BindTgButton onClick={bindAddress}>
        {isBindNftLoading ? <Pending /> : <Trans>Link your Telegram</Trans>}
      </BindTgButton>
    </BindTgWrapper>
  )
}
