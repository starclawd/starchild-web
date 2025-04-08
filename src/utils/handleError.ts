export function handleError(error: any) {
  if (error?.reason) {
    error.message = error?.reason
  }
  if (String(error.message).length > 300) {
    error.message = String(error.message).slice(0, 300)
  }
  return error
}