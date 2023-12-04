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
