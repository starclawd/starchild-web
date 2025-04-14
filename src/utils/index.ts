export function isMatchCurrentRouter(currentRouter: string, matchRouter: string) {
  try {
    return currentRouter.toLowerCase() === matchRouter.toLowerCase()
  } catch (error) {
    return false
  }
}