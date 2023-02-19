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
import {AndroidColor} from '@notifee/react-native';

const {UsageLog} = NativeModules;

function App(): JSX.Element {
  const [data, setData] = useState<any>();
  const [timeLimit, setTimeLimit] = useState<number>(0); // usage limit timer in minutes
  const [timeCurrent, setTimeCurrent] = useState<number>(0); // usage limit timer in minutes
  const [number, onChangeNumber] = useState<string>('');

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
  const displayData = () => {
    if (data === undefined || data.length == 0) {
      console.log('Data is empty');
    } else {
      console.log('Data from Android: ', data[3].appName);
      console.log('Data from Android: ', data[3].usageDuration);
    }
  };

  const flush = () => {
    setData('');
  };

  // render the data
  function renderAppItem({item}: {item: any}) {
    return (
      <View>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
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
            {/* <Button
            title={`Set Usage Limit (${app.usageDuration})`}
            onPress={() =>
              handleSetUsageLimit(
                app.appName,
                Math.floor(app.usageDuration / 60), // set usage limit to 1 minute for testing
              )
            }
          /> */}
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

  const openSettings = () => {
    RNAndroidSettingsTool.ACTION_USAGE_ACCESS_SETTINGS(); // Open the main settings screen.
  };

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

      <FlatList
        style={{width: '80%'}}
        data={data}
        keyExtractor={item => item.appName}
        renderItem={item => renderAppItem(item)}
      />
      <View style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Set a timer</Text>
              <View style={styles.modalInpuit}>
                <TextInput
                  style={styles.input}
                  onChangeText={onChangeNumber}
                  value={number}
                  keyboardType="numeric"
                />
                <Text style={styles.modalText}>Minutes</Text>
              </View>

              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setTimeLimit(parseInt(number));
                    console.log(timeLimit);
                  }}>
                  <Text style={styles.textStyle}>Set</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>Close</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 7,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    shadowColor: '#000',
    gap: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 7,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  modalInpuit: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default App;
