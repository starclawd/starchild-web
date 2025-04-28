import { t } from '@lingui/core/macro'
import { vm } from 'pages/helper'
import { useCallback } from 'react'
import { useSendAiContent } from 'store/tradeai/hooks'
import styled, { css } from 'styled-components'

const ShortcutsListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  width: 100%;
  gap: 12px;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(10)};
    padding-bottom: ${vm(24)};
  `}
`

const ShortcutsItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
  `}
`

const ShortcutsItemItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 36px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  padding: 8px 12px;
  border-radius: 12px;
  color: ${({ theme }) => theme.textL2};
  background: ${({ theme }) => theme.bgT20};
  ${({ theme }) => theme.isMobile && css`
    height: ${vm(36)};
    padding: ${vm(8)} ${vm(12)};
    border-radius: ${vm(12)};
    font-size: .14rem;
    font-weight: 400;
    line-height: .2rem;
    color: ${theme.textL1};
    background: ${theme.brand6};
  `}
`

export default function ShortcutsList() {
  const sendAiContent = useSendAiContent()
  const shortcutsList = [
    {
      key: '1',
      list: [
        {
          key: 'What security incidents have happened recently in crypto?',
          text: t`What security incidents have happened recently in crypto?`,
        },
        {
          key: 'Which sectors are outperforming in the crypto market?',
          text: t`Which sectors are outperforming in the crypto market?`,
        },
      ]
    },
    {
      key: '2',
      list: [
        {
          key: 'What s the correlation between crypto and traditional markets?',
          text: t`What's the correlation between crypto and traditional markets?`,
        },
        {
          key: 'What security incidents have happened recently in crypto?',
          text: t`What security incidents have happened recently in crypto?`,
        },
      ]
    },
    {
      key: '3',
      list: [
        {
          key: 'What are the biggest whales buying or selling?',
          text: t`What are the biggest whales buying or selling?`,
        },
        {
          key: 'What s the latest news about Bitcoin ETFs?',
          text: t`What's the latest news about Bitcoin ETFs?`,
        },
        {
          key: 'How is AI being integrated with blockchain technology?',
          text: t`How is AI being integrated with blockchain technology?`,
        },
      ]
    },
  ]
  const sendContent = useCallback((text: string) => {
    sendAiContent({
      value: text,
    })
  }, [sendAiContent])
  return <ShortcutsListWrapper>
    {
      shortcutsList.map((item) => (
        <ShortcutsItem key={item.key}>
          {item.list.map((item) => (
            <ShortcutsItemItem key={item.key} onClick={() => sendContent(item.text)}>
              {item.text}
            </ShortcutsItemItem>
          ))}
        </ShortcutsItem>
      ))
    }
  </ShortcutsListWrapper>
}
