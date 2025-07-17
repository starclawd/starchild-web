import { memo, useCallback, useState, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { AgentCategory } from 'store/agenthub/agenthub'
import { BaseButton } from 'components/Button'
import { Trans } from '@lingui/react/macro'
import { t } from '@lingui/core/macro'
import { vm } from 'pages/helper'

interface ButtonGroupProps {
  items: ButtonGroupItemProps[]
  onItemClick: (value: string) => void
  showAll?: boolean
}

interface ButtonGroupItemProps {
  id: string
  label: string
  value: string
}

const ButtonGroupContainer = styled.div`
  flex-wrap: wrap;
  display: flex;
  gap: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex-wrap: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;
      gap: ${vm(6)};

      &::-webkit-scrollbar {
        display: none;
      }
    `}
`

const GroupButton = styled(BaseButton)<{ $active: boolean }>`
  width: fit-content;
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  background: ${({ theme, $active }) => ($active ? theme.bgT30 : theme.bgT10)};
  color: ${({ theme, $active }) => ($active ? theme.textL1 : theme.textL3)};
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.textL1};
    background: ${({ theme }) => theme.bgT30};
    opacity: ${({ $active }) => ($active ? 1 : 0.6)};
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(5)} ${vm(8)};
    `}
`

export default memo(function ButtonGroup({ items, onItemClick: onButtonClick, showAll = false }: ButtonGroupProps) {
  const processedItems = useMemo(() => {
    if (!showAll) return items

    const allItem: ButtonGroupItemProps = {
      id: 'item_all',
      label: t`All`,
      value: '',
    }

    return [allItem, ...items]
  }, [items, showAll])

  const [activeButton, setActiveButton] = useState(processedItems[0]?.id || '')

  const handleButtonClick = useCallback(
    (item: ButtonGroupItemProps) => {
      setActiveButton(item.id)
      onButtonClick(item.value)
    },
    [onButtonClick],
  )

  return (
    <ButtonGroupContainer>
      {processedItems.map((item) => (
        <GroupButton key={item.id} $active={activeButton === item.id} onClick={() => handleButtonClick(item)}>
          {item.label}
        </GroupButton>
      ))}
    </ButtonGroupContainer>
  )
})
