import AsyncStorage from '@react-native-async-storage/async-storage'
import { Note, Options, Task, Timers } from '../types'
import RNFS from 'react-native-fs'
// import RNFS from 'react-native-fs'


const debugLogs = true //reload the app on change


type LocalStorageKeys =
  | '@local_timers'
  | '@local_notes'
  | '@local_tasks'
  | '@local_options'

export type StorageValueMap = {
  '@local_timers': Timers;
  '@local_notes': Note[];
  '@local_tasks': Task[];
  '@local_options': Options;
};

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



export async function getDataByKey<K extends LocalStorageKeys>(key: K): Promise<StorageValueMap[K] | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? await JSON.parse(jsonValue) : null
  } catch (e) {
    console.error('Error loading data for: ', key, e)
    return null
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
    const timers = await getDataByKey('@local_timers')
    const notes = await getDataByKey('@local_notes')
    const tasks = await getDataByKey('@local_tasks')
    const options = await getOptions()
    const allData = {
      timers,
      notes,
      tasks,
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
    // Read the file
    const jsonString = await RNFS.readFile(filePath, 'utf8')
    console.log('File content:', jsonString)

    // Parse the JSON
    const importedData = JSON.parse(jsonString)
    console.log('Parsed data:', importedData)

    // Save the data to AsyncStorage
    if (importedData.timers) {
      await setDataByKey('@local_timers', importedData.timers)
      console.log('Timers imported successfully')
    }
    if (importedData.notes) {
      await setDataByKey('@local_notes', importedData.notes)
      console.log('Notes imported successfully', importedData.notes)
      console.log(await  getDataByKey('@local_notes'))
    }
    if (importedData.tasks) {
      await setDataByKey('@local_tasks', importedData.tasks)
      console.log('Tasks imported successfully')
    }
    if (importedData.options) {
      await setDataByKey('@local_options', importedData.options)
      console.log('Options imported successfully')
    }
  } catch (error) {
    console.error('Error importing data:', error)
    throw error
  }
}