import { IconBase } from 'components/Icons'
import Pending from 'components/Pending'
import { ANI_DURATION } from 'constants/index'
import styled, { css } from 'styled-components'
import EditContent from '../EditContent'
import { Dispatch, memo, SetStateAction } from 'react'

const InfoLayerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  width: 100%;
  height: 320px;
`

const Title = styled.div<{ $isLoading: boolean; $isEdit: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 36px;
  padding: 8px 12px;
  border: 1px solid ${({ theme, $isEdit }) => ($isEdit ? theme.text20 : theme.bgT30)};
  border-bottom: none;
  background: ${({ theme }) => theme.black700};
  border-radius: 8px 8px 0 0;
  transition: all ${ANI_DURATION}s;
  ${({ $isLoading, theme }) =>
    $isLoading &&
    css`
      background: ${theme.brand100};
      border: none;
      .icon-loading {
        color: ${theme.black1000};
      }
    `}
`

const TitleLeft = styled.div<{ $isLoading: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme, $isLoading }) => ($isLoading ? theme.black1000 : theme.textL2)};
  i {
    font-size: 18px;
    color: ${({ theme, $isLoading }) => ($isLoading ? theme.black1000 : theme.textL2)};
  }
`

const Content = styled.div<{ $isEdit: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 36px);
  padding: 12px;
  border: 1px solid ${({ theme, $isEdit }) => ($isEdit ? theme.text20 : theme.bgT30)};
  border-top: none;
  border-radius: 0 0 8px 8px;
  background: ${({ theme, $isEdit }) => ($isEdit ? theme.black800 : theme.black1000)};
  transition: all ${ANI_DURATION}s;
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
      <Title $isLoading={isLoading} $isEdit={isEdit}>
        <TitleLeft $isLoading={isLoading}>
          <IconBase className={iconCls} />
          <span>{title}</span>
        </TitleLeft>
        {isLoading && <Pending isNotButtonLoading />}
      </Title>
      <Content $isEdit={isEdit} className='scroll-style'>
        <EditContent content={content} isEdit={isEdit} updateContent={updateContent} />
      </Content>
    </InfoLayerWrapper>
  )
})
