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

export type Parameters = Options['parameters'];

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

export interface Note {
  title: string,
  description: string,
  type: 'Note'
  tags: string,
  complete: boolean,
  timestamp: number
}

export interface Task {
  title: string,
  description: string,
  type: 'Task'
  tags: string,
  complete: boolean,
  timestamp: number
}