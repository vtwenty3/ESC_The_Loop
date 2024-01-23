import AsyncStorage from '@react-native-async-storage/async-storage'

interface Timers {
  [key: string]: { timeLeft?: number; timeSet?: number }
}

export type BackgroundTaskParams = {
  delay: number
  screenOffDelay: number
  timerExpiredDelay: number
}

const LOCAL_STORAGE_TIMERS = '@local_timers'
const LOCAL_STORAGE_NOTES = '@local_notes'
const LOCAL_STORAGE_TASKS = '@local_tasks'
const LOCAL_STORAGE_ACTIVITY_PARAMS = '@local_params'
const LOCAL_STORAGE_OPTIONS = '@local_options'

type Options = {
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

const defaultOptions: Options = {
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
    console.log('[LocalStorage.getOptions]: called.')
    if (jsonValue != null) {
      return JSON.parse(jsonValue)
    }
    return defaultOptions
  } catch (e) {
    console.log('Error fetching timers from storage; Details:', e)
    return defaultOptions
  }
}

export async function setOptions(options: any) {
  try {
    await AsyncStorage.setItem(LOCAL_STORAGE_OPTIONS, JSON.stringify(options))
    console.log('[LocalStorage.setOptions] called.')
  } catch (e) {
    console.log('error saving timers to storage; Details:', e)
  }
}

export async function getParams(): Promise<BackgroundTaskParams | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(LOCAL_STORAGE_ACTIVITY_PARAMS)
    console.log('[LocalStorage.getParams]: called.')
    return jsonValue != null ? JSON.parse(jsonValue) : null
  } catch (e) {
    console.log('Error fetching timers from storage; Details:', e)
    return null
  }
}

export async function setParams(params: BackgroundTaskParams) {
  try {
    await AsyncStorage.setItem(LOCAL_STORAGE_ACTIVITY_PARAMS, JSON.stringify(params))
    console.log('[LocalStorage.setParams] called.')
  } catch (e) {
    console.log('error saving timers to storage; Details:', e)
  }
}

export async function getTimers(): Promise<Timers> {
  try {
    const jsonValue = await AsyncStorage.getItem(LOCAL_STORAGE_TIMERS)
    // console.log('[LocalStorage.getTimers]: called.')
    return jsonValue != null ? JSON.parse(jsonValue) : {}
  } catch (e) {
    console.log('Error fetching timers from storage; Details:', e)
    return {}
  }
}

export async function setTimers(timers: Timers) {
  try {
    await AsyncStorage.setItem(LOCAL_STORAGE_TIMERS, JSON.stringify(timers))
    console.log('[LocalStorage.setTimers]: timers saved to storage.')
  } catch (e) {
    console.log('error saving timers to storage; Details:', e)
  }
}

export async function resetTimers() {
  const localTimers = await getTimers()
  if (localTimers !== null && Object.keys(localTimers).length > 0) {
    const updatedTimers = { ...localTimers }
    console.log('[resetTimers]: Timers before reset: ', updatedTimers)
    for (const key in updatedTimers) {
      updatedTimers[key].timeLeft = updatedTimers[key].timeSet
    }
    console.log('Updated Timers: ', updatedTimers)
    await setTimers(updatedTimers)
  } else {
    console.log('[resetTimers]: Local data empty! ')
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
    console.log('Done')
  } catch (e) {
    console.log('Erorr: ', e)
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
    console.log('Done')
  } catch (e) {
    console.log('Erorr: ', e)
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
    console.log('Done')
  } catch (e) {
    console.log('Erorr: ', e)
  }
}

export async function deleteAll() {
  try {
    await AsyncStorage.clear()
  } catch (e) {
    console.log('Erorr: ', e)
  }

  console.log('Done.')
}
