import React, {useState, useEffect} from 'react';
import InputFiled from '../components/InputFiledElement';
import Title from '../components/TitleElement';
import Esc from '../components/EscElement';
import ToggleButtons from '../components/ToggleButtons';
import Note from '../components/NoteElement';

import BrutalButton from '../components/BrutalButton';
import {useFocusEffect} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {globalStyles} from '../globalStyles';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  FlatList,
} from 'react-native';
export function Notes() {
  const [data, setData] = useState<any>();

  async function getMyObject() {
    try {
      const jsonValue = await AsyncStorage.getItem('@myData');
      return jsonValue != null ? await JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(' Error: ', e);
    }
    console.log('Data Loaded.');
  }

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        try {
          const data = await getMyObject();
          console.log('gettttin data', data);
          if (isActive) {
            setData(data);
          }
        } catch (e) {
          // Handle error
        }
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <View style={[globalStyles.root]}>
      <View style={[globalStyles.header]}>
        <View style={[globalStyles.headerChildren]}>
          <Esc onPress={() => console.log('Esc')} />
          <Title text={'Notes'} fontFamily={'Lexend-Medium'} fontSize={40} />
        </View>
      </View>
      <View style={{flexDirection: 'row', paddingBottom: 30, gap: 100}}>
        {/* <BrutalButton text={'printData'} onPress={printData} />
        <BrutalButton text={'getData'} onPress={getData} /> */}
      </View>
      <View style={[globalStyles.body]}>
        <View style={styles.FlatList}>
          <FlatList
            style={{gap: 30, flex: 1, width: '100%'}}
            data={data}
            keyExtractor={item => item.timestamp}
            renderItem={({item}) => (
              <Note
                title={item.title}
                description={item.description}
                onPressTask={() => console.log('')}
                onPressTick={() => console.log('')}
              />
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  FlatList: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
