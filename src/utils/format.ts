
import BigNumber from 'bignumber.js'
import { NumberType } from './calc'

export function formatNumber(value: NumberType): string {
  if (value === null || value === undefined || value === '--') {
    return '--'
  }
  // 已经格式化过的数字 原样返回
  if (typeof value === 'string' && value.indexOf(',') > -1) {
    return value
  }
  //
  const numStr = (value && (typeof value === 'number' || typeof value === 'object') && value.toString()) || value
  value = new BigNumber(value)
  if (value.isNaN()) {
    return '--'
  } else {
    const numArr = String(numStr).split('.')
    const precision = (numArr[1] && numArr[1]['length']) || 0
    if (value.isZero() && value.s === -1) {
      return `-${value.toFormat(precision)}`
    }
    return value.toFormat(precision)
  }
}
