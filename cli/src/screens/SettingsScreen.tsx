import {ScrollView, StyleSheet, Text, View, Alert} from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../globalStyles'
import Title from '../components/TitleElement'
import Esc from '../components/EscElement'
import BrutalButton from '../components/BrutalButton'
import * as localStorage from '../services/LocalStorage'
import { Slider } from '@miblanchard/react-native-slider'
import * as activityService from '../services/ActivityService'
import { useFocusEffect } from '@react-navigation/native'
import BackgroundService from 'react-native-background-actions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Share from 'react-native-share'
import RNFS from 'react-native-fs'
import RNBlobUtil from 'react-native-blob-util'
import DocumentPicker from 'react-native-document-picker'

export function Settings() {
  const [poolingRate, setPoolingRate] = useState<number>(1)
  const [escapeRate, setEscapeRate] = useState<number>(4)
  const [rotate, setRotate] = useState(false)
  function handleRotate() {
    if (BackgroundService.isRunning()) {
      setRotate(true)
    } else {
      setRotate(false)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setRotate(BackgroundService.isRunning())
    }, 1000)
    return () => clearInterval(interval)
  }, [])


  async function loadOptions() {
    const options = await localStorage.getOptions()
    setPoolingRate(options.parameters.delay / 1000)
    setEscapeRate(options.parameters.timerExpiredDelay / 1000)
  }


  useFocusEffect(
    React.useCallback(() => {
      console.log('[Settings Screen]')
      handleRotate()
      loadOptions()
    }, [])
  )


  const handleExport = async () => {
    try {
      const jsonData = await localStorage.exportData()
      const path = `${RNFS.TemporaryDirectoryPath}/exportedData.json`

      await RNBlobUtil.fs.writeFile(path, jsonData, 'utf8')

      await Share.open({
        url: `file://${path}`,
        title: 'Export Data',
        filename: 'data.json',
        type: 'application/json',
        subject: 'Backup of your data', // for email
      })

      // Optionally, clean up the temporary file after sharing
      await RNBlobUtil.fs.unlink(path)
    } catch (error) {
      console.error('Error while exporting data:', error)
      Alert.alert('Export Error', 'There was an error while exporting your data.')
    }
  }

  const handleImport = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.json],
      })

      await localStorage.importData(res[0].uri)

      Alert.alert('Success', 'Data imported successfully')
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err
      }
    }
  }


  function updatePoolingRate(value: number) {
    if (escapeRate < poolingRate) {
      setEscapeRate(poolingRate)
    }
    setPoolingRate(value)
  }


  //Todo: Refactor so this is executed onyl once even if pressed several times, like debouncer
  async function onToggleBackground() {
    const backgroundState = await activityService.toggleBackground()
    setRotate(backgroundState)
  }

  async function onResetTimers() {
    await localStorage.resetTimers()
  }

  // Restarts the background service if it is running, and sets a 5-second timeout to ensure it has restarted successfully
  async function restartBackgroundService() {
    if (BackgroundService.isRunning()) {
      activityService.toggleBackground()
    } else { return }
    setTimeout(() => {
      if (!BackgroundService.isRunning()) {
        activityService.toggleBackground()
      }
    }, 5000)
  }

  //  restarts starts, applies the options, restarts finishes
  async function onOptionsApply() {
    restartBackgroundService()
    const options = await localStorage.getOptions()
    options.parameters.delay = poolingRate * 1000
    await localStorage.setDataByKey('@local_options', options)
  }

  async function onOptionsReset() {
    restartBackgroundService()
    const options = await localStorage.getOptions()
    options.parameters = localStorage.defaultOptions.parameters
    await localStorage.setDataByKey('@local_options', options)
    loadOptions()
  }


  return (
    <View  style={[globalStyles.root]}>
      <View style={[globalStyles.header]}>
        <View style={[globalStyles.headerChildren]}>
          <Esc onPress={() => console.log('Esc')} />
          <Title text={'Settings'} fontFamily={'Lexend-Medium'} fontSize={40} />
        </View>
      </View>
      <View className='flex-1 px-6 w-full'>
        <View style={{gap:10}} className='flex-row absolute top-0 w-full self-center z-30 -mt-7' >
          <View className='w-full'>
            <BrutalButton text="Background Task" iconName="sync" color="#FF6B6B" rotate={rotate} onPress={onToggleBackground} />
          </View>
          {/*<View className='w-1/2'>*/}
          {/*  <BrutalButton iconName="timer-sand" text="Reset Timers" onPress={onResetTimers} />*/}
          {/*</View>*/}
        </View>
        <ScrollView contentContainerStyle={{rowGap: 15, paddingBottom: 20}} >
          <Text
            style={{
              fontFamily: 'Lexend-Medium',
              fontSize: 12,
              color: 'black',
              alignSelf: 'flex-end',
              marginTop: 50,
            }}
          >
          Background Update Interval: every {poolingRate}s
          </Text>
          <Slider
            animateTransitions
            minimumTrackTintColor="black"
            onSlidingComplete={(value) => updatePoolingRate(value[0])}
            onValueChange={(value) => setPoolingRate(value[0])}
            thumbStyle={styles.thumb}
            trackStyle={styles.track}
            value={poolingRate}
            minimumValue={1}
            maximumValue={8}
            step={1}
          />

          <Text
            style={{
              fontFamily: 'Lexend-Medium',
              fontSize: 12,
              color: 'black',
              alignSelf: 'flex-end',
            }}
          >
          Escape Notification Interval: every {escapeRate}s
          </Text>
          <Slider
            animateTransitions
            minimumTrackTintColor="black"
            onSlidingComplete={(value2) => setEscapeRate(value2[0])}
            onValueChange={(value2) => setEscapeRate(value2[0])}
            value={escapeRate}
            thumbStyle={styles.thumb}
            trackStyle={styles.track}
            minimumValue={Math.max(poolingRate, 4)}
            maximumValue={60}
            step={4}
          />
          <View className='flex-row w-full items-center z-30'>
            <View className='w-1/2'>
              <BrutalButton color="#FF6B6B" iconName="content-save-off" text="Reset" onPress={onOptionsReset} />
            </View>
            <View className='w-1/2'>
              <BrutalButton iconName="content-save-cog" text="Apply" onPress={onOptionsApply} />
            </View>
          </View>

          <BrutalButton iconName="timer-sand-empty" color="#FF6B6B" text="Delete All Timers" onPress={()=>localStorage.deleteKey('@local_timers')} />
          <BrutalButton iconName="database-export-outline" text="Export Data"  onPress={handleExport} />
          <BrutalButton iconName="database-import-outline" text="Import Data" onPress={handleImport} />
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  thumb: {
    backgroundColor: '#9723C9',
    borderColor: 'black',
    borderRadius: 60,
    borderWidth: 3,
    height: 30,
    width: 30,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.35,
    shadowRadius: 2,
  },
  track: {
    backgroundColor: 'black',
    borderRadius: 4,
    height: 4,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1,
  },
})
