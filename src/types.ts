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
