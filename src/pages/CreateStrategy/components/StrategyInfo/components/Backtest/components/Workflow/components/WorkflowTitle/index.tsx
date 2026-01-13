import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { memo } from 'react'
import { useIsShowWorkflow } from 'store/createstrategy/hooks/useBacktest'
import styled, { css } from 'styled-components'

const WorkflowTitleWrapper = styled.div<{ $isShowWorkflow: boolean; $isLoading?: boolean }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 6px;
  width: fit-content;
  height: 36px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black100};
  transition: all ${ANI_DURATION}s;
  cursor: pointer;
  span:first-child {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: ${({ theme }) => theme.black200};
    border-radius: 4px;
    background: ${({ theme }) => theme.black800};
    .icon-arrow-bar {
      font-size: 18px;
      color: ${({ theme }) => theme.black200};
    }
  }
  &:hover {
    opacity: 0.7;
  }
  ${({ $isShowWorkflow, $isLoading }) =>
    !$isShowWorkflow &&
    !$isLoading &&
    css`
      margin-left: 12px;
      span:first-child {
        .icon-arrow-bar {
          transform: rotate(180deg);
        }
      }
    `}
`

export default memo(function WorkflowTitle({ isLoading }: { isLoading?: boolean }) {
  const [isShowWorkflow, setIsShowWorkflow] = useIsShowWorkflow()
  return (
    <WorkflowTitleWrapper
      $isLoading={isLoading}
      $isShowWorkflow={isShowWorkflow}
      onClick={() => setIsShowWorkflow(!isShowWorkflow)}
    >
      <span>
        <IconBase className='icon-arrow-bar' />
      </span>
      <span>
        <Trans>Workflow</Trans>
      </span>
    </WorkflowTitleWrapper>
  )
})
