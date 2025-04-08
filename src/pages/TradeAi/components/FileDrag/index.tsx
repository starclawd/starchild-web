
import styled, { css } from 'styled-components'
import AiContent from '../AiContent'
import AiInput from '../AiInput'
import { memo, useCallback, useState } from 'react'
import { useFileList } from 'store/tradeai/hooks'
import { Trans } from '@lingui/react/macro'
// import { ResizeHandle } from 'pages/Trade/components/ResizeHandle'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
// import ConfirmModal from 'components/ConfirmModal'
import { TRADE_AI_TYPE } from 'store/tradeai/tradeai.d'

const FileDragWrapper = styled.div<{ $tradeAiTypeProp: TRADE_AI_TYPE }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  ${({ $tradeAiTypeProp }) =>
    $tradeAiTypeProp === TRADE_AI_TYPE.ORDER_TYPE &&
    css`
      padding-bottom: 8px;
      border-radius: 0 0 16px 16px;
    `
  }
  ${({ $tradeAiTypeProp }) =>
    $tradeAiTypeProp === TRADE_AI_TYPE.ORDER_TYPE &&
    css`
      overflow: hidden;
    `
  }
  ${({ theme }) =>
    theme.isMobile && css`
      height: calc(100% - 56px);
      padding-bottom: 12px;
    `
  }
`

const DropPrompt = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  text-align: center;
  padding: 0 20px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.bg11};
  z-index: 100;
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
  justify-content: center;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  cursor: pointer;
  color: ${({ theme }) => theme.text4};
  transition: all ${ANI_DURATION}s;
  .icon-arrow {
    transition: all ${ANI_DURATION}s;
    color: ${({ theme }) => theme.text3};
    font-size: 8px;
    margin-left: 4px;
  }
  &:hover {
    color: ${({ theme }) => theme.green};
    .icon-arrow {
      color: ${({ theme }) => theme.green};
    }
  }
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
    setIsDragging(true)
  }, [])
  const handleDragEnter = useCallback((e: any) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])
  const handleDragLeave = useCallback((e: any) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])
  const handleDrop = useCallback((e: any) => {
    e.preventDefault()
    setIsDragging(false)
    const files = [...e.dataTransfer.files]
    const validFiles = files.filter(
      (file) => file.type.startsWith('image/') && file.type !== 'image/gif'
    )
    if (validFiles.length !== files.length) {
      // promptInfo(PromptInfoType.ERROR, <Trans>GIF images are not allowed.</Trans>)
    }
    const list = [
      ...fileList,
      ...validFiles,
    ]
    setFileList(list)
  }, [fileList, setFileList])
  return <FileDragWrapper
    $tradeAiTypeProp={tradeAiTypeProp}
    className="file-drag-wrapper"
    onDragOver={handleDragOver}
    onDragEnter={handleDragEnter}
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
      <IconBase className="icon-arrow" />
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
