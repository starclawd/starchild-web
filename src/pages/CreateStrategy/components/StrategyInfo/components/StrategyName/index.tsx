import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { ButtonBorder } from 'components/Button'
import { ChangeEvent, memo, useCallback, useState, useEffect, useRef, KeyboardEvent } from 'react'
import { useIsStep3Deploying } from 'store/createstrategy/hooks/useDeployment'
import useParsedQueryString from 'hooks/useParsedQueryString'
import TagItem from 'pages/Vaults/components/StrategyTable/components/TagItem'
import { useTheme } from 'store/themecache/hooks'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useEditStrategy, useStrategyDetail } from 'store/createstrategy/hooks/useStrategyDetail'

const StrategyNameWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 40px;
  width: 100%;
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
  width: 32px;
  height: 32px;
  border-radius: 4px;
  .icon-edit {
    font-size: 18px;
  }
`

const ButtonCancel = styled(ButtonEdit)``
const ButtonConfirm = styled(ButtonEdit)``

const StrategyTitle = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 20px;
`

const StrategyNameText = styled.span<{ $editable?: boolean }>`
  font-size: 64px;
  font-style: normal;
  font-weight: 400;
  line-height: 72px;
  color: ${({ theme }) => theme.black0};
  cursor: ${({ $editable }) => ($editable ? 'pointer' : 'default')};
`

const StrategyNameInputWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  position: relative;
`

const StrategyNameInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`

const TextDisplay = styled.div`
  display: inline-flex;
  align-items: center;
  font-size: 64px;
  font-style: normal;
  font-weight: 400;
  line-height: 72px;
  color: ${({ theme }) => theme.brand100};
`

const Cursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 72px;
  flex-shrink: 0;
  background: ${({ theme }) => theme.brand100};
  animation: blink 1s step-end infinite;

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
`

const StrategyDescription = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 26px;
  font-style: normal;
  font-weight: 400;
  line-height: 34px;
  color: ${({ theme }) => theme.black100};
`

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export default memo(function StrategyName({
  nameProp,
  descriptionProp,
}: {
  nameProp: string
  descriptionProp: string
}) {
  const theme = useTheme()
  const toast = useToast()
  const [name, setName] = useState(nameProp)
  const [isEdit, setIsEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { strategyId } = useParsedQueryString()
  const { refetch: refetchStrategyDetail } = useStrategyDetail({ strategyId: strategyId || '' })
  const isStep3Deploying = useIsStep3Deploying(strategyId || '')
  const triggerEditStrategy = useEditStrategy()
  const inputRef = useRef<HTMLInputElement>(null)
  const [cursorPosition, setCursorPosition] = useState(0)

  const changeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    setCursorPosition(e.target.selectionStart || value.length)
  }, [])

  const handleSelect = useCallback((e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    setCursorPosition(target.selectionStart || 0)
  }, [])

  const openEdit = useCallback(() => {
    if (isStep3Deploying) {
      return
    }
    setIsEdit(true)
    setCursorPosition(name.length)
  }, [isStep3Deploying, name.length])

  const cancelEdit = useCallback(() => {
    setName(nameProp)
    setIsEdit(false)
  }, [nameProp])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        cancelEdit()
      }
    },
    [cancelEdit],
  )

  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEdit])

  const handleConfirm = useCallback(async () => {
    if (!name.trim() || isLoading) {
      return
    }
    setIsLoading(true)
    try {
      const data = await triggerEditStrategy({ name, strategyId: strategyId || '', description: descriptionProp })
      if ((data as any).data?.status === 'success') {
        await refetchStrategyDetail()
        setIsEdit(false)
        toast({
          title: <Trans>Edit success</Trans>,
          description: <Trans>Strategy has been successfully updated</Trans>,
          status: TOAST_STATUS.SUCCESS,
          typeIcon: 'icon-edit',
          iconTheme: theme.jade10,
        })
      }
    } catch (error) {
      console.error('handleConfirm error', error)
    } finally {
      setIsLoading(false)
    }
  }, [name, isLoading, descriptionProp, strategyId, theme.jade10, toast, refetchStrategyDetail, triggerEditStrategy])
  return (
    <StrategyNameWrapper>
      <NameContent>
        <StrategyTitle>
          {isEdit ? (
            <StrategyNameInputWrapper onClick={() => inputRef.current?.focus()}>
              <StrategyNameInput
                ref={inputRef}
                value={name}
                onChange={changeName}
                onKeyDown={handleKeyDown}
                onSelect={handleSelect}
              />
              <TextDisplay>
                {name.slice(0, cursorPosition)}
                <Cursor />
                {name.slice(cursorPosition)}
              </TextDisplay>
            </StrategyNameInputWrapper>
          ) : (
            <StrategyNameText $editable={!isStep3Deploying} onClick={openEdit}>
              {nameProp}
            </StrategyNameText>
          )}
          <ButtonWrapper>
            {isEdit ? (
              <>
                <ButtonCancel onClick={cancelEdit}>
                  <IconBase className='icon-close' />
                </ButtonCancel>
                <ButtonConfirm onClick={handleConfirm} $disabled={isLoading}>
                  <IconBase className='icon-complete' />
                </ButtonConfirm>
              </>
            ) : (
              <ButtonEdit onClick={openEdit} $disabled={isStep3Deploying}>
                <IconBase className='icon-edit' />
              </ButtonEdit>
            )}
          </ButtonWrapper>
        </StrategyTitle>
        <StrategyDescription>
          <TagItem color={theme.brand100} text='Just for Test' size='big' />
          <TagItem color={theme.blue100} text='Just for Test1' size='big' />
          <TagItem color={theme.purple100} text='Just for Test2' size='big' />
        </StrategyDescription>
      </NameContent>
    </StrategyNameWrapper>
  )
})
