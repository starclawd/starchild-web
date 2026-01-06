import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { ButtonBorder } from 'components/Button'
import { ChangeEvent, memo, useCallback, useState, useEffect, useRef, MouseEvent } from 'react'
import { useIsStep3Deploying } from 'store/createstrategy/hooks/useDeployment'
import useParsedQueryString from 'hooks/useParsedQueryString'
import TagItem from 'pages/Vaults/components/StrategyTable/components/TagItem'
import { useTheme } from 'store/themecache/hooks'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useEditStrategy, useIsCreateStrategy, useStrategyDetail } from 'store/createstrategy/hooks/useStrategyDetail'
import Pending from 'components/Pending'

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
  cursor: text;
  user-select: none;
`

const CharSpan = styled.span<{ $selected?: boolean }>`
  white-space: pre;
  background-color: ${({ $selected, theme }) => ($selected ? theme.brand100 : 'transparent')};
  color: ${({ $selected, theme }) => ($selected ? theme.black0 : 'inherit')};
`

const CursorWrapper = styled.span`
  display: inline-flex;
  align-items: center;
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
  const [selectionStart, setSelectionStart] = useState(0)
  const [selectionEnd, setSelectionEnd] = useState(0)
  const [isCreateStrategyFrontend] = useIsCreateStrategy()
  const [displayedLength, setDisplayedLength] = useState(nameProp.length)
  const [isTyping, setIsTyping] = useState(false)
  const prevNamePropRef = useRef(nameProp)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartPositionRef = useRef(0)

  const changeName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (isLoading) return
      const value = e.target.value
      const newPosition = e.target.selectionStart || value.length
      setName(value)
      setCursorPosition(newPosition)
      setSelectionStart(newPosition)
      setSelectionEnd(newPosition)
    },
    [isLoading],
  )

  const handleSelect = useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>) => {
      if (isLoading) return
      const target = e.target as HTMLInputElement
      const start = target.selectionStart || 0
      const end = target.selectionEnd || 0
      setCursorPosition(end)
      setSelectionStart(start)
      setSelectionEnd(end)
    },
    [isLoading],
  )

  const openEdit = useCallback(() => {
    if (isStep3Deploying || !name || isTyping || isCreateStrategyFrontend) {
      return
    }
    setIsEdit(true)
    setCursorPosition(name.length)
    setSelectionStart(name.length)
    setSelectionEnd(name.length)
  }, [isStep3Deploying, name, isTyping, isCreateStrategyFrontend])

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
          iconTheme: theme.jade10,
        })
      }
    } catch (error) {
      console.error('handleConfirm error', error)
    } finally {
      setIsLoading(false)
    }
  }, [name, isLoading, descriptionProp, strategyId, theme.jade10, toast, refetchStrategyDetail, triggerEditStrategy])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isEdit || isLoading) return
      if (e.key === 'Escape') {
        cancelEdit()
      } else if (e.key === 'Enter') {
        if (name === nameProp) {
          cancelEdit()
        } else {
          handleConfirm()
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (selectionStart !== selectionEnd) {
          // 有选择区域时，光标移到选择开始位置
          setCursorPosition(selectionStart)
          setSelectionStart(selectionStart)
          setSelectionEnd(selectionStart)
        } else if (cursorPosition > 0) {
          // 光标左移一位
          const newPosition = cursorPosition - 1
          setCursorPosition(newPosition)
          setSelectionStart(newPosition)
          setSelectionEnd(newPosition)
        }
        if (inputRef.current) {
          const newPos = selectionStart !== selectionEnd ? selectionStart : Math.max(0, cursorPosition - 1)
          inputRef.current.setSelectionRange(newPos, newPos)
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (selectionStart !== selectionEnd) {
          // 有选择区域时，光标移到选择结束位置
          setCursorPosition(selectionEnd)
          setSelectionStart(selectionEnd)
          setSelectionEnd(selectionEnd)
        } else if (cursorPosition < name.length) {
          // 光标右移一位
          const newPosition = cursorPosition + 1
          setCursorPosition(newPosition)
          setSelectionStart(newPosition)
          setSelectionEnd(newPosition)
        }
        if (inputRef.current) {
          const newPos = selectionStart !== selectionEnd ? selectionEnd : Math.min(name.length, cursorPosition + 1)
          inputRef.current.setSelectionRange(newPos, newPos)
        }
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        if (selectionStart !== selectionEnd) {
          // 删除选择的内容
          const newValue = name.slice(0, selectionStart) + name.slice(selectionEnd)
          setName(newValue)
          setCursorPosition(selectionStart)
          setSelectionStart(selectionStart)
          setSelectionEnd(selectionStart)
          if (inputRef.current) {
            inputRef.current.value = newValue
            inputRef.current.setSelectionRange(selectionStart, selectionStart)
          }
        } else if (cursorPosition > 0) {
          // 删除光标前的字符
          const newValue = name.slice(0, cursorPosition - 1) + name.slice(cursorPosition)
          const newPosition = cursorPosition - 1
          setName(newValue)
          setCursorPosition(newPosition)
          setSelectionStart(newPosition)
          setSelectionEnd(newPosition)
          if (inputRef.current) {
            inputRef.current.value = newValue
            inputRef.current.setSelectionRange(newPosition, newPosition)
          }
        }
      } else if (e.key === 'Delete') {
        e.preventDefault()
        if (selectionStart !== selectionEnd) {
          // 删除选择的内容
          const newValue = name.slice(0, selectionStart) + name.slice(selectionEnd)
          setName(newValue)
          setCursorPosition(selectionStart)
          setSelectionStart(selectionStart)
          setSelectionEnd(selectionStart)
          if (inputRef.current) {
            inputRef.current.value = newValue
            inputRef.current.setSelectionRange(selectionStart, selectionStart)
          }
        } else if (cursorPosition < name.length) {
          // 删除光标后的字符
          const newValue = name.slice(0, cursorPosition) + name.slice(cursorPosition + 1)
          setName(newValue)
          if (inputRef.current) {
            inputRef.current.value = newValue
            inputRef.current.setSelectionRange(cursorPosition, cursorPosition)
          }
        }
      }
    },
    [isEdit, cancelEdit, name, nameProp, handleConfirm, isLoading, cursorPosition, selectionStart, selectionEnd],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  // 监听全局 mouseup 事件，防止拖动到元素外部后松开鼠标
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false)
    }
    document.addEventListener('mouseup', handleGlobalMouseUp)
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [])

  // 计算鼠标位置对应的字符索引
  const getCharIndexFromMouseEvent = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement
      const index = target.getAttribute('data-index')
      if (index !== null) {
        const charIndex = parseInt(index, 10)
        const rect = target.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const charWidth = rect.width
        return clickX > charWidth / 2 ? charIndex + 1 : charIndex
      }
      return name.length
    },
    [name.length],
  )

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (isLoading) return
      const position = getCharIndexFromMouseEvent(e)
      setIsDragging(true)
      dragStartPositionRef.current = position
      setCursorPosition(position)
      setSelectionStart(position)
      setSelectionEnd(position)
      if (inputRef.current) {
        inputRef.current.focus()
        inputRef.current.setSelectionRange(position, position)
      }
    },
    [isLoading, getCharIndexFromMouseEvent],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!isDragging || isLoading) return
      const position = getCharIndexFromMouseEvent(e)
      const start = Math.min(dragStartPositionRef.current, position)
      const end = Math.max(dragStartPositionRef.current, position)
      setCursorPosition(position)
      setSelectionStart(start)
      setSelectionEnd(end)
      if (inputRef.current) {
        inputRef.current.setSelectionRange(start, end)
      }
    },
    [isDragging, isLoading, getCharIndexFromMouseEvent],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus()
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
              <StrategyNameInput ref={inputRef} value={name} onChange={changeName} onSelect={handleSelect} />
              <TextDisplay onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
                {name.split('').map((char, index) => {
                  const isSelected = selectionStart !== selectionEnd && index >= selectionStart && index < selectionEnd
                  const showCursor = selectionStart === selectionEnd && index === cursorPosition
                  return showCursor ? (
                    <CursorWrapper key={index}>
                      <Cursor />
                      <CharSpan data-index={index} $selected={isSelected}>
                        {char}
                      </CharSpan>
                    </CursorWrapper>
                  ) : (
                    <CharSpan key={index} data-index={index} $selected={isSelected}>
                      {char}
                    </CharSpan>
                  )
                })}
                {selectionStart === selectionEnd && cursorPosition === name.length && <Cursor />}
              </TextDisplay>
            </StrategyNameInputWrapper>
          ) : (
            <StrategyNameText
              $editable={!isStep3Deploying && !!name?.trim() && !isTyping && !isCreateStrategyFrontend}
              onClick={openEdit}
            >
              {nameProp.slice(0, displayedLength)}
              {isTyping && <Cursor />}
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
                <ButtonEdit onClick={openEdit} $disabled={isStep3Deploying || isTyping || isCreateStrategyFrontend}>
                  <IconBase className='icon-edit' />
                </ButtonEdit>
              )}
            </ButtonWrapper>
          )}
        </StrategyTitle>
        <StrategyDescription>
          <TagItem colorType='brand' text='Just for Test' size='big' />
          <TagItem colorType='blue' text='Just for Test1' size='big' />
          <TagItem colorType='purple' text='Just for Test2' size='big' />
        </StrategyDescription>
      </NameContent>
    </StrategyNameWrapper>
  )
})
