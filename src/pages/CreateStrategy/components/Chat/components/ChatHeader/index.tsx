import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import VaultsWalletConnect from 'pages/Vaults/components/VaultsWalletConnect'
import styled from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import { useCurrentRouter } from 'store/application/hooks'
import { useCallback } from 'react'
import { ROUTER } from 'pages/router'

const ChatHeaderWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 49px;
  padding: 0 8px;
`

const InnerContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.lineDark8};
`
const LeftContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.textL2};
  .icon-chat-back {
    font-size: 24px;
    color: ${({ theme }) => theme.textL2};
  }
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
`

export default function ChatHeader() {
  const [, setCurrentRouter] = useCurrentRouter()
  const handleBackClick = useCallback(() => {
    setCurrentRouter(ROUTER.MY_STRATEGY)
  }, [setCurrentRouter])
  return (
    <ChatHeaderWrapper>
      <InnerContent>
        <LeftContent onClick={handleBackClick}>
          <IconBase className='icon-chat-back' />
          <span>
            <Trans>My Strategies</Trans>
          </span>
        </LeftContent>
      </InnerContent>
    </ChatHeaderWrapper>
  )
}
