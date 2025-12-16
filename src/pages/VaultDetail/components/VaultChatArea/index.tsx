import { memo, useMemo } from 'react'
import styled, { css } from 'styled-components'
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

const ChatContent = styled.div<{ $isPaperTrading?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 8px;
  padding: 40px 20px;
  ${({ $isPaperTrading }) =>
    $isPaperTrading &&
    css`
      padding: 0;
      padding-right: 4px !important;
    `}
`

const VaultChatArea = memo(({ isPaperTrading, strategyId }: { isPaperTrading?: boolean; strategyId: string }) => {
  const { vaultSignalList } = useSignalList({ strategyId })
  const filteredSignalList = useMemo(() => {
    return vaultSignalList.filter((signal) => signal.strategy_id === strategyId)
  }, [vaultSignalList, strategyId])
  return (
    <ChatAreaContainer>
      <ChatContent $isPaperTrading={isPaperTrading} className='scroll-style'>
        {filteredSignalList.length > 0 ? (
          filteredSignalList.map((signal) => {
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
