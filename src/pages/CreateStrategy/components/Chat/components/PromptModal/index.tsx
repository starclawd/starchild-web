import styled, { css } from 'styled-components'
import Modal from 'components/Modal'
import BottomSheet from 'components/BottomSheet'
import { usePromptModalToggle, useIsMobile, useModalOpen } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { Trans } from '@lingui/react/macro'
import { memo } from 'react'
import { vm } from 'pages/helper'
import Markdown from 'components/Markdown'
const CreateAgentModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 560px;
  max-height: 640px;
  border-radius: 24px;
  background: ${({ theme }) => theme.black800};
  backdrop-filter: blur(8px);
`

const CreateAgentModalMobileWrapper = styled(ModalSafeAreaWrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: transparent;
  /* 移除背景和模糊效果，因为 BottomSheet 会提供 */
`

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px 0 8px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: ${({ theme }) => theme.black0};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(20)} ${vm(8)} ${vm(8)};
      font-size: 0.2rem;
      line-height: 0.28rem;
    `}
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  height: calc(100% - 76px);
  padding: 20px;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.black900};
  .markdown-wrapper {
    overflow: unset;
    color: ${({ theme }) => theme.black300};
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    h2 {
      margin: 0;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px;
      color: ${({ theme }) => theme.black100};
    }
    p,
    ol,
    ul {
      margin-bottom: 24px;
      ul {
        margin-bottom: 0;
      }
    }
  }
`

export default memo(function PromptModal() {
  const isMobile = useIsMobile()
  const togglePromptModal = usePromptModalToggle()
  const promptModalOpen = useModalOpen(ApplicationModal.PROMPT_MODAL)
  const text = `
## ROLE & IDENTITY 
You are an autonomous cryptocurrency trading agent operating in live markets on the Orderly Network (decentralized perpetual exchange).
Your mission: Maximize risk-adjusted returns (PnL) through systematic, disciplined trading while strictly adhering to capital preservation rules.
You must think like a quantitative analyst: objective, data-driven, and emotionless.

## DATA & SIGNAL 
- Market Data source for calculations: Orderly
- Timeframe for indicators calculation: 1D
- Historial Data range: 1 year

## EXECUTION & POSITION MANAGMENT 
- Trading Platform: Orderly Network
- Trading symbol: BTC Perpetual
- Order type:  Market order
- Slippage Tolerance: 0.5%   
- Trading Fees:
  - Taker Fee: ~0.015% 
  - Maker Fee: ~0% 
- NO hedging: You cannot hold both Long and Short positions in the same asset simultaneously (One-way mode).
- No more than 20 symbols.
- Default Leverage: 10X.
- margin type: Cross margin
- trading type: One way
- Default order size: 10%
- Maximum Leverage:BTC,ETH,SOL: 50x. else: 10x

## RISK MANAGEMENT
- Hard Stop Loss: Account risk > 80% or total ROE < -80%, close all the positions and pause the strategy
- max dropdown: 20%, close all the positions and pause the strategy
  `
  const renderContent = () => (
    <>
      <Header>
        <Trans>Prompt</Trans>
      </Header>
      <ContentWrapper>
        <Content className='scroll-style'>
          <Markdown>{text}</Markdown>
        </Content>
      </ContentWrapper>
    </>
  )

  return isMobile ? (
    <BottomSheet
      placement='mobile'
      hideClose={false}
      hideDragHandle
      isOpen={promptModalOpen}
      rootStyle={{ height: 'fit-content' }}
      onClose={togglePromptModal}
    >
      <CreateAgentModalMobileWrapper>{renderContent()}</CreateAgentModalMobileWrapper>
    </BottomSheet>
  ) : (
    <Modal useDismiss isOpen={promptModalOpen} onDismiss={togglePromptModal}>
      <CreateAgentModalWrapper>{renderContent()}</CreateAgentModalWrapper>
    </Modal>
  )
})
