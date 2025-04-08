import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { Route, Routes } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { ThemeProvider } from 'styles/ThemeProvider'
import { Header } from 'components/Header'
import { ROUTER, TradeAi } from 'pages/router'
import { useIsMobile } from 'store/application/hooks'

dayjs.extend(utc)
dayjs.extend(timezone)

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  background-color: ${({ theme }) => theme.bg1};
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  &::-webkit-scrollbar-thumb {
    background: transparent;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
`

const BodyWrapper = styled.div<{ isTradeAiPage?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  z-index: 1;
  ${({ isTradeAiPage }) =>
    isTradeAiPage &&
    css`
      height: calc(100% - 94px);
      overflow: hidden;
    `
  }
`

const MobileBodyWrapper = styled(BodyWrapper)`
  height: 100%;
`

function AppContent() {
  const isMobile = useIsMobile()
  return isMobile
    ? <AppWrapper id="appRoot">
      <MobileBodyWrapper>
      </MobileBodyWrapper>
    </AppWrapper>
    : <AppWrapper className="scroll-style-page" id="appRoot">
      <Header />
      <BodyWrapper>
        <Routes>
          <Route path={ROUTER.TRADE_AI} element={<TradeAi />} />
        </Routes>
      </BodyWrapper>
    </AppWrapper>
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
