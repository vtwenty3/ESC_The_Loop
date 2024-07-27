import {
  Image,
  View,
  StyleSheet,
  PermissionsAndroid,
  Linking,
  Platform,
  Button, Text
} from 'react-native'
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { currentActivity } from '@/modules/usage-stats';
import { useEffect } from 'react';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import React from 'react';



const BACKGROUND_TASK_NAME = 'BACKGROUND_TASK';


export default function HomeScreen() {





  useEffect(() => {
    const initBackgroundFetch = async () => {
      const status = await BackgroundFetch.getStatusAsync();
      switch (status) {
        case BackgroundFetch.Status.Restricted:
        case BackgroundFetch.Status.Denied:
          console.log('Background fetch is restricted or denied');
          return;
        default: {
          console.log('Background fetch is enabled');
          const isTaskDefined = TaskManager.isTaskDefined(BACKGROUND_TASK_NAME);
          if (!isTaskDefined) {
            console.log('Task is not defined');
            return;
          }

          await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK_NAME, {
            minimumInterval: 2, // 2 seconds
            stopOnTerminate: false, // continue on app close
            startOnBoot: true, // start on device boot
          });

          console.log('Background fetch initialized');
        }
      }
    };

    initBackgroundFetch();
  }, []);


  async function logActivity(){
    const ca = await currentActivity() 
    console.log(ca)

  }
  async function openSettings() {
    // Linking.sendIntent('android.settings.USAGE_ACCESS_SETTINGS')


    const pNotification = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    )
  
    if (pNotification) {
      Linking.sendIntent('android.settings.USAGE_ACCESS_SETTINGS')
    } else {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      )
    }
  }

console.log('normal')

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <Button title='Settings' onPress={openSettings} ></Button>

      </ThemedView>
      <ThemedView style={styles.stepContainer}>
      <Button title='Current Activity' onPress={logActivity} ></Button>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    backgroundColor:'white',
    margin: 10,
    padding: 20
  },
  boldText: {

    fontWeight: 'bold',
  }
});
