import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../globalStyles'
import Title from '../components/TitleElement'
import Esc from '../components/EscElement'
import BrutalButton from '../components/BrutalButton'
import * as localStorage from '../services/LocalStorage'
// import Slider from '@react-native-community/slider'
// import Slider from '@react-native-community/slider'
import { Slider } from '@miblanchard/react-native-slider'
import * as activityService from '../services/ActivityService'
import { useFocusEffect } from '@react-navigation/native'
import { Options } from '../types'

import BackgroundService from 'react-native-background-actions'
import { backgroundTimerTask } from '../services/ActivityService'

export function Settings() {
  const [poolingRate, setPoolingRate] = useState<number>(1)
  const [escapeRate, setEscapeRate] = useState<number>(4)
  const [rotate, setRotate] = useState(false)
  const [customOptions, setCustomOptions] = useState<Options | null>(null)
  const [restartGuard, setRestartGuard] = useState(true)
  const [triggerRestart, setTriggerRestart] = useState(0)
  function handleRotate() {
    if (BackgroundService.isRunning()) {
      setRotate(true)
    } else {
      setRotate(false)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      console.log('[Settings Screen]')
      setRestartGuard(true)
      handleRotate()
      async function loadOptions() {
        //TODO: We need to set the pooling rate and escape but without nessesary restarting the service
        // we want to restart the service only when we change these settings.
        // if we havent changed these settings we there is not reason to restart
        // think about that and see if we actually need to implement this, as its Nice to have, but would it effect the usage? possibly not..?

        // also just for the cool factor find a way to manage the handlerotate function properly, somehow hook the state of the backround to the rorating background

        //TODO: bugfix decrease the timer with pooling rate rather than with 2 everytime.
        // once thats done its time for end to end test it on your device

        const optionsReturned = await localStorage.getOptions()
        setCustomOptions(optionsReturned)
        setPoolingRate(optionsReturned.parameters.delay / 1000)
        setEscapeRate(optionsReturned.parameters.timerExpiredDelay / 1000)
      }
      loadOptions()
    }, [])
  )

  useEffect(() => {
    if (!restartGuard) {
      console.log('restart guard:', restartGuard)
      customOptions && localStorage.setOptions(customOptions)
      if (BackgroundService.isRunning()) {
        console.log('use effect, background running, we try to stop it:')
        activityService.toggleBackground()
      }
      setTimeout(() => {
        console.log('use effect, timeout we try to start it:')
        if (!BackgroundService.isRunning()) {
          activityService.toggleBackground()
        }
      }, 4000)
    }

    return () => {
      handleRotate()
      setRestartGuard(true)
    }
  }, [triggerRestart])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      console.log(`Pooling rate: ${poolingRate}, escapeRate:${escapeRate}`)
      setRestartGuard(false)
      setCustomOptions((prevOptions) => {
        if (!prevOptions) return null
        return {
          ...prevOptions, // Spread the previous options to maintain other properties
          parameters: {
            ...prevOptions.parameters, // Spread the previous parameters to maintain other properties
            delay: poolingRate * 1000, // Update the delay property
          },
        }
      })
    }, 700)
    return () => {
      clearTimeout(debounceTimer)
    }
  }, [poolingRate, escapeRate])

  function updatePoolingRate(value: number) {
    if (escapeRate < poolingRate) {
      setEscapeRate(poolingRate)
    }
    setPoolingRate(value)
    setTriggerRestart(prevState => prevState + 1)
  }

  async function onToggleBackground() {
    const backgroundState = await activityService.toggleBackground()
    setRotate(backgroundState)
  }

  async function onResetTimers() {
    await localStorage.resetTimers()
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
          Pooling Rate: {poolingRate}s
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
          Escape Rate: {escapeRate}s
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
})
