import { NativeModules } from 'react-native'
import * as localStorage from './LocalStorage'
import * as notifications from './Notifications'

const { UsageLog } = NativeModules as {
  UsageLog: {
    currentActivity: () => Promise<string>
  }
}

interface Timers {
  [key: string]: { timeLeft?: number; timeSet?: number }
}

// Fetch the current activity
export async function fetchCurrentActivity() {
  try {
    return await UsageLog.currentActivity()
  } catch (error) {
    console.error('Failed to get current activity:', error)
    return 'default' // or handle this scenario differently
  }
}

// Handle timer expiration
export async function handleTimerExpired(localTimers: Timers, currentActivity: string) {
  localTimers[currentActivity].timeLeft = 0
  await notifications.timerExpired()
  console.log('Timer Expired:', currentActivity)
}

// Handle timer decrease
export async function handleTimerDecrease(
  i: number,

  localTimers: Timers,
  currentActivity: string,
  delay: number
) {
  console.log('Runned -> ', i)
  console.log('activity -> ', currentActivity)

  localTimers[currentActivity].timeLeft! -= delay / 1000
  await localStorage.setTimers(localTimers)
  console.log(` [Timer left]: ${localTimers[currentActivity].timeLeft} seconds`)
}
