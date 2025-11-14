import { memo, useCallback, useState } from 'react'
import styled, { css } from 'styled-components'
import { IconBase } from 'components/Icons'
import { RefreshProps } from '../../types'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import Pending from 'components/Pending'

interface RefreshWrapperProps {
  $isDisabled?: boolean
}

const RefreshWrapper = styled.div<RefreshWrapperProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textL2};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  min-width: 32px;
  height: 32px;
  padding: 0 7px;
  border-radius: 44px;
  transition: all ${ANI_DURATION}s;

  i {
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }

  ${({ theme, $isDisabled }) =>
    theme.isMobile
      ? css`
          min-width: ${vm(32)};
          height: ${vm(32)};
          padding: 0 ${vm(7)};
          font-size: 0.14rem;
          line-height: 0.2rem;
          border-radius: ${vm(44)};
          i {
            font-size: 0.18rem;
          }
          &:active {
            background-color: ${!$isDisabled ? theme.bgT30 : 'transparent'};
          }
        `
      : css`
          cursor: ${$isDisabled ? 'not-allowed' : 'pointer'};
          &:hover {
            background-color: ${!$isDisabled ? theme.bgT30 : 'transparent'};
          }
        `}
`

const Refresh = memo(function Refresh({ isDisabled, onLoadingChange, onRefresh }: RefreshProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = useCallback(
    async (event: React.MouseEvent) => {
      event.stopPropagation()
      if (isLoading || isDisabled || !onRefresh) return

      setIsLoading(true)
      onLoadingChange?.(true)
      try {
        await onRefresh()
      } catch (error) {
        // 错误处理交由外部处理
      } finally {
        setIsLoading(false)
        onLoadingChange?.(false)
      }
    },
    [isLoading, isDisabled, onRefresh, onLoadingChange],
  )

  return (
    <RefreshWrapper $isDisabled={isDisabled || isLoading} onClick={handleRefresh}>
      {isLoading ? <Pending /> : <IconBase className='icon-chat-refresh' />}
    </RefreshWrapper>
  )
})

export default Refresh
