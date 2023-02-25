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
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import {NativeModules} from 'react-native';
import RNAndroidSettingsTool from 'react-native-android-settings-tool';
import notifee from '@notifee/react-native';
import {ModalSetTimer} from './components/ModalSetTimer';
import {AndroidColor} from '@notifee/react-native';

const {UsageLog} = NativeModules;

function App(): JSX.Element {
  const [data, setData] = useState<any>();
  const [appName, setAppName] = useState<string>('');

  const [timeCurrent, setTimeCurrent] = useState<number>(0); // usage limit timer in minutes
  const [number, onChangeNumber] = useState<string>('');
  // const [timers, setTimers] = useState({});
  const [timeLimit, setTimeLimit] = useState<number>(0); // usage limit timer in minutes

  interface Timers {
    [key: string]: number;
  }
  const [timers, setTimers] = useState<Timers>({});

  const [modalVisible, setModalVisible] = useState(false);

  const getData = () => {
    UsageLog.getDataAndroid((callBack: string) => {
      setData('');
      setData(JSON.parse(callBack)); //important to parse the JSON string, or else it will be a string
    });
  };

  // Call getData every 2 seconds
  useEffect(() => {
    // const intervalId = setInterval(getData, 2000);
    // return () => clearInterval(intervalId);
  }, []);

  // testing
  function displayData() {
    if (data === undefined || data.length == 0) {
      console.log('Data is empty');
    } else {
      console.log('Data from Android: ', data[3].appName);
      console.log('Data from Android: ', data[3].usageDuration);
    }
  }

  function flush() {
    setData('');
  }
  async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission();
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }

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
            source={{uri: `data:image/png;base64,${item.icon}`}} //important to add the data:image/png;base64, part
            style={{width: 50, height: 50, marginRight: 10}}
          />
          <View style={styles.appContainerText}>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#f2f2f2'}}>
              {item.appName}
            </Text>
            <Text style={{color: '#f2f2f2'}}>{item.usageDuration}</Text>
            <Text style={{color: '#f2f2f2'}}>
              {'Minutes Total: ' + item.minutesTotal}
            </Text>
            <Text style={{color: '#f2f2f2'}}>
              Limit: {timers[item.appName]}
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
        <Button color="#315461" title="Flush" onPress={flush} />
        <Button color="#315461" title={'Permission'} onPress={openSettings} />
      </View>
      <View style={styles.buttonsContainer}>
        <Button color="#315461" title="Get Data" onPress={getData} />
        <Button
          color="#315461"
          title="Display Notification"
          onPress={() => onDisplayNotification()}
        />
        <Button color="#315461" title="Get Data" onPress={getData} />
      </View>
      <ModalSetTimer
        setVisible={setModalVisible}
        visible={modalVisible}
        name={appName}
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
