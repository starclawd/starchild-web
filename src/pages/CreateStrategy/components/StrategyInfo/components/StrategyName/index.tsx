import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { ButtonBorder } from 'components/Button'
import { useEditStrategyInfoModalToggle, useModalOpen } from 'store/application/hooks'
import { memo, useCallback } from 'react'
import { useIsStep3Deploying } from 'store/createstrategy/hooks/useDeployment'
import useParsedQueryString from 'hooks/useParsedQueryString'
import EditStrategyInfoModal from '../Summary/components/EditStrategyInfoModal'
import { ApplicationModal } from 'store/application/application'

const StrategyNameWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  width: 906px;
  height: 100%;
`

const NameContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`

const ButtonEdit = styled(ButtonBorder)`
  width: fit-content;
  gap: 4px;
  height: 40px;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  padding: 0 12px;
  border-radius: 0;
  color: ${({ theme }) => theme.textL3};
  .icon-edit {
    font-size: 18px;
    color: ${({ theme }) => theme.textL3};
  }
`

const StrategyTitle = styled.div`
  font-size: 64px;
  font-style: normal;
  font-weight: 400;
  line-height: 72px;
  cursor: pointer;
  color: ${({ theme }) => theme.white};
`

const StrategyDescription = styled.div`
  font-size: 26px;
  font-style: normal;
  font-weight: 400;
  line-height: 34px;
  color: ${({ theme }) => theme.textL2};
`

export default memo(function StrategyName({
  nameProp,
  descriptionProp,
}: {
  nameProp: string
  descriptionProp: string
}) {
  const { strategyId } = useParsedQueryString()
  const isStep3Deploying = useIsStep3Deploying(strategyId || '')
  const toggleEditStrategyInfoModal = useEditStrategyInfoModalToggle()
  const editStrategyInfoModalOpen = useModalOpen(ApplicationModal.EDIT_STRATEGY_INFO_MODAL)
  const openEdit = useCallback(() => {
    if (isStep3Deploying) {
      return
    }
    toggleEditStrategyInfoModal()
  }, [isStep3Deploying, toggleEditStrategyInfoModal])
  return (
    <StrategyNameWrapper>
      <NameContent>
        <StrategyTitle onClick={openEdit}>{nameProp}</StrategyTitle>
        <StrategyDescription>{descriptionProp}</StrategyDescription>
      </NameContent>
      {nameProp && (
        <ButtonEdit onClick={openEdit} $disabled={isStep3Deploying}>
          <IconBase className='icon-edit' />
          <Trans>Edit</Trans>
        </ButtonEdit>
      )}
      {editStrategyInfoModalOpen && <EditStrategyInfoModal nameProp={nameProp} descriptionProp={descriptionProp} />}
    </StrategyNameWrapper>
  )
})
