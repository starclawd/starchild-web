/**
 * 统一计算方法封装
 */
import BigNumber from 'bignumber.js'
import { formatNumber } from './format'
export type NumberType = string | BigNumber | number

/**
 * 保留有效位数
 * @param num
 * @param precision
 * @param isCutOff
 * @returns
 */
function toPrecision(num: NumberType, precision = 2, isCutOff = true): any {
  num = new BigNumber(num)
  precision = Number(precision)
  return num.isNaN() || isNaN(precision)
    ? '--'
    : num.toPrecision(precision, isCutOff ? BigNumber.ROUND_DOWN : BigNumber.ROUND_UP)
}
/**
 * 定制Number的toFixed方法，默认返回截断处理的数字,
 * 能够达到 将科学记数法数值转化为非科学记数法数值 的功能
 * 所以以前的方法toNonExponentialNum没用了，舍弃掉
 * @param num: 需要转换的数字， 可以为数字，字符串，BigNumber等
 * @param precision：保留小数的位数, 整数
 * @param isCutOff: 是否截断处理，默认截断处理, false: 向上进1
 * @returns {string}
 */
function toFix(num: NumberType, precision = 4, isCutOff = true): any {
  num = new BigNumber(num)
  precision = Number(precision)
  return num.isNaN() || isNaN(precision)
    ? '--'
    : num.toFixed(precision, isCutOff ? BigNumber.ROUND_DOWN : BigNumber.ROUND_UP)
}
// console.log('toFix++++', toFix(new BigNumber('98809.000000399999999999'), '--', false), new BigNumber(-1.239432).toFixed(2, BigNumber.ROUND_UP))

/**
 * 两个浮点数相减
 * @param a 被减数 可以为数字，字符串，BigNumber等
 * @param b 减数 可以为数字，字符串，BigNumber等
 * @returns {string}
 */
function sub(a: NumberType, b: NumberType): any {
  a = new BigNumber(a)
  return a.minus(b).toFixed()
}
// console.log('sub++++++++', sub('ds', '--'))
// console.log('sub++++++++', sub(0.223394598378923, new BigNumber(0.193923482304823082323023048239)))
// console.log('sub++++++++', sub(2.394723979384832423423234083294823098423e+5, 2.394723979384832423423234083294823098423e+3))

/**
 * 多个浮点数相减
 * @returns {*}
 */
function subs(...params: NumberType[]): any {
  if (params.length < 2) {
    throw new Error('subs params wrong')
  }
  let res = sub(params[0], params[1])
  for (let i = 2; i < params.length; i++) {
    res = sub(res, params[i])
  }
  return res
}

/**
 * 两个浮点数相加
 * @param a 可以为数字，字符串，BigNumber等
 * @param b 可以为数字，字符串，BigNumber等
 */
function add(a: NumberType, b: NumberType): any {
  a = new BigNumber(a)
  return a.plus(b).toFixed()
}
// console.log('add++++++++', add('ds', '--'))
// console.log('add++++++++', add(0.223394598378923, 0.193923482304823082323023048239))
// console.log('add++++++++', add(2.394723979384832423423234083294823098423e+5, 2.394723979384832423423234083294823098423e+3))

/**
 * 多个浮点数相加
 * @returns {*}
 */
function adds(...params: NumberType[]): any {
  if (params.length < 2) {
    throw new Error('adds params wrong')
  }
  let res = add(params[0], params[1])
  for (let i = 2; i < params.length; i++) {
    res = add(res, params[i])
  }
  return res
}

/**
 * 两个浮点数相乘
 * @param a 可以为数字，字符串，BigNumber等
 * @param b 可以为数字，字符串，BigNumber等
 * @returns {number}
 */
function mul(a: NumberType, b: NumberType): any {
  a = new BigNumber(a)
  return a.multipliedBy(b).toFixed()
}
// console.log('mul++++++++', mul('ds', '--'))
// console.log('mul++++++++', mul(0.3, 6))
// console.log('mul++++++++', mul(0.223394598378923, 0.193923482304823082323023048239))
// console.log('mul++++++++', mul(2.394723979384832423423234083294823098423e+5, 2.394723979384832423423234083294823098423e+3))

/**
 * 多个浮点数相乘
 * @returns {*}
 */
function muls(...params: NumberType[]): any {
  if (params.length < 2) {
    throw new Error('muls params wrong')
  }
  let res = mul(params[0], params[1])
  for (let i = 2; i < params.length; i++) {
    res = mul(res, params[i])
  }
  return res
}

/**
 * 两个浮点数相除
 * @param a 可以为数字，字符串，BigNumber等
 * @param b 可以为数字，字符串，BigNumber等
 */
function div(a: NumberType, b: NumberType): any {
  a = new BigNumber(a)
  return a.dividedBy(b).toFixed()
}
// console.log('div++++++++', div('ds', '--'))
// console.log('div++++++++', div(0.3, 6))
// console.log('div++++++++', div(0.223394598378923, 0.193923482304823082323023048239))
// console.log('div++++++++', div(2.394723979384832423423234083294823098423e+5, 2.394723979384832423423234083294823098423e+3))

/**
 * 多个浮点数相除
 * @returns {*}
 */
function divs(...params: NumberType[]): any {
  if (params.length < 2) {
    throw new Error('divs params wrong')
  }
  let res = div(params[0], params[1])
  for (let i = 2; i < params.length; i++) {
    res = div(res, params[i])
  }
  return res
}
// const exporse = sub('347800.028', mul('11.996', '28993.00'))
// const netValue = sub('286163.95832', mul('11.996', '28993.00'))
// const temp1 = sub(mul(exporse, '0.03'), netValue)
// const lipPrice = div(div(temp1, sub(1, 0.03)), '11.996')
// console.log('lipPrice', lipPrice)

export { sub, subs, add, adds, mul, muls, div, divs, toFix, toPrecision }

export function isGt(num1: NumberType, num2: NumberType): boolean {
  num1 = new BigNumber(num1)
  num2 = new BigNumber(num2)
  return num1.gt(num2)
}

export function isGte(num1: NumberType, num2: NumberType): boolean {
  num1 = new BigNumber(num1)
  num2 = new BigNumber(num2)
  return num1.gte(num2)
}

export function isLt(num1: NumberType, num2: NumberType): boolean {
  num1 = new BigNumber(num1)
  num2 = new BigNumber(num2)
  return num1.lt(num2)
}
export function isLte(num1: NumberType, num2: NumberType): boolean {
  num1 = new BigNumber(num1)
  num2 = new BigNumber(num2)
  return num1.lte(num2)
}
