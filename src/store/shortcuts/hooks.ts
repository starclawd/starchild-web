import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLazyGetShortcutsQuery, useLazyCreateShortcutQuery, useLazyDeleteShortcutQuery, useLazyUpdateShortcutQuery } from '../../api/shortcuts'
import { updateShortcuts } from './reducer'
import { RootState } from 'store'
import { ShortcutDataType } from './shortcuts'

export function useGetShortcuts() {
  const [, setShortcuts] = useShortcuts()
  const [triggerGetShortcuts] = useLazyGetShortcutsQuery()
  return useCallback(async ({
    account,
  }: {
    account: string
  }) => {
    try {
      const data = await triggerGetShortcuts({
        account,
      })
      setShortcuts(data.data || [])
      return data
    } catch (error) {
      return error
    }
  }, [setShortcuts, triggerGetShortcuts])
}

export function useShortcuts(): [ShortcutDataType[], (shortcuts: ShortcutDataType[]) => void] {
  const dispatch = useDispatch()
  const shortcuts = useSelector((state: RootState) => state.shortcuts.shortcuts)
  const setShortcuts = useCallback((shortcuts: ShortcutDataType[]) => {
    dispatch(updateShortcuts(shortcuts))
  }, [dispatch])
  return [shortcuts, setShortcuts]
}
  
export function useCreateShortcut() {
  const [triggerCreateShortcut] = useLazyCreateShortcutQuery()
  return useCallback(async ({
    account,
    content,
  }: {
    account: string
    content: string
  }) => {
    const data = await triggerCreateShortcut({
      account,
      content,
    })
    return data
  }, [triggerCreateShortcut])
}

export function useDeleteShortcut() {
  const [triggerDeleteShortcut] = useLazyDeleteShortcutQuery()
  return useCallback(async ({
    account,
    shortcutId,
  }: {
    account: string
    shortcutId: string
  }) => {
    const data = await triggerDeleteShortcut({
      account,
      shortcutId,
    })
    return data
  }, [triggerDeleteShortcut])
}

export function useUpdateShortcut() {
  const [triggerUpdateShortcut] = useLazyUpdateShortcutQuery()
  return useCallback(async ({
    account,
    shortcutId,
    content,
  }: {
    account: string
    shortcutId: string
    content: string
  }) => {
    const data = await triggerUpdateShortcut({
      account,
      shortcutId,
      content,
    })
    return data
  }, [triggerUpdateShortcut])
}
