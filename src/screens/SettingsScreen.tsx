import { StyleSheet, Text, View } from 'react-native'
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
    await localStorage.setOptions(options)
  }

  async function onOptionsReset() {
    restartBackgroundService()
    const options = await localStorage.getOptions()
    options.parameters = localStorage.defaultOptions.parameters
    await localStorage.setOptions(options)
    loadOptions()
  }


  return (
    <View style={[globalStyles.root]}>
      <View style={[globalStyles.header]}>
        <View style={[globalStyles.headerChildren]}>
          <Esc onPress={() => console.log('Esc')} />
          <Title text={'Settings'} fontFamily={'Lexend-Medium'} fontSize={40} />
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.buttonsContainer}>
          <View style={styles.brutalButton}>
            <BrutalButton text="Background" iconName="sync" color="#FF6B6B" rotate={rotate} onPress={onToggleBackground} />
          </View>
          <View style={styles.brutalButton}>
            <BrutalButton iconName="timer-sand" text="Reset Timers" onPress={onResetTimers} />
          </View>
        </View>

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
        <View style={styles.applyButtonContainer}>
          <View style={styles.brutalButton}>
            <BrutalButton color="#FF6B6B" iconName="content-save-off" text="Reset" onPress={onOptionsReset} />
          </View>
          <View style={styles.brutalButton}>
            <BrutalButton iconName="content-save-cog" text="Apply" onPress={onOptionsApply} />
          </View>
        </View>

        <BrutalButton iconName="timer-sand-empty" color="#FF6B6B" text="Delete All Timers" onPress={localStorage.deleteTimers} />
        <BrutalButton
          color="#FF6B6B"
          iconName="delete-circle-outline"
          text="Delete All Data"
          iconSize={30}
          onPress={localStorage.deleteAll}
        />
        <BrutalButton text="Delete All Notes" color="#FF6B6B" onPress={localStorage.deleteNotes} iconName="note-off-outline" />
        <BrutalButton iconName="checkbox-blank-off-outline" color="#FF6B6B" text="Delete All Tasks" onPress={localStorage.deleteTasks} />
        <BrutalButton iconName="database-export-outline" text="Export Data" onPress={() => console.log('Hi')} />
        <BrutalButton iconName="database-import-outline" text="Import Data" onPress={() => console.log('Hi')} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    width: '80%',
    gap: 10,
  },
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
  buttonsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    width: '100%',
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
  applyButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingBottom: 20,
    zIndex: 3,
  },
})
