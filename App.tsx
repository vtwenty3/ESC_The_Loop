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

import RNAndroidSettingsTool from 'react-native-android-settings-tool';
import {ModalSetTimer} from './components/ModalSetTimer';

const {UsageLog} = NativeModules;
function App(): JSX.Element {
  const [data, setData] = useState<any>();
  const [appName, setAppName] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [activity, setActivity] = useState<string>('');
  const [activityOnce, setActivityOnce] = useState(true);
  const [packageName, setPackageName] = useState<string>('');
  const [seconds, setSeconds] = useState(0);
  const [timers, setTimers] = useState<Timers>({});

  interface Timers {
    [key: string]: {timeLeft?: number; timeSet?: number};
  }

  const sleep = (time: any) =>
    new Promise<void>(resolve => setTimeout(() => resolve(), time));
  const taskRandom = async (taskData: any) => {
    await new Promise(async resolve => {
      // For loop with a delay
      const {delay} = taskData;
      console.log(BackgroundService.isRunning(), delay);
      for (let i = 0; BackgroundService.isRunning(); i++) {
        UsageLog.currentActivity((callBack: string) => {
          //setData('');
          //log the callback
          //      console.log('Activity Changed');
          console.log('Runned -> ', i);
          console.log('Activity:', callBack);
          setActivity(callBack);
          //console.log('Current activity state ', currentActivity);

          if (timers[callBack] !== undefined) {
            //console.log('Timer for this app is set');
            console.log('Timer for this app is set to: ', timers[callBack]);
          }
        });

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

  // useEffect(() => {
  //   if (activity in timers) {
  //     console.log(`${activity} found in timers`);
  //     setTimers({
  //       ...timers,
  //       [activity]: {
  //         timeLeft: timers[activity].timeSet! - 1,
  //         timeSet: timers[activity].timeSet,
  //       },
  //     });
  //   }
  // }, [activity]);

  useEffect(() => {
    if (activity in timers) {
      console.log(`${activity} found in timers`);
      // Reduce timeLeft every second
      setTimers({
        ...timers,
        [activity]: {
          timeLeft: timers[activity].timeSet! - 1,
          timeSet: timers[activity].timeSet,
        },
      });
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

  return (
    <View style={styles.mainContainer}>
      <View style={styles.buttonsContainer}>
        <Button color="#315461" title="Print Data" onPress={displayData} />
        <Button color="#315461" title="Test" onPress={toggleBackground} />
        <Button color="#315461" title={'Permission'} onPress={openSettings} />
      </View>
      <View style={styles.buttonsContainer}>
        <Button color="#315461" title="Get Data" onPress={getData} />
        <Button
          color="#315461"
          title="Log Timers"
          onPress={() => {
            console.log(timers);
          }}
        />
        <Text>Seconds: {seconds}</Text>
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
    marginVertical: 10,
  },

  appContainerText: {
    flex: 1,
  },
});

export default App;
