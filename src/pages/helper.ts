export const vm = (px: number, keepPx = false): string => {
  if (keepPx) {
    return `${px}px`
  }
  return `${px * 100 / 430}vw`
}
