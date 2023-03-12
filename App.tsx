import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  Alert,
  Image,
  TouchableOpacity,
  Pressable,
  TextInput,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import BackgroundService from 'react-native-background-actions';
import notifee, {
  AndroidImportance,
  AndroidCategory,
} from '@notifee/react-native';

import RNAndroidSettingsTool from 'react-native-android-settings-tool';
import {ModalSetTimer} from './components/ModalSetTimer';
import {ModalExpired} from './components/ModalExpired';

//variables that are used and changed in the background
let activityChanged: boolean = false;
let temptimeLeftLocal = 0;
let tempactivity = '';

const {UsageLog} = NativeModules;
function App(): JSX.Element {
  const [data, setData] = useState<any>();
  const [appName, setAppName] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalExpiredVis, setModalExpiredVis] = useState(false);

  const [activity, setActivity] = useState<string>('');
  const [activityOnce, setActivityOnce] = useState(true);
  const [packageName, setPackageName] = useState<string>('');
  const [seconds, setSeconds] = useState(0);
  const [timers, setTimers] = useState<Timers>({});

  const [timeCounter, setTimecounter] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);

  //variables thare are used and changed by useEffect (useState updates only in foreground)
  let intervalId: number;
  let i = 0;
  let timeLeftLocal = 0;
  let tempi = 0;

  interface Timers {
    [key: string]: {timeLeft?: number; timeSet?: number};
  }

  const sleep = (time: any) =>
    new Promise<void>(resolve => setTimeout(() => resolve(), time));
  const taskRandom = async (taskData: any) => {
    await new Promise(async resolve => {
      const {delay} = taskData; // delay is 2 seconds currently, change it from options object
      console.log(BackgroundService.isRunning(), delay);
      for (let i = 0; BackgroundService.isRunning(); i++) {
        UsageLog.currentActivity((callBack: string) => {
          // get current activity
          //console.log('Runned -> ', i);
          setActivity(callBack);
        });

        //console.log('[BackgroundTask Set]: ' + activityChanged);
        if (activityChanged) {
          //activated from useEffect cleanup
          console.log('[BackgroundTask Setting Timer]...');
          console.log(
            'tempactivity: ' +
              tempactivity +
              ' temptimeLeftLocal: ' +
              temptimeLeftLocal,
          );

          timers[tempactivity] = {
            timeLeft: temptimeLeftLocal,
            timeSet: timers[tempactivity].timeSet,
          };

          //console.log('...[BackgroundTask Timer Set]');
          tempi = 0;
          temptimeLeftLocal = 0;
          tempactivity = '';
          activityChanged = false;
          // UsageLog.startOverlay();
          // toggleModal();
          // UsageLog.startOverlayService();
          // setModalExpiredVis(true);
        }

        await BackgroundService.updateNotification({
          taskDesc: 'Runned -> ' + i,
        });

        await sleep(delay);
      }
    });
  };
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
    },
  };

  /**
   * Toggles the background task
   */
  const toggleBackground = async () => {
    playing = !playing;
    if (playing) {
      try {
        console.log('Trying to start background service');
        await BackgroundService.start(taskRandom, options);

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

  useEffect(() => {
    if (activity in timers) {
      i = 0;
      timeLeftLocal = timers[activity].timeLeft!;
      console.log(`${activity} found in timers`);
      intervalId = setInterval(() => {
        console.log('Running every 2 seconds...');
        timeLeftLocal = timeLeftLocal - 2;
        console.log(` [Time Left]: ${timeLeftLocal} seconds`);
        if (timeLeftLocal <= 0) {
          clearInterval(intervalId);
          console.log('No time left!');
          onDisplayNotification();
        }
      }, 2000);

      return function cleanup() {
        //exectured when activity changes, or app is closed. App has to be in timers
        clearInterval(intervalId);
        temptimeLeftLocal = timeLeftLocal;
        tempactivity = activity;
        activityChanged = true; //this would trigger attepmpt to change [timers]timeleft in the background
        console.log('[useEffect Return cleanup()] ');
      };
    }
  }, [activity]);

  function openSettings() {
    RNAndroidSettingsTool.ACTION_USAGE_ACCESS_SETTINGS(); // Open the main settings screen.
  }

  // render the data
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
            {/* <Text style={{color: '#f2f2f2'}}>Package: {item.packageName}</Text> */}
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

  async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'main',
      name: 'Main',
      sound: 'default',
      vibration: true,
      importance: AndroidImportance.HIGH, // <-- here
    });

    // await notifee.displayNotification({
    //   id: '123',
    //   title: 'Notification Title',
    //   body: 'Main body content of the notification',
    //   android: {
    //     channelId,
    //     importance: AndroidImportance.HIGH,
    //   },
    // });

    notifee.displayNotification({
      title: 'Escape The Loop',
      body: `Timer for  has expired!`,
      id: '123',

      android: {
        importance: AndroidImportance.HIGH,
        channelId,
        ongoing: true,
      },
    });
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.buttonsContainer}>
        <Button color="#315461" title="Print Data" onPress={displayData} />
        <Button color="#315461" title="Start" onPress={toggleBackground} />

        <Button color="#315461" title={'Permission'} onPress={openSettings} />
      </View>
      <View style={styles.buttonsContainer}>
        <Button color="#315461" title="Get Data" onPress={getData} />
        <Button
          color="#315461"
          title="Clear Timers"
          onPress={() => {
            console.log('Timers before clear:', timers);
            setTimers({});
          }}
        />
        <Button
          color="#315461"
          title="Expired"
          onPress={() => onDisplayNotification()}
        />
      </View>
      <ModalSetTimer
        setVisible={setModalVisible}
        visible={modalVisible}
        name={appName}
        packageName={packageName}
        setTimers={setTimers}
        timers={timers}
      />
      <ModalExpired
        setVisible={setModalExpiredVis}
        visible={modalExpiredVis}
        name={'Escape The Loop'}
        packageName={'com.escapetheloop.main'}
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
    marginVertical: 10,
  },

  appContainerText: {
    flex: 1,
  },
});

export default App;
