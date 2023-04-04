import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  NativeModules,
  AppState,
  AppStateStatus,
  PermissionsAndroid,
  Linking,
  Text,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import BackgroundService from 'react-native-background-actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {ModalSetTimer} from '../components/ModalSetTimer';
import {globalStyles} from '../globalStyles';
import Title from '../components/TitleElement';
import Esc from '../components/EscElement';
import UsageElement from '../components/UsageElement';
import BrutalButton from '../components/BrutalButton';
import NoDataFound from '../components/NoDataFound';

const {UsageLog} = NativeModules;
let playing = BackgroundService.isRunning();

let activity = '';
let permission = '';
interface Timers {
  [key: string]: {timeLeft?: number; timeSet?: number};
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
    const {timerExpiredDelay} = taskData;

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
            //console.log('[Timer]: No time left!');
            onDisplayNotification();
            console.log('Runned -> ', i);
            console.log('activity -> ', activity);
            await sleep(timerExpiredDelay);
          } else {
            await BackgroundService.updateNotification({
              taskTitle: activity,
              taskDesc: `Remaining: ${localTimers[activity].timeLeft} seconds`,
              progressBar: {
                value:
                  localTimers[activity].timeSet -
                  localTimers[activity].timeLeft,
                max: localTimers[activity].timeSet,
                indeterminate: false,
              },
            }); // Only Android, iOS will ignore this call

            localTimers[activity].timeLeft! -= delay / 1000;
            await storeData(localTimers);
            console.log(
              ` [Timer left]: ${localTimers[activity].timeLeft} seconds`,
            );
            console.log('Runned -> ', i);
            console.log('activity -> ', activity);
            await sleep(delay);
          }
        } else {
          await BackgroundService.updateNotification({
            taskTitle: 'ESC The Loop',
            taskDesc: 'Current task is not timed.',
            progressBar: undefined,
          });
          console.log('Runned -> ', i);
          console.log('activity -> ', activity);
          await sleep(delay);
        }
      } else {
        console.log('Runned -> ', i);
        console.log('activity -> ', activity);
        await sleep(screenOffDelay);
      }
    }
  });
};
//initial notification when background service is on.
//Its required by android when using background service
//Updated in the taskRandom function
const options = {
  taskName: 'ESC The Loop',
  taskTitle: 'ESC The Loop',
  taskDesc: 'Current task is not timed.',

  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  linkingURI: 'exampleScheme://chat/jane',
  parameters: {
    delay: 2000,
    screenOffDelay: 10000,
    timerExpiredDelay: 8000,
  },
};

//this notification is displayied when the timer has expired
async function onDisplayNotification() {
  const channelId = await notifee.createChannel({
    id: 'main',
    name: 'Main',
    sound: 'default',
    vibration: true,
    importance: AndroidImportance.HIGH, // <-- here
  });

  notifee.displayNotification({
    title: 'ESC',
    body: 'Timer expired!',
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

export function Usage() {
  const [data, setData] = useState<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [timers, setTimers] = useState<Timers>({});
  const [modalAppName, setModalAppName] = useState('');
  const [modalPackageName, setModalPackageName] = useState('');
  const [rotate, setRotate] = useState(false);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  //Gets the usage data from the native module on app open
  useEffect(() => {
    if (data === undefined || data.length == 0) {
      getUsageData();
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

  //checks if timers state is empty and if so, fetches local data
  useEffect(() => {
    if (Object.keys(timers).length === 0) {
      // Check if the timers state is empty
      initTimerState();
    }
  }, [timers]);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      initTimerState();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      getUsageData();
      initTimerState();
    }
    try {
      await AsyncStorage.setItem('@appState', nextAppState);
    } catch (e) {
      console.error('Error saving app state:', e);
    }
    setAppState(nextAppState);
  };

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

  const toggleBackground = async () => {
    setRotate(!rotate);
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

  function getUsageData() {
    console.log('Getting data from Android');
    if (BackgroundService.isRunning() == true) {
      console.log('-------------BackgroundService is running');
      setRotate(true);
    }

    UsageLog.getAppUsageData2((callBack: string) => {
      setData(JSON.parse(callBack));
      //console.log('Data: ', callBack);
    });
  }

  notifee.onBackgroundEvent(async ({type, detail}) => {
    if (type === EventType.PRESS) {
      console.log('Background Press action');
      await Linking.openURL('escapetheloop://tasks');
    }
  });

  async function openSettings() {
    Linking.sendIntent('android.settings.USAGE_ACCESS_SETTINGS');
  }

  async function openSpecificApp(packageName: string) {
    // Linking.sendIntent('android.chrome');
    //Linking.openURL('android.chrome');
    //   Linking.openURL('getmimo://');
    //  await Linking.sendIntent('android.intent.action.VIEW', {
    //    package: "getmimo",
    //  });
    // Linking.canOpenURL('mimo://').then(supported => {
    //   if (supported) {
    //     Linking.openURL('mimo://');
    //   } else {
    //     console.log('sorry invalid url');
    //   }
    // });
  }

  const handleOpenModal = (appName: string, packageName: string) => {
    setModalAppName(appName);
    setModalPackageName(packageName);
    setModalVisible(true);
  };
  return (
    <View style={[globalStyles.root]}>
      <View style={[globalStyles.header]}>
        <View style={[globalStyles.headerChildren]}>
          <Esc onPress={() => console.log('Esc')} />
          <Title text={'Usage'} fontFamily={'Lexend-Medium'} fontSize={40} />
        </View>
      </View>
      <View style={[globalStyles.body]}>
        <View style={styles.buttonsContainer}>
          <View style={styles.brutalButton}>
            <BrutalButton
              text="Permission"
              iconName="shield-sync-outline"
              color="#FF6B6B"
              onPress={openSettings}
            />
          </View>
          <View style={styles.brutalButton}>
            <BrutalButton
              text="Background"
              iconName="sync"
              color="#FF6B6B"
              rotate={rotate}
              onPress={toggleBackground}
            />
          </View>
        </View>
        {data === undefined || data.length == 0 ? (
          <View style={{paddingTop: 20}}>
            <NoDataFound
              boldText="In order to use Escape The Loop you have to grant usage acess permissions:"
              step1="1. Click on the Permission button"
              step2="2. Find Escape The Loop in the
          list of apps"
              step3="3. Toggle Permit usage acess"
              disclamer="Escape The Loop does not send any data to the cloud, everythis is stored
        locally on your phone. It uses the data collected to provide you the features of the app."
            />
          </View>
        ) : null}
        <FlatList
          data={data}
          contentContainerStyle={{paddingTop: 45, gap: 15}}
          keyExtractor={item => item.appName}
          renderItem={({item}) => (
            <UsageElement
              onOpenModal={handleOpenModal}
              timers={timers}
              setTimers={setTimers}
              item={item}
              modalVisible={modalVisible}
            />
          )}
        />

        <ModalSetTimer
          setVisible={setModalVisible}
          visible={modalVisible}
          name={modalAppName}
          packageName={modalPackageName}
          setTimers={setTimers}
          timers={timers}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    width: '90%',
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
});

// function displayData() {
//   if (data === undefined || data.length == 0) {
//     console.log('Data is empty');
//   } else {
//     console.log('Data from Android: ', data);
//   }
// }

/* <Button color="#315461" title="Get Data" onPress={getData} /> */

/* <Button
          color="#315461"
          title="Timers Log"
          onPress={() => {
          }} //this is just for testing purposes
        /> */

/* <Button color="#315461" title="Print Data" onPress={displayData} /> */
{
  /* <View style={{width: '85%', alignSelf: 'center'}}>
          <BrutalButton
            text="Clear Timers"
            iconName="timer-off-outline"
            color="#FF6B6B"
            onPress={() => {
              console.log('Timers before clear:', timers);
              clearLocalTimers();
              setTimers({});
            }}
          />
        </View>
        <View style={{width: '85%', alignSelf: 'center'}}>
          <BrutalButton
            text="Display Data"
            iconName="timer-off-outline"
            color="#FF6B6B"
            onPress={() => {
              console.log('data', data);
            }}
          />
        </View>
        <View style={{width: '85%', alignSelf: 'center'}}>
          <BrutalButton
            text="Refresh Data"
            iconName="sync"
            color="#FF6B6B"
            onPress={() => {
              getUsageData();
            }}
          />
        </View> */
}
