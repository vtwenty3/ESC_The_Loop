import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, NativeModules, AppState, AppStateStatus, Linking } from 'react-native'

import { useFocusEffect } from '@react-navigation/native'
import BackgroundService from 'react-native-background-actions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import notifee, { EventType } from '@notifee/react-native'
import { differenceInSeconds, isAfter, setHours, setMinutes, setSeconds, startOfTomorrow } from 'date-fns'

import { globalStyles } from '../globalStyles'

import { ModalSetTimer } from '../components/ModalSetTimer'
import Title from '../components/TitleElement'
import Esc from '../components/EscElement'
import UsageElement from '../components/UsageElement'
import BrutalButton from '../components/BrutalButton'
import PermissionsScreen from '../screens/PermissionsScreen'

import * as localStorage from '../services/LocalStorage'
import * as activityService from '../services/ActivityService'
import * as notifications from '../services/Notifications'

const { UsageLog } = NativeModules as {
  UsageLog: {
    currentActivity: () => Promise<string>
    getAppUsageData2: (callback: (callBackData: string) => void) => void
  }
}

interface Timers {
  [key: string]: { timeLeft?: number; timeSet?: number }
}

type BackgroundTaskParams = {
  delay: number
  screenOffDelay: number
  timerExpiredDelay: number
}

const options = {
  taskName: 'Background Service',
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
const sleep = (time: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), time))

async function backgroundTimerTask(backgroundTaskParams: BackgroundTaskParams) {
  let userAlerted = false
  let nextResetTime = getNextResetTime()
  let iterationCount = 0
  console.log('Background Service On:', BackgroundService.isRunning(), ' Every: ', backgroundTaskParams.delay)

  for (let i = 0; BackgroundService.isRunning(); i++) {
    if (iterationCount >= 2) {
      const now = new Date()
      console.log('Time now:', now)
      console.log('Reset Time:', nextResetTime)

      // Check if it's time to reset timers
      if (isAfter(now, nextResetTime)) {
        console.log('Trying to reset:', now)
        await localStorage.resetTimers()
        nextResetTime = getNextResetTime() // Set next reset time for the following day
      }

      iterationCount = 0 // Reset the counter
    }
    iterationCount++

    const currentActivity = await activityService.fetchCurrentActivity()
    if (currentActivity === 'Screen Off!') {
      await sleep(backgroundTaskParams.screenOffDelay)
      console.log('Screen Off. Waiting:', backgroundTaskParams.screenOffDelay)
    } else {
      const trackedTimers = await localStorage.getTimers() // Fetch the latest timers from storage
      if (currentActivity in trackedTimers) {
        await activityService.trackedTimerHandler(trackedTimers, currentActivity, backgroundTaskParams.delay)
        if (!userAlerted) {
          await notifications.timeLeft(trackedTimers[currentActivity].timeLeft!)
          userAlerted = true
        }
      } else {
        // currentActivity NOT in localTimers
        // find a way to remove this notification
        await BackgroundService.updateNotification({
          taskTitle: 'ESC The Loop',
          taskDesc: 'Current task is not timed.',
          progressBar: undefined,
        })
      }
      // console.log('Current Activity:', currentActivity)
      await sleep(backgroundTaskParams.delay)
    }
  }
}

function getNextResetTime() {
  const now = new Date()
  let resetTime = setHours(setMinutes(setSeconds(now, 0), 35), 23) // Set to today's 11:25 PM
  if (isAfter(now, resetTime)) {
    resetTime = startOfTomorrow() // If it's past today's 12 AM, set to tomorrow's 12 AM
  }
  console.log('Next reset time:', resetTime)

  return resetTime
}

export function Usage() {
  const [data, setData] = useState<AppUsageData[] | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [timersRN, setTimersRN] = useState<Timers>({})
  const [modalAppName, setModalAppName] = useState('')
  const [modalPackageName, setModalPackageName] = useState('')
  const [rotate, setRotate] = useState(false)
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState)

  type AppUsageData = {
    appName: string
    iconBase64: string
    packageName: string
    usageTimeMinutes: number
    usageTimeSeconds: number
  }

  //Gets the usage data from the native module on app open
  useEffect(() => {
    if (!data?.length) {
      getUsageData()
    }
    const subscription = AppState.addEventListener('change', handleAppStateChange)

    return () => {
      // Remove AppState listener
      subscription.remove()
    }
  }, [appState])

  //checks if timers state is empty and if so, fetches local data
  useEffect(() => {
    const loadTimers = async () => {
      const loadedTimers = await localStorage.getTimers()
      setTimersRN(loadedTimers)
    }
    loadTimers()
  }, [])

  useEffect(() => {
    const updateTimers = async () => {
      await localStorage.setTimers(timersRN)
    }
    updateTimers()
  }, [timersRN])

  async function resetTimers() {
    await localStorage.resetTimers()
    await initTimerState()
  }

  async function initTimerState(): Promise<void> {
    const localTimers = await localStorage.getTimers()
    if (localTimers !== null && Object.keys(localTimers).length > 0) {
      setTimersRN(localTimers)
      console.log('[initTimerState]:localTimers Found!')
    } else {
      setTimersRN({})
      console.log('[initTimerState]:localTimers empty! ')
    }
  }

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    console.log('[handleAppStateChange]')
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      getUsageData()
      await initTimerState()
    }
    try {
      await AsyncStorage.setItem('@appState', nextAppState)
    } catch (e) {
      console.error('Error saving app state:', e)
    }
    setAppState(nextAppState)
  }

  const toggleBackground = async () => {
    if (!BackgroundService.isRunning()) {
      try {
        console.log('Trying to start background service')
        await BackgroundService.start((taskData) => backgroundTimerTask(taskData!), options)
        setRotate(true)
        console.log('Successful start!')
      } catch (e) {
        console.log('Error', e)
      }
    } else {
      try {
        console.log('Stop background service')
        await BackgroundService.stop()
        setRotate(false)
      } catch (e) {
        console.log('Error', e)
      }
    }
  }

  async function getUsageData() {
    console.log('Getting data from Android')
    if (BackgroundService.isRunning()) {
      setRotate(true)
    } else {
      await toggleBackground()
    }

    UsageLog.getAppUsageData2((callBack: string) => {
      const parsedData: AppUsageData[] = JSON.parse(callBack)
      parsedData.sort((a, b) => b.usageTimeSeconds - a.usageTimeSeconds)
      setData(parsedData)
    })
  }

  notifee.onBackgroundEvent(async ({ type }) => {
    if (type === EventType.PRESS) {
      console.log('Background Press action')
      await Linking.openURL('escapetheloop://tasks')
    }
  })

  const handleOpenModal = (appName: string, packageName: string) => {
    setModalAppName(appName)
    setModalPackageName(packageName)
    setModalVisible(true)
  }
  return (
    <>
      {!data?.length ? (
        <PermissionsScreen />
      ) : (
        <>
          <View style={[globalStyles.root]}>
            <View style={[globalStyles.header]}>
              <View style={[globalStyles.headerChildren]}>
                <Esc onPress={() => console.log('Esc')} />
                <Title text={'Usage'} fontFamily={'Lexend-Medium'} fontSize={40} />
              </View>
            </View>
            <View style={[globalStyles.body]}>
              <View style={styles.buttonsContainer}>
                <View style={styles.brutalButton}>
                  <BrutalButton text="Background" iconName="sync" color="#FF6B6B" rotate={rotate} onPress={toggleBackground} />
                </View>
                <View style={styles.brutalButton}>
                  <BrutalButton iconName="timer-sand" text="Reset Timers" onPress={resetTimers} />
                </View>
              </View>
              <FlatList
                data={data}
                contentContainerStyle={{ paddingTop: 45, gap: 10 }}
                keyExtractor={(item) => item.appName}
                renderItem={({ item }) => (
                  <UsageElement onOpenModal={handleOpenModal} timers={timersRN} item={item} modalVisible={modalVisible} />
                )}
              />
              <ModalSetTimer
                setVisible={setModalVisible}
                visible={modalVisible}
                name={modalAppName}
                packageName={modalPackageName}
                setTimers={setTimersRN}
                timers={timersRN}
              />
            </View>
          </View>
        </>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    width: '90%',
    paddingLeft: 3,
    alignSelf: 'center',
    top: 0,
    marginTop: -20,
    justifyContent: 'space-between',
    zIndex: 3,
  },
  brutalButton: {
    width: '48%',
  },
})
