import styled, { css } from 'styled-components'
import { memo, useMemo } from 'react'
import { useChatTabIndex, useIsAiContentEmpty } from 'store/chat/hooks'
import { vm } from 'pages/helper'
import { useIsMobile } from 'store/application/hooks'
import { Trans } from '@lingui/react/macro'
import Recommendations from './components/Recommendations'
import CreateStrategy from './components/CreateStrategy'
import Research from './components/Research'

const AiInputWrapper = styled.div<{ $isFromMyAgent: boolean; $isEmpty: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 12px;
  gap: 20px;
  ${({ theme, $isEmpty }) =>
    theme.isMobile
      ? css`
          gap: ${vm(20)};
          padding: 0;
        `
      : css`
          ${$isEmpty &&
          css`
            min-height: 222px;
          `}
        `}
  ${({ $isFromMyAgent }) =>
    $isFromMyAgent &&
    css`
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
    `}
  ${({ $isEmpty, theme }) =>
    $isEmpty &&
    theme.isMobile &&
    css`
      height: calc(100% - ${vm(44)});
      justify-content: space-between;
    `}
`

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'PowerGrotesk';
  font-size: 84px;
  font-style: normal;
  font-weight: 200;
  line-height: 1;
  text-transform: uppercase;
  color: ${({ theme }) => theme.white};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(42)};
    `}
`

const AiInputInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: 0 ${vm(12)};
    `}
`

export default memo(function AiInput({ isFromMyAgent = false }: { isFromMyAgent?: boolean }) {
  const isMobile = useIsMobile()
  const [chatTabIndex] = useChatTabIndex()
  const isEmpty = useIsAiContentEmpty()
  const showCreateStrategy = useMemo(() => {
    return chatTabIndex === 1 && isEmpty
  }, [chatTabIndex, isEmpty])

  return (
    <AiInputWrapper
      $isEmpty={isEmpty}
      $isFromMyAgent={isFromMyAgent}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      {isEmpty && !isFromMyAgent && (
        <AiInputInnerWrapper>
          {isEmpty && (
            <>
              <LogoWrapper>
                <Trans>starchild</Trans>
              </LogoWrapper>
            </>
          )}
        </AiInputInnerWrapper>
      )}
      {showCreateStrategy && !isMobile ? <CreateStrategy /> : <Research />}
    </AiInputWrapper>
  )
})
