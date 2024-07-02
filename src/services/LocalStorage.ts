import AsyncStorage from '@react-native-async-storage/async-storage'
import { Options, Timers } from '../types'
import RNFS from 'react-native-fs'


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

// export async function exportData() {
//   try {
//     const notes = await AsyncStorage.getItem(LOCAL_STORAGE_NOTES)
//     const tasks = await AsyncStorage.getItem(LOCAL_STORAGE_TASKS)
//     const options = await AsyncStorage.getItem(LOCAL_STORAGE_OPTIONS)
//
//     const data = {
//       notes: notes ? JSON.parse(notes) : {},
//       tasks: tasks ? JSON.parse(tasks) : {},
//       options: options ? JSON.parse(options) : defaultOptions,
//     }
//
//     const path = RNFS.DocumentDirectoryPath + '/appData.json'
//     await RNFS.writeFile(path, JSON.stringify(data), 'utf8')
//
//     debugLogs && console.log('Data exported successfully to: ' + path)
//     return path
//   } catch (e) {
//     debugLogs && console.log('Error exporting data: ', e)
//   }
// }




export async function importData(filePath:any) {
  try {
    // Read the file
    const jsonString = await RNFS.readFile(filePath, 'utf8')

    // Parse the JSON
    const importedData = JSON.parse(jsonString)

    // Save the data to AsyncStorage
    if (importedData.timers) await setTimers(importedData.timers)
    if (importedData.notes) await AsyncStorage.setItem(LOCAL_STORAGE_NOTES, JSON.stringify(importedData.notes))
    if (importedData.tasks) await AsyncStorage.setItem(LOCAL_STORAGE_TASKS, JSON.stringify(importedData.tasks))
    if (importedData.options) await setOptions(importedData.options)

    console.log('Data imported successfully')
  } catch (error) {
    console.error('Error importing data:', error)
    throw error
  }
}

export async function exportData() {
  try {
    // Fetch all data
    const timers = await getTimers()
    const notes = await AsyncStorage.getItem(LOCAL_STORAGE_NOTES)
    const tasks = await AsyncStorage.getItem(LOCAL_STORAGE_TASKS)
    const options = await getOptions()

    // Combine all data into one object
    const exportData = {
      timers,
      notes: notes ? JSON.parse(notes) : null,
      tasks: tasks ? JSON.parse(tasks) : null,
      options
    }

    // Convert to JSON string
    const jsonString = JSON.stringify(exportData)

    // Get the default directory for documents
    const path = RNFS.DocumentDirectoryPath + '/appData.json'

    // Write the file
    await RNFS.writeFile(path, jsonString, 'utf8')

    console.log('Data exported successfully to:', path)
    return path
  } catch (error) {
    console.error('Error exporting data:', error)
    throw error
  }
}


// export async function importData(filePath:any) {
//   try {
//     const data = await RNFS.readFile(filePath, 'utf8')
//     const parsedData = JSON.parse(data)
//
//     // await AsyncStorage.setItem(LOCAL_STORAGE_TIMERS, JSON.stringify(parsedData.timers));
//     await AsyncStorage.setItem(LOCAL_STORAGE_NOTES, JSON.stringify(parsedData.notes))
//     await AsyncStorage.setItem(LOCAL_STORAGE_TASKS, JSON.stringify(parsedData.tasks))
//     await AsyncStorage.setItem(LOCAL_STORAGE_OPTIONS, JSON.stringify(parsedData.options))
//
//     debugLogs && console.log('Data imported successfully from: ' + filePath)
//   } catch (e) {
//     debugLogs && console.log('Error importing data: ', e)
//   }
// }
