import BigNumber from 'bignumber.js'
import { mul, NumberType, toFix } from './calc'

export function formatNumber(value: NumberType, options?: { showDollar?: boolean }): string {
  const { showDollar = false } = options || {}

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
    let formattedValue: string
    if (value.isZero() && value.s === -1) {
      formattedValue = `-${value.toFormat(precision)}`
    } else {
      formattedValue = value.toFormat(precision)
    }

    if (showDollar) {
      if (value.isNegative()) {
        return `-$${formattedValue.substring(1)}`
      } else {
        return `$${formattedValue}`
      }
    }

    return formattedValue
  }
}

// 格式化百分比
export function formatPercent({
  value,
  mark = false,
  precision = 2,
  isCutOff = true,
  deleteZero = false,
}: {
  value: NumberType
  mark?: boolean
  precision?: number
  isCutOff?: boolean
  deleteZero?: boolean
}): string {
  if (value !== '--' && value !== 'NaN') {
    let valueTemp = toFix(mul(value, 100), precision, isCutOff)
    if (deleteZero) {
      valueTemp = Number(valueTemp)
    }
    return `${Number(value) > 0 ? (mark ? '+' : '') + valueTemp : valueTemp}%`
  }
  return '--'
}

export function formatKMBNumber(number: NumberType, precision = 2, options?: { showDollar?: boolean }) {
  const { showDollar = false } = options || {}

  if (number === '--') {
    return '--'
  }

  const originalNumber = Number(number)
  const isNegative = originalNumber < 0
  const absNumber = Math.abs(originalNumber)

  let formattedValue: string

  if (absNumber < 1000) {
    formattedValue = toFix(absNumber, precision)
  } else if (absNumber < 1000000) {
    formattedValue = formatNumber(toFix(absNumber / 1000, precision)) + 'K'
  } else if (absNumber < 1000000000) {
    formattedValue = formatNumber(toFix(absNumber / 1000000, precision)) + 'M'
  } else {
    formattedValue = formatNumber(toFix(absNumber / 1000000000, precision)) + 'B'
  }

  if (showDollar) {
    return isNegative ? `-$${formattedValue}` : `$${formattedValue}`
  } else {
    return isNegative ? `-${formattedValue}` : formattedValue
  }
}

// 格式化持续时间（毫秒 -> "12d 22h 59m" 格式）
export function formatDuration(milliseconds: number): string {
  if (milliseconds <= 0) {
    return '0m'
  }

  const minutes = Math.floor(milliseconds / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  const remainingHours = hours % 24
  const remainingMinutes = minutes % 60

  const parts: string[] = []

  if (days > 0) {
    parts.push(`${days}d`)
  }
  if (remainingHours > 0) {
    parts.push(`${remainingHours}h`)
  }
  if (remainingMinutes > 0 || parts.length === 0) {
    parts.push(`${remainingMinutes}m`)
  }

  return parts.join(' ')
}
