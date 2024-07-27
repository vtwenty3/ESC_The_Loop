import React, {useEffect, useState} from 'react'
import { AppState, AppStateStatus, FlatList, Linking, NativeModules,  View } from 'react-native'

import BackgroundService from 'react-native-background-actions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import notifee, {EventType} from '@notifee/react-native'
import {globalStyles} from '../globalStyles'
import {ModalSetTimer} from '../components/ModalSetTimer'
import Title from '../components/TitleElement'
import Esc from '../components/EscElement'
import UsageElement from '../components/UsageElement'
import PermissionsScreen from '../screens/PermissionsScreen'
import * as localStorage from '../services/LocalStorage'
import * as activityService from '../services/ActivityService'
import {useFocusEffect} from '@react-navigation/native'
import {AppUsageData, Timers} from '../types'

const { UsageLog } = NativeModules as {
  UsageLog: {
    currentActivity: () => Promise<string>
    getUsageStats: (callback: (callBackData: string) => void) => void
  }
}

export function Usage() {
  const [data, setData] = useState<AppUsageData[] | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [timersRN, setTimersRN] = useState<Timers>({})
  const [modalAppName, setModalAppName] = useState('')
  const [modalPackageName, setModalPackageName] = useState('')
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState)



  function setAppUsageData() {
    console.log('Getting data from Android')
    UsageLog.getUsageStats((androidUsageData: string) => {
      const parsedData: AppUsageData[] = JSON.parse(androidUsageData)
      parsedData.sort((a, b) => b.usageTimeSeconds - a.usageTimeSeconds)
      setData(parsedData)
    })
  }


  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', handleAppStateChange)
    if (!BackgroundService.isRunning()) {
      activityService.toggleBackground()
    }
    setAppUsageData()
    return () => {
      // Remove AppState listener
      appStateListener.remove()
    }
  }, [appState])

  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', handleAppStateChange)
    if (!BackgroundService.isRunning()) {
      activityService.toggleBackground()
    }
    setAppUsageData()
    return () => {
      // Remove AppState listener
      appStateListener.remove()
    }
  }, [appState])

  //Do not remove the code duplication above, this hook executes on focusing the current screen
  useFocusEffect(
    React.useCallback(() => {
      const loadTimers = async () => {
        const loadedTimers = await localStorage.getDataByKey('@local_timers')
        setTimersRN(loadedTimers ?? {})
      }
      setAppUsageData()
      loadTimers()
    }, [])
  )

  useEffect(() => {
    const updateTimers = async () => {
      await localStorage.setDataByKey('@local_timers', timersRN)
    }
    updateTimers()
  }, [timersRN])

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    console.log('[handleAppStateChange]')
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      const localTimers = await localStorage.getDataByKey('@local_timers') as Timers
      setTimersRN(localTimers)
    }
    try {
      await AsyncStorage.setItem('@appState', nextAppState)
    } catch (e) {
      console.error('Error saving app state:', e)
    }
    setAppState(nextAppState)
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
              <FlatList
                data={data}
                contentContainerStyle={{ gap: 10, paddingTop: 20 }}
                keyExtractor={(item) => item.appName}
                renderItem={({ item }) => (
                  <UsageElement item={item}  setTimers={setTimersRN}
                    timer={timersRN[item.packageName]} modalVisible={modalVisible} onOpenModal={handleOpenModal}   />
                )}
              />
              {modalVisible ? (
                <ModalSetTimer
                  setVisible={setModalVisible}
                  name={modalAppName}
                  packageName={modalPackageName}
                  setTimers={setTimersRN}
                  timers={timersRN}
                />
              ) : null}

              {/*<CustomModal visible={addTimeModal} onClose={handleClose}>*/}
              {/*  <Text>Timer for: idk</Text>*/}
              {/*  /!* Add more components here *!/*/}
              {/*  /!*<BrutalButton onPress={handleClose} text="Close" color="#FF6B6B" iconName="close-circle-outline" />*!/*/}
              {/*</CustomModal>*/}
            </View>
          </View>
        </>
      )}
    </>
  )
}
