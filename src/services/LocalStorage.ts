import AsyncStorage from '@react-native-async-storage/async-storage'
import { Note, Options, Task, Timers } from '../types'
// import RNFS from 'react-native-fs'


const debugLogs = true //reload the app on change


type LocalStorageKeys =
  | '@local_timers'
  | '@local_notes'
  | '@local_tasks'
  | '@local_options'

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
    const jsonValue = await AsyncStorage.getItem('@local_options')
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



export async function getDataByKey(key: LocalStorageKeys): Promise<Timers| Note | Task | undefined > {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? await JSON.parse(jsonValue) : null
  } catch (e) {
    console.error(' Error loading data for: ',key,  e)
  }
}

export async function setDataByKey(key: LocalStorageKeys, data: Timers | Note[] | Task[] | Options ) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data))
    debugLogs && console.log(`[LocalStorage.setDataByKey]: ${key} saved to storage.`)
  } catch (e) {
    debugLogs && console.error(`error saving ${key} to storage; Details:`, e)
  }
}



export async function resetTimers() {
  const localTimers = await getDataByKey('@local_timers') as Timers
  if (localTimers !== null && Object.keys(localTimers).length > 0) {
    const updatedTimers = { ...localTimers }
    debugLogs && console.log('[resetTimers]: Timers before reset: ', updatedTimers)
    for (const key in updatedTimers) {
      updatedTimers[key].timeLeft = updatedTimers[key].timeSet
    }
    debugLogs && console.log('Updated Timers: ', updatedTimers)
    await setDataByKey('@local_timers', updatedTimers)
  } else {
    debugLogs && console.log('[resetTimers]: Local data empty! ')
  }
}

export async function deleteKey(key: LocalStorageKeys): Promise<void> {
  try {
    await AsyncStorage.clear()
    try {
      await AsyncStorage.multiRemove([key])
    } catch (e) {
      debugLogs && console.log('Erorr: ', e)
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


export async function exportData() {
  try {
    const timers = await getDataByKey('@local_timers') as Timers
    const notes = await getDataByKey('@local_notes') as Note
    const tasks = await getDataByKey('@local_tasks') as Task
    const options = await getOptions()
    const allData = {
      timers,
      notes: notes ? JSON.parse(notes) : null,
      tasks: tasks ? JSON.parse(tasks) : null,
      options,
    }
    return JSON.stringify(allData) // Serialize the JSON data
  } catch (error) {
    console.error('Error exporting data:', error)
    throw error // Rethrow the error to be handled by the caller
  }
}

export async function importData(filePath: string) {
  try {
    // // Read the file
    // const jsonString = await RNFS.readFile(filePath, 'utf8')
    //
    // // Parse the JSON
    // const importedData = JSON.parse(jsonString)
    //
    // // Save the data to AsyncStorage
    // if (importedData.timers) await setTimers(importedData.timers)
    // if (importedData.notes) await AsyncStorage.setItem(LOCAL_STORAGE_NOTES, JSON.stringify(importedData.notes))
    // if (importedData.tasks) await AsyncStorage.setItem(LOCAL_STORAGE_TASKS, JSON.stringify(importedData.tasks))
    // if (importedData.options) await setOptions(importedData.options)
    //
    // console.log('Data imported successfully')
  } catch (error) {
    console.error('Error importing data:', error)
    throw error
  }
}