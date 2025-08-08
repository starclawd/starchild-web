import { Trans } from '@lingui/react/macro'
import styled, { css } from 'styled-components'
import { ContentWrapper } from '../../styles'
import WalletAddress from '../WalletAddress'
import { HomeButton } from 'components/Button'
import { useCallback, useState } from 'react'
import { useUserInfo } from 'store/login/hooks'
import { vm } from 'pages/helper'
import { useAppKitAccount } from '@reown/appkit/react'
import { useCollectWhitelist, useGetCandidateStatus } from 'store/home/hooks'
import Pending from 'components/Pending'

const WaitlistWrapper = styled(ContentWrapper)`
  width: 480px;
  gap: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(335)};
      gap: ${vm(16)};
    `}
`

const Text = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  span:first-child {
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
    text-align: center;
    color: ${({ theme }) => theme.textL1};
  }
  span:nth-child(2) {
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
      span:nth-child(2) {
        font-size: 0.13rem;
        line-height: 0.2rem;
      }
    `}
`

const InputContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  height: 32px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex-direction: column;
      gap: ${vm(8)};
      height: auto;
    `}
`

const InputerWrapper = styled.div`
  position: relative;
  width: 100%;
  input {
    width: 100%;
    height: 100%;
    padding: 6px 0;
    background: transparent;
    color: rgba(255, 255, 255, 0.98);
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    &::placeholder {
      color: rgba(255, 255, 255, 0.2);
    }
  }
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background: #fff;
    transition: width 0.3s ease;
    z-index: 10;
  }
  &:hover::after,
  &.has-content::after {
    width: 100%;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      display: flex;
      align-items: center;
      width: 100%;
      height: ${vm(32)};
      input {
        padding: ${vm(6)} 0;
        font-size: 0.14rem;
        line-height: 0.2rem;
      }
    `}
`

const ButtonJoin = styled(HomeButton)``

export default function JoinWaitlist() {
  const [isLoading, setIsLoading] = useState(false)
  const triggerJoinWaitlist = useCollectWhitelist()
  const triggerGetCandidateStatus = useGetCandidateStatus()
  const { address } = useAppKitAccount({ namespace: 'eip155' })
  const [tgName, setTgName] = useState('')
  const handleTgNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTgName(e.target.value)
  }
  const handleJoinWaitlist = useCallback(async () => {
    if (!address) return
    try {
      setIsLoading(true)
      await triggerJoinWaitlist({ account: address, telegramUserName: tgName })
      await triggerGetCandidateStatus(address)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }, [address, tgName, triggerJoinWaitlist, triggerGetCandidateStatus])
  return (
    <WaitlistWrapper>
      <WalletAddress />
      <Text>
        <span>
          <Trans>Your address was not whitelisted.</Trans>
        </span>
        <span>
          <Trans>Share your Telegram account to join the waitlist.</Trans>
        </span>
        <InputContent>
          <InputerWrapper className={tgName ? 'has-content' : ''}>
            <input type='text' value={tgName} placeholder='Telegram Username' onChange={handleTgNameChange} />
          </InputerWrapper>
          {/* <InputerWrapper className={email ? 'has-content' : ''}>
            <input type='text' placeholder='Your Email' value={email} onChange={handleEmailChange} />
          </InputerWrapper> */}
        </InputContent>
      </Text>
      <ButtonJoin onClick={handleJoinWaitlist}>{isLoading ? <Pending /> : <Trans>Join Waitlist</Trans>}</ButtonJoin>
    </WaitlistWrapper>
  )
}
