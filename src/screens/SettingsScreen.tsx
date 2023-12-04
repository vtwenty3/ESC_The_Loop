import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { globalStyles } from '../globalStyles'
import Title from '../components/TitleElement'
import Esc from '../components/EscElement'
import BrutalButton from '../components/BrutalButton'
import * as localStorage from '../services/LocalStorage'
// import Slider from '@react-native-community/slider'
// import Slider from '@react-native-community/slider'
import { Slider } from '@miblanchard/react-native-slider'
//TODO: Add the state to local storage and use local storage for the params.
export function Settings() {
  const [poolingRate, setPoolinRate] = useState<number>(4)
  const [escapeRate, setEscapeRate] = useState<number>(8)
  function updatePoolingRate(value: number) {
    if (escapeRate < poolingRate) {
      setEscapeRate(poolingRate)
    }
    setPoolinRate(value)
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
        <Text
          style={{
            fontFamily: 'Lexend-Black',
            fontSize: 34,
            color: 'black',
            alignSelf: 'center',
            textAlign: 'center',
          }}
        >
          Under Construction
        </Text>
        <Text
          style={{
            fontFamily: 'Lexend-Medium',
            fontSize: 12,
            color: 'black',
            alignSelf: 'flex-end',
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
})
