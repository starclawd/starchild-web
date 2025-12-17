import { ButtonCommon } from 'components/Button'
import { IconBase } from 'components/Icons'
import Pending from 'components/Pending'
import { ANI_DURATION } from 'constants/index'
import { memo, MouseEventHandler } from 'react'
import styled, { css } from 'styled-components'

const ActionLayerWrapper = styled.div<{ $showRightArrow?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: fit-content;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  transition: all ${ANI_DURATION}s;
  i {
    font-size: 24px;
    color: ${({ theme }) => theme.textL2};
  }
  .icon-chat-arrow-long {
    font-size: 18px;
    color: ${({ theme }) => theme.textL4};
    position: absolute;
    right: 8px;
    top: 8px;
  }
  ${({ $showRightArrow }) =>
    $showRightArrow &&
    css`
      cursor: pointer;
      &:hover {
        opacity: 0.7;
      }
    `}
`

const CenterContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  gap: 4px;
`

const CenterTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.textL1};
`

const CenterBottom = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  text-align: left;
  color: ${({ theme }) => theme.textL3};
`

const RightButton = styled(ButtonCommon)<{ $disabled?: boolean }>`
  width: fit-content;
  min-width: 120px;
  height: 36px;
  padding: 0 16px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  white-space: nowrap;
  color: ${({ theme }) => theme.textL1};
  ${({ $disabled }) =>
    $disabled &&
    css`
      background-color: ${({ theme }) => theme.text20};
    `}
`

export default memo(function ActionLayer({
  iconCls,
  title,
  description,
  rightText,
  rightButtonDisabled,
  showRightArrow,
  isRightButtonLoading,
  clickCallback,
  rightButtonClickCallback,
}: {
  iconCls: string
  title: React.ReactNode
  description: React.ReactNode
  rightText?: React.ReactNode
  rightButtonDisabled?: boolean
  showRightArrow?: boolean
  isRightButtonLoading?: boolean
  clickCallback?: MouseEventHandler<HTMLDivElement>
  rightButtonClickCallback?: MouseEventHandler<HTMLSpanElement>
}) {
  return (
    <ActionLayerWrapper $showRightArrow={showRightArrow} className='action-layer-wrapper' onClick={clickCallback}>
      <IconBase className={iconCls} />
      {showRightArrow && <IconBase className='icon-chat-arrow-long' />}
      <CenterContent>
        <CenterTop>
          <span>{title}</span>
        </CenterTop>
        <CenterBottom>
          <span>{description}</span>
        </CenterBottom>
      </CenterContent>
      {rightText && (
        <RightButton
          onClick={rightButtonDisabled ? undefined : rightButtonClickCallback}
          $disabled={rightButtonDisabled}
        >
          {isRightButtonLoading ? <Pending /> : rightText}
        </RightButton>
      )}
    </ActionLayerWrapper>
  )
})
