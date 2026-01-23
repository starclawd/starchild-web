import { memo, useCallback, useState, useMemo, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'
import { AgentCategory } from 'store/agenthub/agenthub'
import { BaseButton } from 'components/Button'
import { Trans, useLingui } from '@lingui/react/macro'
import { msg, t } from '@lingui/core/macro'
import { vm } from 'pages/helper'
import { ANI_DURATION } from 'constants/index'

interface ButtonGroupProps {
  items: ButtonGroupItemProps[]
  onItemClick: (value: string) => void
  showAll?: boolean
  value?: string // 添加 value 属性用于设置初始值
}

interface ButtonGroupItemProps {
  id: string
  label: string
  value: string
}

const ButtonGroupBgWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;

  /* 固定在右侧的渐变效果 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 20px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${({ theme }) => theme.black900} 50%,
      ${({ theme }) => theme.black900} 100%
    );
    pointer-events: none;
    z-index: 10;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      &::after {
        width: ${vm(20)};
      }
    `}
`

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
      padding-right: ${vm(20)};

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
  background: ${({ theme, $active }) => ($active ? theme.black600 : theme.black900)};
  color: ${({ theme, $active }) => ($active ? theme.black0 : theme.black200)};
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all ${ANI_DURATION}s ease;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.black0};
    background: ${({ theme }) => theme.black600};
    opacity: ${({ $active }) => ($active ? 1 : 0.6)};
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(5)} ${vm(8)};
      font-size: 0.12rem;
      line-height: 0.18rem;
    `}
`

export default memo(function ButtonGroup({
  items,
  onItemClick: onButtonClick,
  showAll = false,
  value,
}: ButtonGroupProps) {
  const { t } = useLingui()
  const processedItems = useMemo(() => {
    if (!showAll) return items

    const allItem: ButtonGroupItemProps = {
      id: 'item_all',
      label: t(msg`All`),
      value: '',
    }

    return [allItem, ...items]
  }, [items, showAll, t])

  // 根据传入的 value 找到对应的 item id，如果没有找到则使用第一个
  const getInitialActiveButton = useCallback(() => {
    if (value !== undefined) {
      const targetItem = processedItems.find((item) => item.value === value)
      return targetItem?.id || processedItems[0]?.id || ''
    }
    return processedItems[0]?.id || ''
  }, [value, processedItems])

  const [activeButton, setActiveButton] = useState(getInitialActiveButton)
  const buttonRefs = useRef<Record<string, HTMLElement | null>>({})

  // 滚动到指定按钮使其可见
  const scrollToButton = useCallback((buttonId: string) => {
    const buttonElement = buttonRefs.current[buttonId]
    if (!buttonElement) return

    // 获取按钮的父容器（用于水平滚动）
    const container = buttonElement.closest('[data-scroll-container="true"]') as HTMLElement
    if (!container) return

    // 计算按钮相对于容器的位置
    const buttonRect = buttonElement.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()

    // 计算需要滚动的距离
    const scrollLeft = container.scrollLeft
    const buttonLeft = buttonRect.left - containerRect.left + scrollLeft
    const buttonWidth = buttonRect.width
    const containerWidth = containerRect.width

    // 计算目标滚动位置，使按钮完全可见
    let targetScrollLeft = scrollLeft

    if (buttonLeft < scrollLeft) {
      // 按钮在左侧不可见，需要向左滚动
      targetScrollLeft = buttonLeft - 16 // 16px 边距
    } else if (buttonLeft + buttonWidth > scrollLeft + containerWidth) {
      // 按钮在右侧不可见，需要向右滚动
      targetScrollLeft = buttonLeft + buttonWidth - containerWidth + 16 // 16px 边距
    }

    // 执行平滑滚动
    container.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: 'smooth',
    })
  }, [])

  // 当外部 value 改变时，更新内部状态
  useEffect(() => {
    if (value === undefined) return

    const newActiveButton = getInitialActiveButton()
    if (newActiveButton !== activeButton) {
      setActiveButton(newActiveButton)
      scrollToButton(newActiveButton)
    }
  }, [getInitialActiveButton, activeButton, value, scrollToButton])

  const handleButtonClick = useCallback(
    (item: ButtonGroupItemProps) => {
      setActiveButton(item.id)
      scrollToButton(item.id)
      onButtonClick(item.value)
    },
    [onButtonClick, scrollToButton],
  )

  return (
    <ButtonGroupBgWrapper>
      <ButtonGroupContainer data-scroll-container='true'>
        {processedItems.map((item) => (
          <GroupButton
            key={item.id}
            ref={(el) => {
              buttonRefs.current[item.id] = el
            }}
            $active={activeButton === item.id}
            onClick={() => handleButtonClick(item)}
          >
            {item.label}
          </GroupButton>
        ))}
      </ButtonGroupContainer>
    </ButtonGroupBgWrapper>
  )
})
