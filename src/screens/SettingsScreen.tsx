import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {globalStyles} from '../globalStyles';
import Title from '../components/TitleElement';
import Esc from '../components/EscElement';
import BrutalButton from '../components/BrutalButton';
interface Timers {
  [key: string]: {timeLeft?: number; timeSet?: number};
}
export function Settings() {
  const [timers, setTimers] = useState<Timers>({});

  async function deleteNotes() {
    try {
      await AsyncStorage.clear();
      const keys = ['@Notes'];
      try {
        await AsyncStorage.multiRemove(keys);
      } catch (e) {
        // remove error
      }
      console.log('Done');
    } catch (e) {
      console.log('Erorr: ', e);
    }
  }

  async function deleteTasks() {
    try {
      await AsyncStorage.clear();
      const keys = ['@Tasks'];
      try {
        await AsyncStorage.multiRemove(keys);
      } catch (e) {
        // remove error
      }
      console.log('Done');
    } catch (e) {
      console.log('Erorr: ', e);
    }
  }

  async function deleteTimers() {
    try {
      await AsyncStorage.clear();
      const keys = ['@Timers'];
      try {
        await AsyncStorage.multiRemove(keys);
      } catch (e) {
        // remove error
      }
      console.log('Done');
    } catch (e) {
      console.log('Erorr: ', e);
    }
  }

  async function fetchLocalTimers() {
    try {
      const jsonValue = await AsyncStorage.getItem('@local');
      return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch (e) {
      console.log('Error fetching timers from storage; Details:', e);
      return {};
    }
  }
  async function resetTimers() {
    const localTimers = await fetchLocalTimers();
    if (localTimers !== null && Object.keys(localTimers).length > 0) {
      const updatedTimers = {...localTimers};
      console.log('Timers before reset: ', updatedTimers);
      for (const key in updatedTimers) {
        updatedTimers[key].timeLeft = updatedTimers[key].timeSet;
      }
      console.log('Updated Timers: ', updatedTimers);
      await AsyncStorage.setItem('@local', JSON.stringify(updatedTimers));
    } else {
      console.log('[useEffect]: Local data empty! ');
    }
  }

  async function deleteAll() {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.log('Erorr: ', e);
    }

    console.log('Done.');
  }

  function backupData() {
    console.log('Saving data at...');
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
          }}>
          Under Construction
        </Text>
        <BrutalButton
          iconName="timer-sand"
          text="Reset All Timers"
          onPress={resetTimers}
        />
        <BrutalButton
          iconName="timer-sand-empty"
          color="#FF6B6B"
          text="Delete All Timers"
          onPress={deleteTimers}
        />
        <BrutalButton
          color="#FF6B6B"
          iconName="delete-circle-outline"
          text="Delete All Data"
          iconSize={30}
          onPress={deleteAll}
        />
        <BrutalButton
          text="Delete All Notes"
          color="#FF6B6B"
          onPress={deleteNotes}
          iconName="note-off-outline"
        />
        <BrutalButton
          iconName="checkbox-blank-off-outline"
          color="#FF6B6B"
          text="Delete All Tasks"
          onPress={deleteTasks}
        />

        <BrutalButton
          iconName="database-export-outline"
          text="Export Data"
          onPress={backupData}
        />
        <BrutalButton
          iconName="database-import-outline"
          text="Import Data"
          onPress={backupData}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    width: '90%',
    gap: 10,
  },
});
