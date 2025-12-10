import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import VaultsWalletConnect from 'pages/Vaults/components/VaultsWalletConnect'
import styled from 'styled-components'

const ChatHeaderWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 65px;
  padding: 0 20px;
`

const InnerContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.lineDark8};
`
const LeftContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px;
  color: ${({ theme }) => theme.textL2};
  .icon-chat-back {
    font-size: 24px;
    color: ${({ theme }) => theme.textL2};
  }
`

export default function ChatHeader() {
  return (
    <ChatHeaderWrapper>
      <InnerContent>
        <LeftContent>
          <IconBase className='icon-chat-back' />
          <span>
            <Trans>My Strategy</Trans>
          </span>
        </LeftContent>
        <VaultsWalletConnect mode='compact' />
      </InnerContent>
    </ChatHeaderWrapper>
  )
}
