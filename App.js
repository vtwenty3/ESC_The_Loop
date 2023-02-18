import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Button, FlatList, Image} from 'react-native';
import {NativeModules} from 'react-native';
import RNAndroidSettingsTool from 'react-native-android-settings-tool';

const {UsageLog} = NativeModules;
const App = props => {
  const [data, setData] = useState();
  const getData = () => {
    UsageLog.getDataAndroid(callBack => {
      setData('');
      setData(JSON.parse(callBack)); //important to parse the JSON string, or else it will be a string
    });
  };
  // testing
  const displayData = () => {
    if (data === undefined || data.length == 0) {
      console.log('Data is empty');
    } else {
      // console.log('Data from Android: ', data[0].icon);
      console.log('Data from Android: ', data[3].appName);
      console.log('Data from Android: ', data[3].usageDuration);
    }
  };
  const flush = () => {
    setData('');
  };

  // render the data
  function renderAppItem({item}) {
    return (
      <View style={styles.appContainer}>
        <Image
          source={{uri: `data:image/png;base64,${item.icon}`}} //important to add the data:image/png;base64, part
          style={{width: 50, height: 50, marginRight: 10}}
        />
        <View style={styles.appContainerText}>
          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#f2f2f2'}}>
            {item.appName}
          </Text>
          <Text style={{color: '#f2f2f2'}}>{item.usageDuration}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.buttonsContainer}>
        <Button
          color="#315461"
          style={styles.button}
          title={'Get Data'}
          onPress={getData}
        />
        <Button color="#315461" title={'Display Data'} onPress={displayData} />
        <Button color="#315461" title={'Permission'} onPress={openSettings} />
        <Button color="#315461" title={'Flush'} onPress={flush} />
      </View>

      <FlatList
        style={{width: '80%'}}
        data={data}
        keyExtractor={item => item.appName}
        renderItem={item => [item].map(renderAppItem)}
      />
    </View>
  );
};

const openSettings = () => {
  RNAndroidSettingsTool.ACTION_USAGE_ACCESS_SETTINGS(); // Open the main settings screen.
};

// const onPressPermission = async () => {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.CAMERA,
//       {
//         title: 'Cool Photo App Camera Permission',
//         message:
//           'Cool Photo App needs access to your camera ' +
//           'so you can take awesome pictures.',
//         buttonNeutral: 'Ask Me Later',
//         buttonNegative: 'Cancel',
//         buttonPositive: 'OK',
//       },
//     );
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log('You can use the camera');
//     } else {
//       console.log('Camera permission denied');
//     }
//   } catch (err) {
//     console.warn(err);
//   }
// };

export default App;

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

  button: {
    color: '#841584',
  },
  appContainerText: {
    flex: 1,
  },
});
