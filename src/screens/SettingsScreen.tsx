import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  FlatList,
} from 'react-native';
import {globalStyles} from '../globalStyles';

import React, {useState, useEffect} from 'react';
import InputFiled from '../components/InputFiledElement';
import Title from '../components/TitleElement';
import Esc from '../components/EscElement';
import BrutalButton from '../components/BrutalButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Settings() {
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
      <View style={{flexDirection: 'row', paddingBottom: 30, gap: 100}}></View>
      <View style={[styles.body, globalStyles.body]}>
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
          iconName="timer-off-outline"
          color="#FF6B6B"
          text="Delete All Timers"
          onPress={deleteTimers}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    marginTop: 20,
    flexDirection: 'column',
    maxWidth: '60%',
  },
});
