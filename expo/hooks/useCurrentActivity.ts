import {Parameters, Options, Timers} from '@/hooks/types'
import BackgroundService from 'react-native-background-actions'
import { isAfter, setHours, setMinutes, setSeconds, startOfTomorrow } from 'date-fns'
import { currentActivity } from '@/modules/usage-stats';


const debugLogs = true //reload the app on change


// Fetch the current activity
export async function fetchCurrentActivity() {
  try {
    return await currentActivity()
  } catch (error) {
    debugLogs && console.error('Failed to get current activity:', error)
    return 'default' // or handle this scenario differently
  }
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
//   let userAlerted = false
  let iterationCount = 0
//   const localOptions = await localStorage.getOptions()

//   debugLogs && console.log('\n \n local background options:  ', localOptions)
  debugLogs && console.log('\n \n background task params:  ', backgroundTaskParams)
  debugLogs && console.log('Background Service On:', BackgroundService.isRunning(), ' Every: ', backgroundTaskParams!.delay)

  for (let i = 0; BackgroundService.isRunning(); i++) {
    if (index !== iteration) {
      console.log('[This should stop the duplicate function] Stopping outdated background task', { index, iteration })
      return 
    }
    iterationCount++

    const currentActivity = await fetchCurrentActivity()
    if (currentActivity === 'Screen Off!') {
      await sleep(backgroundTaskParams!.screenOffDelay)
      debugLogs && console.log('Screen Off. Waiting:', backgroundTaskParams!.screenOffDelay)
    } else {
    //   const trackedTimers = await localStorage.getDataByKey('@local_timers') as Timers // Fetch the latest timers from storage
    BackgroundService.updateNotification({
        taskTitle: 'ESC The Loop',
        taskDesc: 'Current task is not timed.',
        progressBar: undefined,
      })
      debugLogs && console.log('Current Activity:', currentActivity, { index, iteration })
      await sleep(backgroundTaskParams!.delay)
    }
  }
}

export const defaultOptions: Options = {
    taskName: 'ESC The Loop Background Service',
    taskTitle: 'ESC The Loop',
    taskDesc: 'Current task is not timed.',
  
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
  
    linkingURI: 'escapetheloop://',
  
    parameters: {
      delay: 2000,
      screenOffDelay: 10000,
      timerExpiredDelay: 10000,
    },
  }

export async function toggleBackground() {
  if (!BackgroundService.isRunning()) {
    try {
      iteration++
    //   const localOptions = await localStorage.getOptions()

      // Start the background service with the current iteration
      // Bind the iteration to ensure the background task stops correctly if it's outdated
      await BackgroundService.start(backgroundTimerTask.bind(null, iteration), defaultOptions)

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




