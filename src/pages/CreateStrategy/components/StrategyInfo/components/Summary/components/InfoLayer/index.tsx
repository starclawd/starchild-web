import { IconBase } from 'components/Icons'
import Pending from 'components/Pending'
import { ANI_DURATION } from 'constants/index'
import styled, { css } from 'styled-components'
import EditContent from '../EditContent'
import { Dispatch, memo, SetStateAction } from 'react'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useStrategyDetail } from 'store/createstrategy/hooks/useStrategyDetail'

const InfoLayerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
`

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Left = styled.div`
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
  const { strategyId } = useParsedQueryString()
  const { strategyDetail, refetch } = useStrategyDetail({ strategyId: strategyId || '' })
  const { strategy_config } = strategyDetail || {
    strategy_config: null,
  }
  return (
    <InfoLayerWrapper className='info-layer-wrapper'>
      <Title>
        <Left>
          <IconBase className={iconCls} />
          <span>{title}</span>
        </Left>
        {!strategy_config && <Pending />}
      </Title>
      <Content>
        <EditContent content={content} isEdit={isEdit} updateContent={updateContent} />
      </Content>
    </InfoLayerWrapper>
  )
})
