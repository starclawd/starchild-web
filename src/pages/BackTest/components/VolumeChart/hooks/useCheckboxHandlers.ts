import { useCallback } from 'react'

export const useCheckboxHandlers = (
  isCheckedEquity: boolean,
  setIsCheckedEquity: (value: boolean) => void,
  isCheckedHold: boolean,
  setIsCheckedHold: (value: boolean) => void,
) => {
  const changeCheckedEquity = useCallback(() => {
    if (!isCheckedHold && isCheckedEquity) {
      setIsCheckedHold(true)
    }
    setIsCheckedEquity(!isCheckedEquity)
  }, [isCheckedEquity, isCheckedHold, setIsCheckedHold, setIsCheckedEquity])

  const changeCheckedHold = useCallback(() => {
    if (!isCheckedEquity && isCheckedHold) {
      setIsCheckedEquity(true)
    }
    setIsCheckedHold(!isCheckedHold)
  }, [isCheckedHold, isCheckedEquity, setIsCheckedEquity, setIsCheckedHold])

  return {
    changeCheckedEquity,
    changeCheckedHold,
  }
}
