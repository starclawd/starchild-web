import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { ButtonBorder } from 'components/Button'
import { ChangeEvent, memo, useCallback, useState, useEffect, useRef, useMemo } from 'react'
import { useIsStep3Deploying } from 'store/createstrategy/hooks/useDeployment'
import useParsedQueryString from 'hooks/useParsedQueryString'
import VibeItem from 'pages/VaultDetail/components/VaultInfo/components/VibeItem'
import { useTheme } from 'store/themecache/hooks'
import useToast, { TOAST_STATUS } from 'components/Toast'
import {
  useEditStrategy,
  useIsCreateStrategy,
  useCreateStrategyDetail,
} from 'store/createstrategy/hooks/useCreateStrategyDetail'
import Pending from 'components/Pending'
import TypewriterCursor from 'components/TypewriterCursor'
import { ANI_DURATION } from 'constants/index'
import { useIsLogin } from 'store/login/hooks'

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
  gap: 40px;
  width: 100%;
  height: 100%;
`

const ButtonEdit = styled(ButtonBorder)`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.black600};
  .icon-edit {
    font-size: 18px;
  }
  &:hover {
    border-color: ${({ theme }) => theme.black400};
    .icon-edit {
      color: ${({ theme }) => theme.black0};
    }
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
  transition: all ${ANI_DURATION}s;
  cursor: ${({ $editable }) => ($editable ? 'pointer' : 'default')};
  ${({ theme }) => theme.mediaMaxWidth.width1560`
    font-size: 40px;
    font-style: normal;
    font-weight: 400;
    line-height: 48px; 
  `}
`

const StrategyNameInputWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  max-width: 70%;
`

const StrategyNameInput = styled.input`
  font-size: 64px;
  font-style: normal;
  font-weight: 400;
  line-height: 72px;
  color: ${({ theme }) => theme.brand100};
  background: transparent;
  border: none;
  outline: none;
  min-width: 50px;
  max-width: 100%;
  caret-color: ${({ theme }) => theme.brand100};
  /* @ts-ignore */
  field-sizing: content;
  &::placeholder {
    color: ${({ theme }) => theme.black300};
  }
  &::selection {
    background-color: ${({ theme }) => theme.brand100};
    color: ${({ theme }) => theme.black0};
  }
  ${({ theme }) => theme.mediaMaxWidth.width1560`
    font-size: 40px;
    font-style: normal;
    font-weight: 400;
    line-height: 48px; 
  `}
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
  const isLogin = useIsLogin()
  const [name, setName] = useState(nameProp)
  const [isEdit, setIsEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { strategyId } = useParsedQueryString()
  const { refetch: refetchStrategyDetail, strategyDetail } = useCreateStrategyDetail({ strategyId: strategyId || '' })
  const isStep3Deploying = useIsStep3Deploying(strategyId || '')
  const triggerEditStrategy = useEditStrategy()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isCreateStrategyFrontend] = useIsCreateStrategy()
  const [displayedLength, setDisplayedLength] = useState(nameProp.length)
  const [isTyping, setIsTyping] = useState(false)
  const prevNamePropRef = useRef(nameProp)

  const [vibe] = useMemo(() => {
    return [strategyDetail?.vibe]
  }, [strategyDetail])

  // 计算字符长度：中文算2个字符，英文算1个字符
  const getCharacterLength = useCallback((str: string) => {
    let length = 0
    for (const char of str) {
      // 中文字符范围判断
      if (/[\u4e00-\u9fa5]/.test(char)) {
        length += 2
      } else {
        length += 1
      }
    }
    return length
  }, [])

  const changeName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (isLoading) return
      const value = e.target.value
      // 限制40个字符（中文算2个，英文算1个）
      if (getCharacterLength(value) > 40) return
      setName(value)
    },
    [isLoading, getCharacterLength],
  )

  const openEdit = useCallback(() => {
    if (isStep3Deploying || !name || isTyping || isCreateStrategyFrontend || !isLogin) {
      return
    }
    setIsEdit(true)
  }, [isStep3Deploying, name, isTyping, isCreateStrategyFrontend, isLogin])

  const cancelEdit = useCallback(() => {
    if (isLoading) return
    setName(nameProp)
    setIsEdit(false)
  }, [nameProp, isLoading])

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
          iconTheme: theme.black0,
        })
      }
    } catch (error) {
      console.error('handleConfirm error', error)
    } finally {
      setIsLoading(false)
    }
  }, [name, isLoading, descriptionProp, strategyId, theme.black0, toast, refetchStrategyDetail, triggerEditStrategy])

  // ESC 和 Enter 键绑定到 document
  useEffect(() => {
    if (!isEdit) return

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (isLoading) return
      if (e.key === 'Escape') {
        cancelEdit()
      } else if (e.key === 'Enter') {
        if (name === nameProp) {
          cancelEdit()
        } else {
          handleConfirm()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isEdit, isLoading, cancelEdit, name, nameProp, handleConfirm])

  // 编辑模式时自动聚焦并选中所有文本
  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEdit])

  useEffect(() => {
    const prevNameProp = prevNamePropRef.current
    // 检测 nameProp 是否改变
    if (nameProp !== prevNameProp && isCreateStrategyFrontend) {
      // 开始打字机效果
      setIsTyping(true)
      setDisplayedLength(0)
      setName(nameProp)
    } else if (!isCreateStrategyFrontend) {
      // 非创建模式直接设置
      setName(nameProp)
      setDisplayedLength(nameProp.length)
    }
    prevNamePropRef.current = nameProp
  }, [nameProp, isCreateStrategyFrontend])

  // 打字机效果
  useEffect(() => {
    if (!isTyping || !isCreateStrategyFrontend) return

    if (displayedLength < nameProp.length) {
      const timer = setTimeout(() => {
        setDisplayedLength((prev) => prev + 1)
      }, 50) // 每个字符 50ms
      return () => clearTimeout(timer)
    } else {
      setIsTyping(false)
    }
  }, [isTyping, displayedLength, nameProp.length, isCreateStrategyFrontend])

  return (
    <StrategyNameWrapper>
      <NameContent>
        <StrategyTitle>
          {isEdit ? (
            <StrategyNameInputWrapper>
              <StrategyNameInput
                ref={inputRef}
                value={name}
                onChange={changeName}
                disabled={isLoading}
                placeholder='Strategy Name'
                maxLength={40}
              />
            </StrategyNameInputWrapper>
          ) : (
            <StrategyNameText
              $editable={!isStep3Deploying && !!name?.trim() && !isTyping && !isCreateStrategyFrontend && isLogin}
              onClick={openEdit}
            >
              {nameProp.slice(0, displayedLength)}
              {isTyping && <TypewriterCursor width={8} height={72} />}
            </StrategyNameText>
          )}
          {nameProp && (
            <ButtonWrapper>
              {isEdit ? (
                <>
                  <ButtonCancel onClick={cancelEdit} $disabled={isLoading}>
                    <IconBase className='icon-close' />
                  </ButtonCancel>
                  <ButtonConfirm onClick={handleConfirm} $disabled={isLoading}>
                    {isLoading ? <Pending /> : <IconBase className='icon-complete' />}
                  </ButtonConfirm>
                </>
              ) : (
                isLogin && (
                  <ButtonEdit onClick={openEdit} $disabled={isStep3Deploying || isTyping || isCreateStrategyFrontend}>
                    <IconBase className='icon-edit' />
                  </ButtonEdit>
                )
              )}
            </ButtonWrapper>
          )}
        </StrategyTitle>
        <StrategyDescription>
          <VibeItem vibe={vibe || ''} />
        </StrategyDescription>
      </NameContent>
    </StrategyNameWrapper>
  )
})
