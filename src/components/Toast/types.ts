/**
 * Toast 组件类型定义
 */
import { ReactNode } from 'react'

export enum TOAST_STATUS {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  LOADING = 'LOADING',
}

export enum TOAST_TYPE {
  OPEN_NOTIFICATION = 'OPEN_NOTIFICATION',
  CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION',
}

export interface ToastData {
  title: ReactNode
  description: ReactNode
  status: TOAST_STATUS
  typeIcon: string
  iconTheme: string
  iconStyle?: React.CSSProperties
}

export interface ToastOptions {
  title: ReactNode
  description: ReactNode
  status: TOAST_STATUS
  typeIcon: string
  iconTheme: string
  autoClose?: number
  iconStyle?: React.CSSProperties
}
