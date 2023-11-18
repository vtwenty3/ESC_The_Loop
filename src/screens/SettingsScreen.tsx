import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { globalStyles } from '../globalStyles'
import Title from '../components/TitleElement'
import Esc from '../components/EscElement'
import BrutalButton from '../components/BrutalButton'
import * as localStorage from '../services/LocalStorage'

export function Settings() {
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

        <BrutalButton
          iconName="timer-sand-empty"
          color="#FF6B6B"
          text="Delete All Timers"
          onPress={localStorage.deleteTimers}
        />
        <BrutalButton
          color="#FF6B6B"
          iconName="delete-circle-outline"
          text="Delete All Data"
          iconSize={30}
          onPress={localStorage.deleteAll}
        />
        <BrutalButton
          text="Delete All Notes"
          color="#FF6B6B"
          onPress={localStorage.deleteNotes}
          iconName="note-off-outline"
        />
        <BrutalButton
          iconName="checkbox-blank-off-outline"
          color="#FF6B6B"
          text="Delete All Tasks"
          onPress={localStorage.deleteTasks}
        />

        <BrutalButton
          iconName="database-export-outline"
          text="Export Data"
          onPress={() => console.log('Hi')}
        />
        <BrutalButton
          iconName="database-import-outline"
          text="Import Data"
          onPress={() => console.log('Hi')}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    width: '90%',
    gap: 10,
  },
})
