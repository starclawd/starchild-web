import { IconBase } from 'components/Icons'
import Pending from 'components/Pending'
import { ANI_DURATION } from 'constants/index'
import styled, { css } from 'styled-components'
import EditContent from '../EditContent'
import { Dispatch, memo, SetStateAction } from 'react'

const InfoLayerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
`

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  color: ${({ theme }) => theme.textL1};
  i {
    font-size: 24px;
    color: ${({ theme }) => theme.textL1};
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 28px;
  border-top: none;
`

export default memo(function InfoLayer({
  content,
  updateContent,
  isEdit,
  iconCls,
  title,
  isLoading,
}: {
  content: string
  updateContent: Dispatch<SetStateAction<string>>
  isEdit: boolean
  iconCls: string
  title: React.ReactNode
  isLoading: boolean
}) {
  return (
    <InfoLayerWrapper className='info-layer-wrapper'>
      <Title>
        <IconBase className={iconCls} />
        <span>{title}</span>
      </Title>
      <Content className='scroll-style'>
        <EditContent content={content} isEdit={isEdit} updateContent={updateContent} />
      </Content>
    </InfoLayerWrapper>
  )
})
