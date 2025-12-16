import Divider from 'components/Divider'
import { memo } from 'react'
import styled from 'styled-components'
import { useTheme } from 'store/themecache/hooks'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { useIsShowWorkflow } from 'store/createstrategy/hooks/useBacktest'

const ShowWorkflowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: -20px;
  padding-bottom: 40px;
`

const OperatorContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  height: 44px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  transition: all ${ANI_DURATION}s;
  cursor: pointer;
  .icon-chat-back {
    transform: rotate(180deg);
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }
  &:hover {
    opacity: 0.7;
  }
`

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.textL1};
  .icon-workflow {
    font-size: 18px;
    color: ${({ theme }) => theme.textL1};
  }
`

export default memo(function ShowWorkflow() {
  const theme = useTheme()
  const [isShowWorkflow, setIsShowWorkflow] = useIsShowWorkflow()
  return (
    <ShowWorkflowWrapper>
      <Divider height={1} paddingVertical={0} color={theme.lineDark8} />
      <OperatorContent onClick={() => setIsShowWorkflow(!isShowWorkflow)}>
        <Left>
          <IconBase className='icon-workflow' />
          <span>
            <Trans>Workflow</Trans>
          </span>
        </Left>
        <IconBase className='icon-chat-back' />
      </OperatorContent>
    </ShowWorkflowWrapper>
  )
})
