import { useMemo } from 'react'

const useFormatTime = (timeInSeconds: number | undefined) => {

  if (typeof timeInSeconds !== 'number' || isNaN(timeInSeconds)) {
    return ''
  }

  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = timeInSeconds % 60

  if (minutes === 0 && seconds === 0) {
    return ''
  }

  if (minutes === 0) {
    return `${seconds}s`
  }

  if (seconds === 0) {
    return `${minutes}m`
  }

  return `${minutes}m ${seconds}s`
}

export default useFormatTime
