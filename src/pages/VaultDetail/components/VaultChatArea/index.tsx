import { memo } from 'react'
import styled from 'styled-components'
import ChainOfThought from './components/ChainOfThought'
import MarketItem from './components/MarketItem'
import SignalAlertItem from './components/SignalAlertItem'
import { useSignalList } from 'store/vaultsdetail/hooks/useSignal'
const ChatAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

const ChatContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
  padding: 40px 20px;
`

const VaultChatArea = memo(() => {
  const [signalList] = useSignalList()
  return (
    <ChatAreaContainer>
      <ChatContent>
        {signalList.map((signal) => {
          const { type, signal_id } = signal
          if (type === 'signal') {
            return <SignalAlertItem key={signal_id} signal={signal} />
          }
        })}
      </ChatContent>
    </ChatAreaContainer>
  )
})

VaultChatArea.displayName = 'VaultChatArea'

export default VaultChatArea
