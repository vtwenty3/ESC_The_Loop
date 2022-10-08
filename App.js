import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {NativeModules} from 'react-native';

import RNAndroidSettingsTool from 'react-native-android-settings-tool';

const {UsageLog} = NativeModules;

console.log('Testing123');
const App = props => {
  return (
    <View style={styles.container}>
      <Text>Hola</Text>
      <Button title={'Click Me'} onPress={onPressHandler} />
      <Button title={'Permission'} onPress={openSettings} />
    </View>
  );
};

const onPressHandler = () => {
  console.log('You clicked me!');
  UsageLog.sendUsageData('Dimana', '24 hours 24 minutes and 69 seconds');
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
