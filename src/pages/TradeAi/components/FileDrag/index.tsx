import styled, { css } from 'styled-components'
import AiContent from '../AiContent'
import AiInput from '../AiInput'
import { TRADE_AI_TYPE } from 'store/tradeai/tradeai.d'
import { memo, useCallback, useState } from 'react'
import { useFileList } from 'store/tradeai/hooks'
import { Trans } from '@lingui/react/macro'
// import { ResizeHandle } from 'pages/Trade/components/ResizeHandle'
// import ConfirmModal from 'components/ConfirmModal'

const FileDragWrapper = styled.div<{ $tradeAiTypeProp: TRADE_AI_TYPE }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  ${({ $tradeAiTypeProp }) =>
    $tradeAiTypeProp === TRADE_AI_TYPE.ORDER_TYPE &&
    css`
      padding: 0 12px;
      height: 100%;
    `
  }
  ${({ $tradeAiTypeProp }) =>
    $tradeAiTypeProp === TRADE_AI_TYPE.ORDER_TYPE &&
    css`
      gap: 10px;
    `
  }
`

const DropPrompt = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: 2;
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.depthGreen};
`

const ResizeContent = styled.div`
  .react-resizable-handle {
    right: 4px;
    bottom: 0;
    cursor: se-resize;
    background-image: unset;
    visibility: hidden;
    padding: 0;
    z-index: 1001;
  }
  &:hover {
    .react-resizable-handle {
      visibility: visible;
    }
  }
`

const DisclaimerOperator = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 10px 0;
  margin-top: auto;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: ${({ theme }) => theme.text4};
`

export default memo(function FileDrag({
  tradeAiTypeProp,
}: {
  tradeAiTypeProp: TRADE_AI_TYPE
}) {
  const [fileList, setFileList] = useFileList()
  const [isDragging, setIsDragging] = useState(false)
  
  const handleDragOver = useCallback((e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])
  const handleDragLeave = useCallback((e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])
  const handleDrop = useCallback((e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const files = [];
    for (let i = 0; i < e.dataTransfer.files.length; i++) {
      const file = e.dataTransfer.files[i];
      if (file.type.startsWith('image/') && file.type !== 'image/gif') {
        files.push(file);
      }
    }
    const list = [
      ...fileList,
      ...files,
    ]
    setFileList(list)
  }, [fileList, setFileList])
  return <FileDragWrapper
    $tradeAiTypeProp={tradeAiTypeProp}
    className="file-drag-wrapper"
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
  >
    {isDragging && <DropPrompt>
      <Trans>Drop img here to add it to the conversation</Trans>
    </DropPrompt>}
    <AiContent tradeAiTypeProp={tradeAiTypeProp} />
    <AiInput tradeAiTypeProp={tradeAiTypeProp} />
    <DisclaimerOperator>
      <span><Trans>Not investment advice. Please DYOR</Trans></span>
    </DisclaimerOperator>
    {/* {confirmModalOpen && <ConfirmModal
        useDismiss
        title={<Trans>Disclaimer</Trans>}
        confirmType={ApplicationModal.DISCLAIMER}
        content={<DisclaimerContent className="scroll-style">
          <span><Trans>1. Not Investment AdviceAll information, analysis, suggestions, and forecasts provided by this tradeAI are for reference purposes only and do not constitute any form of investment advice. Users should make independent investment decisions based on their financial situation, risk tolerance, and the advice of professional investment advisors. The assistant and its developers are not liable for any direct or indirect losses incurred from trading based on the information provided.</Trans></span>
          <span><Trans>2. Market Risk WarningCryptocurrency trading involves high risks. Market prices may fluctuate dramatically, leading to significant increases or decreases in investment value. Users should fully understand and assume the risks associated with cryptocurrency trading and carefully assess their investment capabilities.</Trans></span>
          <span><Trans>3. Accuracy and Timeliness of DataThis tradeAI&apos;s analysis is based on publicly available data and algorithmic processing, aiming to ensure the information provided is accurate and reliable. However, due to technical limitations or issues with data sources, the information may be delayed, incomplete, or incorrect. Users should verify the authenticity and validity of the information themselves.</Trans></span>
          <span><Trans>4. Scope of ResponsibilityThis tradeAI is designed to assist users in accessing market information and analysis support but cannot guarantee the success or profitability of any trading results. Users are fully responsible for their trading actions and outcomes.</Trans></span>
          <span><Trans>5. Scope of UseThis tradeAI is intended to be used as a technical tool and does not provide legal, tax, or compliance consulting services. Users must ensure their actions comply with the laws and regulations of their respective countries or regions when using this assistant.</Trans></span>
        </DisclaimerContent>}
      />} */}
  </FileDragWrapper>
})
