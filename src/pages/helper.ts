import { MOBILE_DESIGN_WIDTH } from 'constants/index'

export const vm = (px: number, keepPx = false): string => {
  if (keepPx) {
    return `${px}px`
  }
  return `${(px * 100) / MOBILE_DESIGN_WIDTH}vw`
}
