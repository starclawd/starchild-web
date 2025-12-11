import { memo } from 'react'
import styled from 'styled-components'
import ChainOfThought from './components/ChainOfThought'
import MarketItem from './components/MarketItem'
import SignalAlertItem from './components/SignalAlertItem'
import { useSignalList } from 'store/vaultsdetail/hooks/useSignal'
import NoData from 'components/NoData'
import { Trans } from '@lingui/react/macro'
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
  height: 100%;
  gap: 8px;
  padding: 40px 20px;
`

const VaultChatArea = memo(({ strategyId }: { strategyId: string }) => {
  const { vaultSignalList } = useSignalList({ strategyId })
  return (
    <ChatAreaContainer>
      <ChatContent className='scroll-style'>
        {vaultSignalList.length > 0 ? (
          vaultSignalList.map((signal) => {
            const { type, signal_id } = signal
            if (type === 'signal') {
              return <SignalAlertItem key={signal_id} signal={signal} />
            }
            if (type === 'thought') {
              return <ChainOfThought key={signal_id} thought={signal} />
            }
            if (type === 'decision') {
              return <MarketItem key={signal_id} decision={signal} />
            }
          })
        ) : (
          <NoData text={<Trans>No signal found.</Trans>} />
        )}
      </ChatContent>
    </ChatAreaContainer>
  )
})

VaultChatArea.displayName = 'VaultChatArea'

export default VaultChatArea
