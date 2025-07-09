/**
 * 获取url参数
 */
import { parse } from 'qs'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { OPEN_ALL_PERMISSIONS } from 'types/global'

export interface ParsedQueryDataType {
  openAllPermissions?: OPEN_ALL_PERMISSIONS
  testChartImg?: string
  taskId?: string
}

export function parsedQueryString(search?: string): ParsedQueryDataType {
  if (!search) {
    // react-router-dom places search string in the hash
    const hash = window.location.hash
    search = hash.substr(hash.indexOf('?'))
  }
  return search && search.length > 1 ? parse(search, { parseArrays: false, ignoreQueryPrefix: true }) : {}
}

export default function useParsedQueryString(): ParsedQueryDataType {
  const { search } = useLocation()
  return useMemo(() => parsedQueryString(search), [search])
}
