import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  useLazyGetShortcutsQuery,
  useLazyCreateShortcutQuery,
  useLazyDeleteShortcutQuery,
  useLazyUpdateShortcutQuery,
} from '../../api/shortcuts'
import { changeAiStyleType, updateShortcuts } from './reducer'
import { RootState } from 'store'
import { AI_STYLE_TYPE, ShortcutDataType } from './shortcuts'
import { ParamFun } from 'types/global'
import { useLazyGetAiStyleTypeQuery, useLazyUpdateAiStyleTypeQuery } from 'api/chat'

export function useGetShortcuts() {
  const [, setShortcuts] = useShortcuts()
  const [triggerGetShortcuts] = useLazyGetShortcutsQuery()
  return useCallback(
    async ({ account }: { account: string }) => {
      try {
        const data = await triggerGetShortcuts({
          account,
        })
        setShortcuts(data.data || [])
        return data
      } catch (error) {
        return error
      }
    },
    [setShortcuts, triggerGetShortcuts],
  )
}

export function useShortcuts(): [ShortcutDataType[], (shortcuts: ShortcutDataType[]) => void] {
  const dispatch = useDispatch()
  const shortcuts = useSelector((state: RootState) => state.shortcuts.shortcuts)
  const setShortcuts = useCallback(
    (shortcuts: ShortcutDataType[]) => {
      dispatch(updateShortcuts(shortcuts))
    },
    [dispatch],
  )
  return [shortcuts, setShortcuts]
}

export function useCreateShortcut() {
  const [triggerCreateShortcut] = useLazyCreateShortcutQuery()
  return useCallback(
    async ({ account, content }: { account: string; content: string }) => {
      try {
        const data = await triggerCreateShortcut({
          account,
          content,
        })
        return data
      } catch (error) {
        return error
      }
    },
    [triggerCreateShortcut],
  )
}

export function useDeleteShortcut() {
  const [triggerDeleteShortcut] = useLazyDeleteShortcutQuery()
  return useCallback(
    async ({ account, shortcutId }: { account: string; shortcutId: string }) => {
      try {
        const data = await triggerDeleteShortcut({
          account,
          shortcutId,
        })
        return data
      } catch (error) {
        return error
      }
    },
    [triggerDeleteShortcut],
  )
}

export function useUpdateShortcut() {
  const [triggerUpdateShortcut] = useLazyUpdateShortcutQuery()
  return useCallback(
    async ({ account, shortcutId, content }: { account: string; shortcutId: string; content: string }) => {
      try {
        const data = await triggerUpdateShortcut({
          account,
          shortcutId,
          content,
        })
        return data
      } catch (error) {
        return error
      }
    },
    [triggerUpdateShortcut],
  )
}

export function useGetAiStyleType() {
  const [, setAiStyleType] = useAiStyleType()
  const [triggerGetAiStyleType] = useLazyGetAiStyleTypeQuery()
  return useCallback(
    async ({ account }: { account: string }) => {
      try {
        const data = await triggerGetAiStyleType({
          account,
        })
        const shortAnswer = (data.data as any)?.short_answer
        setAiStyleType(shortAnswer ? AI_STYLE_TYPE.CONCISE : AI_STYLE_TYPE.EXPLANATORY)
        return data
      } catch (error) {
        return error
      }
    },
    [setAiStyleType, triggerGetAiStyleType],
  )
}

export function useUpdateAiStyleType() {
  const [triggerUpdateAiStyleType] = useLazyUpdateAiStyleTypeQuery()
  return useCallback(
    async ({ account, aiStyleType }: { account: string; aiStyleType: AI_STYLE_TYPE }) => {
      try {
        const data = await triggerUpdateAiStyleType({
          account,
          aiStyleType,
        })
        return data
      } catch (error) {
        return error
      }
    },
    [triggerUpdateAiStyleType],
  )
}

export function useAiStyleType(): [AI_STYLE_TYPE, ParamFun<AI_STYLE_TYPE>] {
  const dispatch = useDispatch()
  const aiStyleType = useSelector((state: RootState) => state.shortcuts.aiStyleType)
  const setAiStyleType = useCallback(
    (value: AI_STYLE_TYPE) => {
      dispatch(changeAiStyleType(value))
    },
    [dispatch],
  )
  return [aiStyleType, setAiStyleType]
}
