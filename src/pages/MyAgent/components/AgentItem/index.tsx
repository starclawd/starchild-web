import styled, { css } from 'styled-components'
import { TaskDataType } from 'store/setting/setting.d'
import { useCallback, useState, useRef, useEffect, useMemo } from 'react'
import { Trans } from '@lingui/react/macro'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { useTheme } from 'store/themecache/hooks'
import { vm } from 'pages/helper'
import TaskOperator from '../TaskOperator'
import { IconBase } from 'components/Icons'
import { useIsShowTaskDetails } from 'store/tradeai/hooks'
import { useCurrentTaskData } from 'store/setting/hooks'

const AgentItemWrapper = styled(BorderAllSide1PxBox)<{
  $isChatPage?: boolean
  $scrollHeight?: number
  $minUi?: boolean
  $isTaskDetail?: boolean
  $isHeaderMenu?: boolean
}>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.bgL1};
  &:hover {
    .top-right {
      opacity: 1;
    }
  }
  ${({ $isChatPage, theme, $minUi }) =>
    $isChatPage &&
    css`
      background-color: ${theme.bgL0};
      .top-right {
        opacity: 1;
      }
      overflow: hidden;
      min-height: 56px;
      ${theme.isMobile &&
      css`
        margin-bottom: ${vm(4)};
        min-height: ${vm(56)};
        gap: ${vm(12)};
        padding: ${vm(20)};
      `}
      ${$minUi &&
      css`
        padding: 16px;
        background-color: ${theme.bgL1};
        ${theme.isMobile &&
        css`
          padding: ${vm(16)};
        `}
      `}
    `}
  ${({ $isChatPage, $minUi, theme }) =>
    $isChatPage &&
    $minUi &&
    !theme.isMobile &&
    css`
      cursor: pointer;
    `}
  ${({ $isTaskDetail, theme }) =>
    $isTaskDetail &&
    css`
      gap: 20px;
      padding: 0;
      background-color: transparent;
      ${theme.isMobile &&
      css`
        gap: ${vm(20)};
      `}
    `}
  ${({ $isHeaderMenu, theme }) =>
    $isHeaderMenu &&
    css`
      gap: 8px;
      justify-content: flex-start;
      height: 135px;
      padding: 4px 12px;
      border-radius: 12px;
      background-color: ${theme.bgT10};
      .top-right {
        opacity: 1;
      }
    `}
`

const ItemTop = styled.div<{ $isHeaderMenu?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  ${({ $isHeaderMenu }) =>
    $isHeaderMenu &&
    css`
      height: 24px;
    `}
`

const ItemBottom = styled.div<{ $isTaskDetail?: boolean; $isHeaderMenu?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  > span:first-child {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.textL1};
  }
  > span:nth-child(2) {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL3};
  }
  > span:last-child {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL3};
    span {
      color: ${({ theme }) => theme.textL1};
    }
    ${({ $isTaskDetail }) =>
      $isTaskDetail &&
      css`
        margin-top: 18px;
      `}
  }
  ${({ theme, $isTaskDetail }) =>
    theme.isMobile &&
    css`
      gap: ${vm(2)};
      > span:first-child {
        font-size: 0.16rem;
        line-height: 0.24rem;
      }
      > span:nth-child(2) {
        font-size: 0.12rem;
        line-height: 0.18rem;
      }
      > span:last-child {
        font-size: 0.12rem;
        line-height: 0.18rem;
        ${$isTaskDetail &&
        css`
          margin-top: ${vm(18)};
        `}
      }
    `}
  ${({ $isHeaderMenu }) =>
    $isHeaderMenu &&
    css`
      gap: 8px;
      > span:first-child {
        font-size: 13px;
        font-weight: 500;
        line-height: 20px;
      }
      > span:nth-child(2) {
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      > span:last-child {
        font-size: 11px;
        font-weight: 400;
        line-height: 16px;
      }
    `}
`

const TopLeft = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  > span:first-child {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 4px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: transparent;
    span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: ${({ theme, $isActive }) => ($isActive ? theme.jade10 : theme.textL4)};
      ${({ theme, $isActive }) =>
        $isActive &&
        `
        box-shadow: 0px 0px 8px ${theme.jade10};
        animation: breathe 5s infinite ease-in-out;
        @keyframes breathe {
          0% {
            box-shadow: 0px 0px 4px ${theme.jade10};
          }
          50% {
            box-shadow: 0px 0px 15px ${theme.jade10};
          }
          100% {
            box-shadow: 0px 0px 4px ${theme.jade10};
          }
        }
      `}
    }
  }
  > span:nth-child(2) {
    margin-right: 12px;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme, $isActive }) => ($isActive ? theme.jade10 : theme.textL4)};
  }
  > span:nth-child(3) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: 18px;
    padding: 0 6px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 500;
    line-height: 14px;
    color: ${({ theme }) => theme.textL2};
    background-color: ${({ theme }) => theme.text20};
  }
  > span:nth-child(4) {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    margin-left: 12px;
    color: ${({ theme }) => theme.textL1};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      > span:first-child {
        width: ${vm(14)};
        height: ${vm(14)};
        margin-right: ${vm(4)};
        span {
          width: ${vm(6)};
          height: ${vm(6)};
        }
      }
      > span:nth-child(2) {
        margin-right: ${vm(12)};
        font-size: 0.12rem;
        line-height: 0.18rem;
      }
      > span:nth-child(3) {
        height: ${vm(18)};
        padding: 0 ${vm(6)};
        border-radius: ${vm(4)};
        font-size: 0.1rem;
        line-height: 0.14rem;
      }
      > span:nth-child(4) {
        font-size: 0.16rem;
        line-height: 0.24rem;
        margin-left: ${vm(12)};
      }
    `}
`

const TaskDetails = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.textL3};
  .icon-chat-expand {
    font-size: 18px;
    color: ${({ theme }) => theme.textL3};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
      font-size: 0.12rem;
      line-height: 0.18rem;
      .icon-chat-expand {
        font-size: 0.18rem;
      }
    `}
`

export default function AgentItem({
  data,
  isHeaderMenu,
  isChatPage,
  scrollHeight,
  isTaskDetail,
}: {
  data: TaskDataType
  isChatPage?: boolean
  scrollHeight?: number
  isTaskDetail?: boolean
  isHeaderMenu?: boolean
}) {
  const { id, isActive, title, description, time } = data
  const theme = useTheme()
  const taskItemRef = useRef<HTMLDivElement>(null)
  const [initialHeight, setInitialHeight] = useState<number>(0)
  const [isShowTaskDetails, setIsShowTaskDetails] = useIsShowTaskDetails()
  const [, setCurrentTaskData] = useCurrentTaskData()

  // 获取初始高度
  useEffect(() => {
    if (taskItemRef.current && isChatPage && initialHeight === 0) {
      const height = taskItemRef.current.offsetHeight
      setInitialHeight(height)
    }
  }, [isChatPage, initialHeight])

  // 计算当前高度
  const calculateHeight = useCallback(() => {
    if (!isChatPage || !initialHeight) return undefined

    const scrollDistance = scrollHeight || 0
    const minHeight = 10

    // 根据滚动距离减少高度，但不低于min-height
    // 这里使用一个缩放因子，可以根据需要调整
    const scaleFactor = 0.5 // 滚动1px，高度减少0.5px
    const calculatedHeight = initialHeight - scrollDistance * scaleFactor

    return Math.max(calculatedHeight, minHeight)
  }, [isChatPage, initialHeight, scrollHeight])

  const dynamicHeight = calculateHeight()

  const minUi = useMemo(() => {
    return !!(dynamicHeight && dynamicHeight < 60)
  }, [dynamicHeight])

  const showTaskDetails = useCallback(() => {
    if (isChatPage && minUi) {
      setCurrentTaskData(data)
      setIsShowTaskDetails(!isShowTaskDetails)
    }
  }, [isChatPage, minUi, isShowTaskDetails, setIsShowTaskDetails, data, setCurrentTaskData])

  return (
    <AgentItemWrapper
      key={id}
      className='task-item-wrapper'
      $isChatPage={isChatPage}
      $borderColor={isChatPage ? theme.bgT30 : 'transparent'}
      $borderRadius={minUi ? 24 : isChatPage ? 16 : 36}
      $scrollHeight={scrollHeight}
      ref={taskItemRef}
      $minUi={minUi}
      $isHeaderMenu={isHeaderMenu}
      $isTaskDetail={isTaskDetail}
      style={dynamicHeight ? { height: `${dynamicHeight}px` } : undefined}
      onClick={showTaskDetails}
    >
      <ItemTop $isHeaderMenu={isHeaderMenu}>
        <TopLeft $isActive={isActive}>
          <span>
            <span></span>
          </span>
          <span>
            <Trans>Active</Trans>
          </span>
          <span>
            <Trans>Task</Trans>
          </span>
          {minUi && (
            <span>
              <Trans>{title}</Trans>
            </span>
          )}
        </TopLeft>
        {!isTaskDetail &&
          (isChatPage && minUi ? (
            <TaskDetails>
              <span>
                <Trans>Task Details</Trans>
              </span>
              <IconBase className='icon-chat-expand' />
            </TaskDetails>
          ) : (
            <TaskOperator data={data} operatorType={isChatPage || isHeaderMenu ? 1 : 0} />
          ))}
      </ItemTop>
      <ItemBottom $isHeaderMenu={isHeaderMenu} $isTaskDetail={isTaskDetail}>
        <span>{title}</span>
        <span>{description}</span>
        <span>
          <Trans>Execution time</Trans>:&nbsp;<span>{time}</span>
        </span>
      </ItemBottom>
    </AgentItemWrapper>
  )
}
