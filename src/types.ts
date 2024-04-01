export type Options = {
  taskName: string
  taskTitle: string
  taskDesc: string

  taskIcon: {
    name: string
    type: string
  }

  linkingURI: string

  parameters: {
    delay: number
    screenOffDelay: number
    timerExpiredDelay: number
  }
}
export type AppUsageData = {
    appName: string
    iconBase64: string
    packageName: string
    usageTimeMinutes: number
    usageTimeSeconds: number
}

export interface Timers {
    [key: string]: { timeLeft?: number; timeSet?: number }
}