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
  const [timers, setTimers] = useState<Timers>({});
  const [modalVisible, setModalVisible] = useState(false);

  interface Timers {
    [key: string]: string;
  }

  const sleep = (time: any) =>
    new Promise<void>(resolve => setTimeout(() => resolve(), time));

  const taskRandom = async (taskData: any) => {
    await new Promise(async resolve => {
      // For loop with a delay
      const {delay} = taskData;
      console.log(BackgroundService.isRunning(), delay);
      for (let i = 0; BackgroundService.isRunning(); i++) {
        console.log('Runned -> ', i);
        await UsageLog.currentActivity((callBack: string) => {
          //setData('');
          //log the callback
          console.log('Current ACtivity: ' + callBack);
          //setData(JSON.parse(callBack)); //important to parse the JSON string, or else it will be a string
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
      delay: 5000,
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
    UsageLog.getAppUsageData((callBack: string) => {
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

  useEffect(() => {}, []);

  function openSettings() {
    RNAndroidSettingsTool.ACTION_USAGE_ACCESS_SETTINGS(); // Open the main settings screen.
  }

  // render the data
  function renderAppItem({item}: {item: any}) {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
            setAppName(item.appName);
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
            <Text style={{color: '#f2f2f2'}}>Package: {item.packageName}</Text>
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
          onPress={() => console.log(timers)}
        />
      </View>
      <ModalSetTimer
        setVisible={setModalVisible}
        visible={modalVisible}
        name={appName}
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
