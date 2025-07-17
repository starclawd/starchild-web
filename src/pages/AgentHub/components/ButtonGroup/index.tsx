import { memo, useCallback, useState } from 'react'
import styled, { css } from 'styled-components'
import { AgentCategory } from 'store/agenthub/agenthub'
import { BaseButton } from 'components/Button'
import { Trans } from '@lingui/react/macro'

interface ButtonGroupProps {
  items: ButtonGroupItemProps[]
  onItemClick: (value: string) => void
}

interface ButtonGroupItemProps {
  id: string
  label: string
  value: string
}

const ButtonGroupContainer = styled.div`
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

      &::-webkit-scrollbar {
        display: none;
      }
    `}

  ${({ theme }) =>
    !theme.isMobile &&
    css`
      flex-wrap: wrap;
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
`

export default memo(function ButtonGroup({ items, onItemClick: onButtonClick }: ButtonGroupProps) {
  const [activeButton, setActiveButton] = useState(items[0]?.value || '')

  const handleButtonClick = useCallback(
    (item: ButtonGroupItemProps) => {
      setActiveButton(item.id)
      onButtonClick(item.value)
    },
    [onButtonClick],
  )

  return (
    <ButtonGroupContainer>
      {items.map((item) => (
        <GroupButton key={item.id} $active={activeButton === item.id} onClick={() => handleButtonClick(item)}>
          {item.label}
        </GroupButton>
      ))}
    </ButtonGroupContainer>
  )
})
