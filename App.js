import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {NativeModules} from 'react-native';
const {UsageLog} = NativeModules;

console.log('Testing123');
const App = props => {
  return (
    <View style={styles.container}>
      <Text>Hola</Text>
      <Button title={'Click Me'} onPress={onPressHandler} />
    </View>
  );
};

const onPressHandler = () => {
  console.log('You clicked me!');
  UsageLog.sendUsageData('Dimana', '24 hours 24 minutes and 69 seconds');
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
