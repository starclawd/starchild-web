import styled, { css } from 'styled-components'
import ActionLayer from '../ActionLayer'
import { Trans } from '@lingui/react/macro'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useStrategyDetail } from 'store/createstrategy/hooks/useStrategyDetail'
import { GENERATION_STATUS, STRATEGY_STATUS } from 'store/createstrategy/createstrategy'
import { useGenerateStrategyCode, useStrategyCode } from 'store/createstrategy/hooks/useCode'
import useParsedQueryString from 'hooks/useParsedQueryString'
import ThinkingProgress from 'pages/Chat/components/ThinkingProgress'
import MemoizedHighlight from 'components/MemoizedHighlight'
import NoData from 'components/NoData'
import { IconBase } from 'components/Icons'
import { useStrategyInfoTabIndex } from 'store/createstrategy/hooks/useTabIndex'
import useCopyContent from 'hooks/useCopyContent'
import { extractExecutableCode } from 'utils/extractExecutableCode'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import { useDeployModalToggle } from 'store/application/hooks'
import ShinyButton from 'components/ShinyButton'

const CodeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px;
  color: ${({ theme }) => theme.green100};
  .icon-chat-complete {
    font-size: 24px;
    color: ${({ theme }) => theme.green100};
  }
`

const ActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  > span {
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.textL3};
  }
`

const ActionList = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
  .action-layer-wrapper:first-child {
    width: 428px;
    height: 100%;
  }
  .code-launch-button {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    .action-layer-wrapper {
      width: 100%;
      border: none;
    }
  }
`

const LoadingWrapper = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  padding: 16px;
`

const CodeContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 12px;
  background: ${({ theme }) => theme.black800};
`

const CodeTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 32px;
  padding: 0 16px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.bgT20};
  > span {
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px;
    color: ${({ theme }) => theme.textL4};
  }
`

const CopyWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.textL3};
  .icon-chat-copy {
    font-size: 18px;
    transition: all ${ANI_DURATION}s;
    color: ${({ theme }) => theme.textL3};
  }
  ${({ theme }) =>
    theme.isMobile
      ? css`
          gap: ${vm(4)};
          font-size: 0.14rem;
          line-height: 0.2rem;
          .icon-chat-copy {
            font-size: 0.18rem;
          }
        `
      : css`
          cursor: pointer;
          &:hover {
            color: ${({ theme }) => theme.textL1};
            .icon-chat-copy {
              color: ${({ theme }) => theme.textL1};
            }
          }
        `}
`

export default memo(function Code() {
  const { strategyId } = useParsedQueryString()
  const [, setStrategyInfoTabIndex] = useStrategyInfoTabIndex()
  const { strategyCode, refetch: refetchStrategyCode } = useStrategyCode({ strategyId: strategyId || '' })
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)
  const toggleDeployModal = useDeployModalToggle()
  const { strategyDetail } = useStrategyDetail({ strategyId: strategyId || '' })
  const { external_code, generation_status } = strategyCode || { external_code: '', generation_status: null }
  const { copyWithCustomProcessor } = useCopyContent({
    mode: 'custom',
    customProcessor: extractExecutableCode,
  })
  const triggerGenerateStrategyCode = useGenerateStrategyCode()
  const isCreateSuccess = useMemo(() => {
    return !!strategyDetail?.strategy_config
  }, [strategyDetail])
  const handleGenerateCode = useCallback(async () => {
    try {
      if (!isCreateSuccess || isGeneratingCode) return
      setIsGeneratingCode(true)
      const data = await triggerGenerateStrategyCode(strategyId || '')
      if (data?.data?.status === 'success') {
        await refetchStrategyCode()
      }
      setIsGeneratingCode(false)
    } catch (error) {
      console.error('handleGenerateCode error', error)
      setIsGeneratingCode(false)
    }
  }, [strategyId, triggerGenerateStrategyCode, refetchStrategyCode, isCreateSuccess, isGeneratingCode])

  const goPaperTradingTab = useCallback(() => {
    setStrategyInfoTabIndex(3)
  }, [setStrategyInfoTabIndex])
  const depoloy = useCallback(() => {
    toggleDeployModal()
  }, [toggleDeployModal])
  const handleCopyCode = useCallback(() => {
    if (external_code) {
      copyWithCustomProcessor(external_code)
    }
  }, [external_code, copyWithCustomProcessor])

  // 当 generation_status 不是 COMPLETED 时，每5秒轮询一次
  useEffect(() => {
    if (generation_status === GENERATION_STATUS.GENERATING) {
      const intervalId = setInterval(() => {
        refetchStrategyCode()
      }, 5000)

      return () => {
        clearInterval(intervalId)
      }
    }
  }, [generation_status, refetchStrategyCode])

  return (
    <CodeWrapper>
      {generation_status === GENERATION_STATUS.COMPLETED && (
        <>
          <Title>
            <IconBase className='icon-chat-complete' />
            <Trans>Your intuition has been translated into code. The matrix is ready. </Trans>
          </Title>
          <ActionWrapper>
            <span>
              <Trans>How do you want to test your Alpha?</Trans>
            </span>
            <ActionList>
              <ActionLayer
                showRightArrow
                iconCls='icon-paper-trading'
                title={<Trans>Run Paper Trading</Trans>}
                description={<Trans>Simulation in real-time with virtual funds.</Trans>}
                clickCallback={goPaperTradingTab}
              />
              <ShinyButton className='code-launch-button'>
                <ActionLayer
                  showRightArrow
                  iconCls='icon-deploy'
                  title={<Trans>Launch</Trans>}
                  description={
                    <Trans>
                      Launch the live Strategy and create a Mirror Vault. Retail users can deposit into your Vault, and
                      you earn performance fees.
                    </Trans>
                  }
                  clickCallback={depoloy}
                />
              </ShinyButton>
            </ActionList>
          </ActionWrapper>
        </>
      )}
      {isGeneratingCode || generation_status === GENERATION_STATUS.GENERATING ? (
        <LoadingWrapper>
          <ThinkingProgress loadingText={<Trans>Generating Code...</Trans>} intervalDuration={120000} />
        </LoadingWrapper>
      ) : (
        external_code && (
          <CodeContentWrapper>
            <CodeTop>
              <span>
                <Trans>The code is generated by AI, executed inside a container.</Trans>
              </span>
              <CopyWrapper onClick={handleCopyCode}>
                <IconBase className='icon-chat-copy' />
                <Trans>Copy</Trans>
              </CopyWrapper>
            </CodeTop>
            <MemoizedHighlight className='python'>{external_code}</MemoizedHighlight>
          </CodeContentWrapper>
        )
      )}
      {!isGeneratingCode && generation_status !== GENERATION_STATUS.GENERATING && (
        <ActionLayer
          iconCls='icon-view-code'
          title={<Trans>Generate Code</Trans>}
          description={
            isCreateSuccess ? (
              <Trans>
                Click [Generate Code] to let the Agent write the script and transform your text strategy into executable
                logic. Once generated, you can Simulation with virtual funds or deploy with real funds.
              </Trans>
            ) : (
              <Trans>Strategy Not Defined. Please describe and confirm your strategy logic first.</Trans>
            )
          }
          rightText={<Trans>Generate code</Trans>}
          rightButtonClickCallback={handleGenerateCode}
          rightButtonDisabled={!isCreateSuccess}
        />
      )}
    </CodeWrapper>
  )
})
