import { ButtonCommon } from 'components/Button'
import { IconBase } from 'components/Icons'
import Pending from 'components/Pending'
import { memo, MouseEventHandler } from 'react'
import styled from 'styled-components'

const ActionLayerWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 80px;
  gap: 8px;
  padding: 0 20px;
  border-top: 1px solid ${({ theme }) => theme.black800};
  background-color: #151110;
  i {
    font-size: 24px;
    color: ${({ theme }) => theme.black0};
  }
`

const CenterContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  gap: 8px;
`

const CenterTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  color: ${({ theme }) => theme.black0};
`

const CenterBottom = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  text-align: left;
  color: ${({ theme }) => theme.black200};
`

const ArrowButton = styled(ButtonCommon)`
  min-width: 40px;
  width: fit-content;
  height: 40px;
  border-radius: 0;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  padding: 0 12px;
  color: ${({ theme }) => theme.black1000};
  .icon-arrow {
    transform: rotate(90deg);
    font-size: 24px;
    color: ${({ theme }) => theme.black1000};
  }
`

export default memo(function ActionLayer({
  rightText,
  iconCls,
  title,
  description,
  isLoading,
  clickCallback,
}: {
  rightText?: React.ReactNode
  iconCls: string
  isLoading?: boolean
  title: React.ReactNode
  description: React.ReactNode
  clickCallback?: MouseEventHandler<HTMLDivElement>
}) {
  return (
    <ActionLayerWrapper className='action-layer-wrapper' onClick={clickCallback}>
      <IconBase className={iconCls} />
      <CenterContent>
        <CenterTop>
          <span>{title}</span>
        </CenterTop>
        <CenterBottom>
          <span>{description}</span>
        </CenterBottom>
      </CenterContent>
      <ArrowButton>
        {isLoading ? <Pending /> : rightText ? <span>{rightText}</span> : <IconBase className='icon-arrow' />}
      </ArrowButton>
    </ActionLayerWrapper>
  )
})
