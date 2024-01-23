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
import BackgroundService from 'react-native-background-actions'
import { backgroundTimerTask } from './UsageScreen'
//TODO: Move the reset timers from USageSCreen to here
// When everything is moved from USage Screen clean it up
// Then refactor the code below so we modify the options directly setting the
// params so we can set pooling rate and escape rate and reflect it - e.g.
// we need to restart the background in order for the new options to take effect
// also think about unifying the names  - pooling rate and delay; screenOffDelay and escape rate..
// Add the state to local storage and use local storage for the params.

export function Settings() {
  const [poolingRate, setPoolinRate] = useState<number>(4)
  const [escapeRate, setEscapeRate] = useState<number>(8)
  const [rotate, setRotate] = useState(false)

  function updatePoolingRate(value: number) {
    if (escapeRate < poolingRate) {
      setEscapeRate(poolingRate)
    }
    setPoolinRate(value)
  }
  //debounce, executes only if pooling rate hasnt changd for 1s

  // async function initParams() {
  //   const params = await localStorage.getParams()
  //   if (params) {
  //     localStorage.options.parameters = params
  //     console.log('[initParams]  custom')
  //     // return params
  //   } else {
  //     console.log('[initParams]  default')
  //   }
  //   // return defaultParams
  // }
  const toggleBackground = async () => {
    if (!BackgroundService.isRunning()) {
      try {
        console.log('Trying to start background service')
        const options = await localStorage.getOptions()
        await BackgroundService.start((taskData) => backgroundTimerTask(taskData!), options!)
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

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      console.log(`Pooling rate changed to: ${poolingRate}`)
      localStorage.setParams({ delay: poolingRate * 1000, screenOffDelay: 2, timerExpiredDelay: escapeRate * 1000 })
    }, 1000)

    return () => {
      clearTimeout(debounceTimer)
    }
  }, [poolingRate, escapeRate])

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
            <BrutalButton text="Background" iconName="sync" color="#FF6B6B" rotate={rotate} onPress={toggleBackground} />
          </View>
          <View style={styles.brutalButton}>
            <BrutalButton iconName="timer-sand" text="Reset Timers" onPress={() => console.log('you gotta move reset timers')} />
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
          onValueChange={(value) => setPoolinRate(value[0])}
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
