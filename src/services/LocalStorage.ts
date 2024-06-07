import AsyncStorage from '@react-native-async-storage/async-storage'
import { Options, Timers } from '../types'


const debugLogs = true //reload the app on change

const LOCAL_STORAGE_TIMERS = '@local_timers'
const LOCAL_STORAGE_NOTES = '@local_notes'
const LOCAL_STORAGE_TASKS = '@local_tasks'
const LOCAL_STORAGE_OPTIONS = '@local_options'


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

export async function getOptions(): Promise<Options> {
  try {
    const jsonValue = await AsyncStorage.getItem(LOCAL_STORAGE_OPTIONS)
    debugLogs && console.log('[LocalStorage.getOptions]: called.')
    if (jsonValue != null) {
      debugLogs && console.log('[LocalStorage.getOptions]: custom options returned:', jsonValue)
      return JSON.parse(jsonValue)
    }
    debugLogs && console.log('[LocalStorage.getOptions]: default options returned.')
    return defaultOptions
  } catch (e) {
    debugLogs && console.log('Error fetching timers from storage; Details:', e)
    return defaultOptions
  }
}

export async function setOptions(customOptions: Options) {
  try {
    await AsyncStorage.setItem(LOCAL_STORAGE_OPTIONS, JSON.stringify(customOptions))
    debugLogs && console.log('[LocalStorage.setOptions] called with these options:', customOptions)
  } catch (e) {
    debugLogs && console.log('error saving timers to storage; Details:', e)
  }
}


export async function getTimers(): Promise<Timers> {
  try {
    const jsonValue = await AsyncStorage.getItem(LOCAL_STORAGE_TIMERS)
    // debugLogs &&  console.log('[LocalStorage.getTimers]: called.')
    return jsonValue != null ? JSON.parse(jsonValue) : {}
  } catch (e) {
    debugLogs && console.log('Error fetching timers from storage; Details:', e)
    return {}
  }
}

export async function setTimers(timers: Timers) {
  try {
    await AsyncStorage.setItem(LOCAL_STORAGE_TIMERS, JSON.stringify(timers))
    debugLogs && console.log('[LocalStorage.setTimers]: timers saved to storage. : ', timers)
  } catch (e) {
    debugLogs && console.log('error saving timers to storage; Details:', e)
  }
}

export async function resetTimers() {
  const localTimers = await getTimers()
  if (localTimers !== null && Object.keys(localTimers).length > 0) {
    const updatedTimers = { ...localTimers }
    debugLogs && console.log('[resetTimers]: Timers before reset: ', updatedTimers)
    for (const key in updatedTimers) {
      updatedTimers[key].timeLeft = updatedTimers[key].timeSet
    }
    debugLogs && console.log('Updated Timers: ', updatedTimers)
    await setTimers(updatedTimers)
  } else {
    debugLogs && console.log('[resetTimers]: Local data empty! ')
  }
}

export async function deleteTimers() {
  try {
    await AsyncStorage.clear()
    const keys = [LOCAL_STORAGE_TIMERS]
    try {
      await AsyncStorage.multiRemove(keys)
    } catch (e) {
      // remove error
    }
    debugLogs && console.log('Done')
  } catch (e) {
    debugLogs && console.log('Erorr: ', e)
  }
}

export async function deleteNotes() {
  try {
    await AsyncStorage.clear()
    const keys = [LOCAL_STORAGE_NOTES]
    try {
      await AsyncStorage.multiRemove(keys)
    } catch (e) {
      // remove error
    }
    debugLogs && console.log('Done')
  } catch (e) {
    debugLogs && console.log('Erorr: ', e)
  }
}

export async function deleteTasks() {
  try {
    await AsyncStorage.clear()
    const keys = [LOCAL_STORAGE_TASKS]
    try {
      await AsyncStorage.multiRemove(keys)
    } catch (e) {
      // remove error
    }
    debugLogs && console.log('Done')
  } catch (e) {
    debugLogs && console.log('Erorr: ', e)
  }
}

export async function deleteAll() {
  try {
    await AsyncStorage.clear()
  } catch (e) {
    debugLogs && console.log('Erorr: ', e)
  }
  debugLogs && console.log('Done.')
}
