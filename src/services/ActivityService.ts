import { NativeModules } from 'react-native'
import * as localStorage from './LocalStorage'
import * as notifications from './Notifications'
import {Parameters, Options, Timers} from '../types'
import BackgroundService from 'react-native-background-actions'
import { isAfter, setHours, setMinutes, setSeconds, startOfTomorrow } from 'date-fns'

//TODO: Refactor the toggle background to use the delay and pooling rate set in settings screen.

const debugLogs = false //reload the app on change

const { UsageLog } = NativeModules as {
  UsageLog: {
    currentActivity: () => Promise<string>
  }
}


// Fetch the current activity
export async function fetchCurrentActivity() {
  try {
    return await UsageLog.currentActivity()
  } catch (error) {
    debugLogs && console.error('Failed to get current activity:', error)
    return 'default' // or handle this scenario differently
  }
}

// Handle timer expiration
export async function handleTimerExpired(localTimers: Timers, currentActivity: string) {
  localTimers[currentActivity].timeLeft = 0
  await notifications.timerExpired()
  debugLogs && console.log('Timer Expired:', currentActivity)
}

// Handle timer decrease
export async function handleTimerDecrease(localTimers: Timers, currentActivity: string, delay: number) {
  debugLogs && console.log('activity -> ', currentActivity)
  localTimers[currentActivity].timeLeft! -= delay / 1000
  await localStorage.setDataByKey('@local_timers', localTimers)
  debugLogs && console.log(` [Timer left]: ${localTimers[currentActivity].timeLeft} seconds, decreased with: ${delay / 1000}s`)
}

export async function trackedTimerHandler(trackedTimers: Timers, currentActivity: string, sleepDuration: number) {
  if (trackedTimers[currentActivity].timeLeft! > 0) {
    await handleTimerDecrease(trackedTimers, currentActivity, sleepDuration)
  } else {
    await handleTimerExpired(trackedTimers, currentActivity)
  }
}


function getNextResetTime() {
  const now = new Date()
  let resetTime = setHours(setMinutes(setSeconds(now, 0), 1), 24) // Set to today's 12:01 PM
  if (isAfter(now, resetTime)) {
    resetTime = startOfTomorrow() // If it's past today's 12 AM, set to tomorrow's 12 AM
  }
  debugLogs && console.log('[Next reset time]:', resetTime)
  return resetTime
}

const sleep = (time: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), time))
export let iteration = 0

export async function backgroundTimerTask(
  index: number,
  backgroundTaskParams?: Parameters,
  options?: Options
): Promise<void> {
  if (options !== undefined && options !== null) {
    debugLogs && console.log('in options')
    backgroundTaskParams = {
      delay: options.parameters.delay,
      screenOffDelay: options.parameters.screenOffDelay,
      timerExpiredDelay: options.parameters.timerExpiredDelay,
    }
  }
  let userAlerted = false
  let nextResetTime = getNextResetTime()
  let iterationCount = 0
  const localOptions = await localStorage.getOptions()

  debugLogs && console.log('\n \n local background options:  ', localOptions)
  debugLogs && console.log('\n \n background task params:  ', backgroundTaskParams)
  debugLogs && console.log('Background Service On:', BackgroundService.isRunning(), ' Every: ', backgroundTaskParams!.delay)

  for (let i = 0; BackgroundService.isRunning(); i++) {
    if (index !== iteration) {
      console.log('[This should stop the duplicate function] Stopping outdated background task', { index, iteration })
      return 
    }

    if (iterationCount >= 10) {
      const now = new Date()
      debugLogs && console.log(`[Time now]   : ${now.getHours()}:${now.getMinutes()} ${now.getSeconds()}s`)
      debugLogs && console.log(`[Reset Time] : ${nextResetTime.getHours()}:${nextResetTime.getMinutes()} ${nextResetTime.getSeconds()}s`)
      if (isAfter(now, nextResetTime)) {
        debugLogs && console.log(`[RESETTING...] :  ${now.getHours()}:${now.getMinutes()} ${now.getSeconds()}s`)
        await localStorage.resetTimers()
        nextResetTime = getNextResetTime() // Set next reset time for the following day
      }
      iterationCount = 0
    }
    iterationCount++

    const currentActivity = await fetchCurrentActivity()
    if (currentActivity === 'Screen Off!') {
      await sleep(backgroundTaskParams!.screenOffDelay)
      debugLogs && console.log('Screen Off. Waiting:', backgroundTaskParams!.screenOffDelay)
    } else {
      const trackedTimers = await localStorage.getDataByKey('@local_timers') as Timers // Fetch the latest timers from storage
      if (currentActivity in trackedTimers) {
        await trackedTimerHandler(trackedTimers, currentActivity, backgroundTaskParams!.delay)
        if (!userAlerted) {
          await notifications.timeLeft(trackedTimers[currentActivity].timeLeft!)
          userAlerted = true
        }
      } else {
        // currentActivity NOT in localTimers
        await BackgroundService.updateNotification({
          taskTitle: 'ESC The Loop',
          taskDesc: 'Current task is not timed.',
          progressBar: undefined,
        })
      }
      debugLogs && console.log('Current Activity:', currentActivity, { index, iteration })
      await sleep(backgroundTaskParams!.delay)
    }
  }
}

export async function toggleBackground() {
  if (!BackgroundService.isRunning()) {
    try {
      iteration++
      const localOptions = await localStorage.getOptions()

      // Start the background service with the current iteration
      // Bind the iteration to ensure the background task stops correctly if it's outdated
      await BackgroundService.start(backgroundTimerTask.bind(null, iteration), localOptions)

      if (debugLogs) console.log('Successful start!')
    } catch (e) {
      if (debugLogs) console.log('Error', e)
    }
    return true
  } else {
    try {
      if (debugLogs) console.log('Stop background service')
      await BackgroundService.stop()
    } catch (e) {
      if (debugLogs) console.log('Error', e)
    }
    return false
  }
}




