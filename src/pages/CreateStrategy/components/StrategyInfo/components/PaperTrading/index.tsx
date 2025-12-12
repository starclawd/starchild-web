import styled from 'styled-components'
import { useCallback, useState } from 'react'
import PaperTradingSetup from './components/PaperTradingSetup'
import PaperTradingRunning from './components/PaperTradingRunning'

const PaperTradingWrapper = styled.div`
  display: flex;
  width: 100%;
`

enum PaperTradingView {
  SETUP = 'setup',
  RUNNING = 'running',
}

export default function PaperTrading() {
  const [currentView, setCurrentView] = useState<PaperTradingView>(PaperTradingView.SETUP)

  const handleRunPaperTrading = useCallback(() => {
    setCurrentView(PaperTradingView.RUNNING)
  }, [])

  return (
    <PaperTradingWrapper>
      {currentView === PaperTradingView.SETUP && <PaperTradingSetup onRunPaperTrading={handleRunPaperTrading} />}
      {currentView === PaperTradingView.RUNNING && <PaperTradingRunning />}
    </PaperTradingWrapper>
  )
}
