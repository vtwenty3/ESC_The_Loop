import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
  NativeModules,
  AppState,
  AppStateStatus,
} from 'react-native';
import BackgroundService from 'react-native-background-actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Timer from 'react-native-background-timer-android';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';

import RNAndroidSettingsTool from 'react-native-android-settings-tool';
import {ModalSetTimer} from './../components/ModalSetTimer';
let activityChanged: boolean = false;

let activity = '';
async function fetchLocalTimers() {
  try {
    const jsonValue = await AsyncStorage.getItem('@local');
    return jsonValue != null ? JSON.parse(jsonValue) : {};
  } catch (e) {
    console.log('Error fetching timers from storage; Details:', e);
    return {};
  }
}

async function getLocal() {
  console.log('[getLocal()]: Getting local timers...');

  try {
    const jsonValue = await AsyncStorage.getItem('@local');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log('error loading local timers; Details:', e);
  }
}

const storeData = async (timers: Timers) => {
  try {
    await AsyncStorage.setItem('@local', JSON.stringify(timers));
    console.log('[storeData]: timers saved to storage.');
  } catch (e) {
    console.log('error saving timers to storage; Details:', e);
  }
};

const sleep = (time: any) =>
  new Promise<void>(resolve => setTimeout(() => resolve(), time));
const taskRandom = async (taskData: any) => {
  await new Promise(async resolve => {
    const {delay} = taskData;
    const {screenOffDelay} = taskData;

    console.log(BackgroundService.isRunning(), delay);
    for (let i = 0; BackgroundService.isRunning(); i++) {
      UsageLog.currentActivity((callBack: string) => {
        // get current activity
        activity = callBack;
      });

      // Fetch the latest timers from storage
      const localTimers = await fetchLocalTimers();

      if (activity !== 'Screen Off!') {
        if (activity in localTimers) {
          if (localTimers[activity].timeLeft! <= 0) {
            console.log('[Timer]: No time left!');
            onDisplayNotification();
            // Call onDisplayNotification() here
          } else {
            localTimers[activity].timeLeft! -= delay / 1000;
            await storeData(localTimers);
            console.log(
              ` [Timer left]: ${localTimers[activity].timeLeft} seconds`,
            );
          }
        }

        console.log('Runned -> ', i);
        console.log('activity -> ', activity);
        await sleep(delay);
      } else {
        console.log('Runned -> ', i);
        console.log('activity -> ', activity);
        await sleep(screenOffDelay);
      }
    }
  });
};

async function onDisplayNotification() {
  const channelId = await notifee.createChannel({
    id: 'main',
    name: 'Main',
    sound: 'default',
    vibration: true,
    importance: AndroidImportance.HIGH, // <-- here
  });

  notifee.displayNotification({
    title: 'Escape The Loop',
    body: `Timer has expired!`,
    id: '123',
    android: {
      importance: AndroidImportance.HIGH,
      channelId,
      ongoing: true,
      pressAction: {
        id: 'default',
      },
    },
  });
}
let playing = BackgroundService.isRunning();

const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask desc',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'exampleScheme://chat/jane',
  parameters: {
    delay: 2000,
    screenOffDelay: 10000,
  },
};

/**
 * Toggles the background task
 */

import {Linking} from 'react-native';

const {UsageLog} = NativeModules;

interface Timers {
  [key: string]: {timeLeft?: number; timeSet?: number};
}
export function Usage() {
  //const localDataInit = initLocal();
  const [data, setData] = useState<any>();
  const [appName, setAppName] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalExpiredVis, setModalExpiredVis] = useState(false);
  const [activity, setActivity] = useState<string>('');
  const [packageName, setPackageName] = useState<string>('');

  const [timers, setTimers] = useState<Timers>({});
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );
  let intervalId: number;
  let timeLeftLocal = 0;

  // const taskRandom = async (taskData: any) => {
  //   await new Promise(async resolve => {
  //     const {delay} = taskData; // delay is 2 seconds currently, change it from options object
  //     console.log(BackgroundService.isRunning(), delay);
  //     for (let i = 0; BackgroundService.isRunning(); i++) {
  //       UsageLog.currentActivity((callBack: string) => {
  //         // get current activity
  //         setActivity(callBack);
  //         test = callBack;
  //       });
  //       console.log('Runned -> ', i);
  //       console.log('activity -> ', test);
  //       if (activityChanged) {
  //         activityChanged = false;
  //       }
  //       await BackgroundService.updateNotification({
  //         taskDesc: 'Runned -> ' + i,
  //       });
  //       await sleep(delay);
  //     }
  //   });
  // };

  const toggleBackground = async () => {
    playing = !playing;
    if (playing) {
      try {
        console.log('Trying to start background service');
        await BackgroundService.start(
          taskData => taskRandom(taskData),
          options,
        );

        console.log('Successful start!');
      } catch (e) {
        console.log('Error', e);
      }
    } else {
      console.log('Stop background service');
      await BackgroundService.stop();
    }
  };

  function getData() {
    console.log('Getting data from Android');
    UsageLog.getAppUsageData2((callBack: string) => {
      setData(JSON.parse(callBack));
      //console.log('Data: ', callBack);
    });
  }

  function displayData() {
    if (data === undefined || data.length == 0) {
      console.log('Data is empty');
    } else {
      console.log('Data from Android: ', data);
    }
  }

  // useEffect(() => {
  //   if (activity in timers) {
  //     timeLeftLocal = timers[activity].timeLeft!;

  //     console.log(`${activity} found in timers`);

  //     intervalId = Timer.setInterval(() => {
  //       if (timeLeftLocal <= 0) {
  //         console.log('No time left!');
  //         onDisplayNotification();
  //       } else {
  //         console.log('Running every 2 seconds...');
  //         timeLeftLocal = timeLeftLocal - 2;
  //         console.log(` [Time Left]: ${timeLeftLocal} seconds`);
  //       }
  //     }, 2000);

  //     return function onActivityChange() {
  //       // executes on activity change if acitvity in timers
  //       Timer.clearInterval(intervalId);
  //       console.log('[useEffect Return]...');
  //       timers[activity] = {
  //         //not using setTimers, as it wont update in background
  //         timeLeft: timeLeftLocal,
  //         timeSet: timers[activity].timeSet,
  //       };
  //       storeData(timers);
  //     };
  //   }
  // }, [activity]);
  async function initTimerState() {
    console.log('[useEffect]: TimersState is empty, fetching local data...');
    const localTimers = await fetchLocalTimers();
    if (localTimers !== null && Object.keys(localTimers).length > 0) {
      console.log('[useEffect]:localTimers Found! setTimers(localTimers)');
      setTimers(localTimers);
    } else {
      console.log('[useEffect]: Local data empty! ');
    }
  }

  useEffect(() => {
    if (Object.keys(timers).length === 0) {
      // Check if the timers state is empty
      initTimerState();
    }
  }, [timers]);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      getData();
      initTimerState();
    }
    try {
      await AsyncStorage.setItem('@appState', nextAppState);
    } catch (e) {
      console.error('Error saving app state:', e);
    }
    setAppState(nextAppState);
  };

  useEffect(() => {
    // Call the function on the initial start
    if (data === undefined || data.length == 0) {
      getData();
    }
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      // Remove AppState listener
      subscription.remove();
    };
  }, [appState]);

  notifee.onBackgroundEvent(async ({type, detail}) => {
    if (type === EventType.PRESS) {
      console.log('Background Press action');
      await Linking.openURL('escapetheloop://tasks');
    }
  });

  function openSettings() {
    RNAndroidSettingsTool.ACTION_USAGE_ACCESS_SETTINGS();
  }

  function renderAppItem({item}: {item: any}) {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            setAppName(item.appName);
            setPackageName(item.packageName);
            setModalVisible(true);
          }}
          style={styles.appContainer}>
          <Image
            source={{uri: `data:image/png;base64,${item.iconBase64}`}} //important to add the data:image/png;base64, part
            style={{width: 50, height: 50, marginRight: 10}}
          />
          <View style={styles.appContainerText}>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#f2f2f2'}}>
              {item.appName}
            </Text>
            <Text style={{color: '#f2f2f2'}}>
              Minutes: {item.usageTimeMinutes}
            </Text>
            <Text style={{color: '#f2f2f2'}}>
              Seconds: {item.usageTimeSeconds}
            </Text>
            <Text style={{color: 'red'}}>
              Time Left: {timers[item.packageName]?.timeLeft}
            </Text>
            <Text style={{color: 'red'}}>
              Time Set: {timers[item.packageName]?.timeSet}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  async function clearLocalTimers() {
    try {
      await AsyncStorage.removeItem('@local');
    } catch (e) {
      // remove error
    }

    console.log('Done.');
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.buttonsContainer}>
        {/* <Button color="#315461" title="Print Data" onPress={displayData} /> */}

        <Button color="#315461" title={'Permission'} onPress={openSettings} />
        <Button color="#315461" title="Start" onPress={toggleBackground} />

        <Button
          color="#315461"
          title="Clear Timers"
          onPress={() => {
            console.log('Timers before clear:', timers);
            clearLocalTimers();
            setTimers({});
          }}
        />
      </View>
      <View style={styles.buttonsContainer}>
        {/* <Button color="#315461" title="Get Data" onPress={getData} /> */}

        {/* <Button
          color="#315461"
          title="Timers Log"
          onPress={() => {
          }} //this is just for testing purposes
        /> */}
      </View>

      <ModalSetTimer
        setVisible={setModalVisible}
        visible={modalVisible}
        name={appName}
        packageName={packageName}
        setTimers={setTimers}
        timers={timers}
      />

      <FlatList
        style={{width: '80%'}}
        data={data}
        keyExtractor={item => item.appName}
        renderItem={item => renderAppItem(item)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#1b1b1d',
  },

  appContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#20232a',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#969696',
    marginVertical: 4,
  },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 10,
  },

  appContainerText: {
    flex: 1,
  },
});
