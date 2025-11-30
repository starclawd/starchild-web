import { memo } from 'react'
import styled from 'styled-components'
import OverviewItem from './components/OverviewItem'
import MarketItem from './components/MarketItem'
import PortfolioItem from './components/PortfolioItem'
const ChatAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

const ChatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 40px 20px;
`

const VaultChatArea = memo(() => {
  return (
    <ChatAreaContainer>
      <ChatContent>
        <OverviewItem />
        <MarketItem />
        <PortfolioItem />
      </ChatContent>
    </ChatAreaContainer>
  )
})

VaultChatArea.displayName = 'VaultChatArea'

export default VaultChatArea
