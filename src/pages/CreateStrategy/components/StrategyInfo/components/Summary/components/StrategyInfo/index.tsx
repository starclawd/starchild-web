import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { ButtonBorder } from 'components/Button'
import { useEditStrategyInfoModalToggle } from 'store/application/hooks'
import { memo, useCallback } from 'react'
import { useIsStep3Deploying } from 'store/createstrategy/hooks/useDeployment'

const StrategyInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  gap: 12px;
  width: 100%;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.black900};
`

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 28px;
`

const LeftContent = styled.div`
  display: flex;
  align-content: center;
  width: 100%;
  gap: 6px;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  color: ${({ theme }) => theme.textL2};
  .icon-chat-other {
    font-size: 24px;
    color: ${({ theme }) => theme.textL2};
  }
`

const ButtonEdit = styled(ButtonBorder)`
  width: fit-content;
  gap: 4px;
  height: 28px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  padding: 0 12px;
  color: ${({ theme }) => theme.textL3};
  .icon-edit {
    font-size: 14px;
    color: ${({ theme }) => theme.textL3};
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const StrategyTitle = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
`

const StrategyDescription = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
`

export default memo(function StrategyInfo({
  nameProp,
  descriptionProp,
}: {
  nameProp: string
  descriptionProp: string
}) {
  const isStep3Deploying = useIsStep3Deploying()
  const toggleEditStrategyInfoModal = useEditStrategyInfoModalToggle()
  const openEdit = useCallback(() => {
    if (isStep3Deploying) {
      return
    }
    toggleEditStrategyInfoModal()
  }, [isStep3Deploying, toggleEditStrategyInfoModal])
  return (
    <StrategyInfoWrapper>
      <Title>
        <LeftContent>
          <IconBase className='icon-chat-other' />
          <span>
            <Trans>Strategy info</Trans>
          </span>
        </LeftContent>
        <ButtonEdit $disabled={isStep3Deploying} onClick={openEdit}>
          <IconBase className='icon-edit' />
          <Trans>Edit</Trans>
        </ButtonEdit>
      </Title>
      <Content>
        <StrategyTitle>{nameProp}</StrategyTitle>
        <StrategyDescription>{descriptionProp}</StrategyDescription>
      </Content>
    </StrategyInfoWrapper>
  )
})
