import {
  Image,
  View,
  StyleSheet,
  PermissionsAndroid,
  Linking,
  Platform,
  Button
} from 'react-native'
import BackgroundService from 'react-native-background-actions'

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { currentActivity } from '@/modules/usage-stats';
import { toggleBackground } from '@/hooks/useCurrentActivity'
import { useEffect } from 'react';

export default function HomeScreen() {

  useEffect(() => {
    if (!BackgroundService.isRunning()) {
      toggleBackground()
    }
    // setAppUsageData()
    // return () => {
      // Remove AppState listener
      // appStateListener.remove()
    // }
  }, [])

  async function logActivity(){
    const ca = await currentActivity() 
    console.log(ca)

  }
  async function openSettings() {
    Linking.sendIntent('android.settings.USAGE_ACCESS_SETTINGS')


    // const pNotification = await PermissionsAndroid.check(
    //   PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    // )
  
    // if (pNotification) {
    //   Linking.sendIntent('android.settings.USAGE_ACCESS_SETTINGS')
    // } else {
    //   await PermissionsAndroid.request(
    //     PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    //   )
    // }
  }



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
});
